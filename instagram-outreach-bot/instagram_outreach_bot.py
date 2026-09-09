import argparse
import csv
import json
import os
import random
import sys
import time
from datetime import datetime
from pathlib import Path

# Ensure UTF-8 output on Windows consoles for emojis
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError

from templates import get_outreach_message

BASE_DIR = Path(__file__).parent
LEADS_FILE = BASE_DIR / "leads.csv"
HISTORY_FILE = BASE_DIR / "sent_instagram_history.json"
USER_DATA_DIR = BASE_DIR / "browser_profile"
PREVIEW_FILE = BASE_DIR / "dry_run_preview.txt"

def load_history() -> dict:
    if HISTORY_FILE.exists():
        try:
            with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_history(history: dict):
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(history, f, indent=2, ensure_ascii=False)

def log_contact(handle: str, name: str, business_name: str, category: str, message: str, status: str, error: str = ""):
    history = load_history()
    history[handle.lower()] = {
        "timestamp": datetime.now().isoformat(),
        "name": name,
        "business_name": business_name,
        "category": category,
        "status": status,
        "error": error,
        "message_snippet": message[:120] + "..." if len(message) > 120 else message
    }
    save_history(history)

def load_leads(filter_category: str = None, no_website_only: bool = False) -> list:
    if not LEADS_FILE.exists():
        print(f"Error: {LEADS_FILE} does not exist.")
        return []

    leads = []
    with open(LEADS_FILE, "r", encoding="utf-8", errors="ignore") as f:
        reader = csv.DictReader(f)
        for row in reader:
            handle = row.get("instagram_handle", "").strip().lstrip("@")
            if not handle:
                continue
            category = row.get("category", "General").strip()
            if filter_category and category.lower() != filter_category.lower():
                continue

            has_web_str = row.get("has_website", "").strip().lower()
            if has_web_str in ("no", "false", "0", "none") or category.lower() in ("nowebsite", "no_website", "no website"):
                has_website = False
            elif has_web_str in ("yes", "true", "1"):
                has_website = True
            else:
                has_website = None  # Will auto-detect on profile if None

            if no_website_only and has_website is True:
                continue

            leads.append({
                "handle": handle,
                "name": row.get("name", "").strip(),
                "business_name": row.get("business_name", "").strip(),
                "category": category,
                "has_website": has_website,
                "notes": row.get("notes", "").strip()
            })
    return leads

def human_type(page, selector, text: str):
    """Types text with natural human variation."""
    element = page.locator(selector).first
    element.click()
    page.wait_for_timeout(random.randint(400, 800))
    
    # Split text by lines to preserve line breaks (Shift+Enter for newline on Instagram)
    lines = text.split("\n")
    for l_idx, line in enumerate(lines):
        if line:
            # Type in chunks or characters
            for char in line:
                page.keyboard.type(char, delay=random.randint(25, 60))
        if l_idx < len(lines) - 1:
            # Send newline without submitting
            page.keyboard.down("Shift")
            page.keyboard.press("Enter")
            page.keyboard.up("Shift")
            page.wait_for_timeout(random.randint(150, 350))

def dismiss_popups(page):
    """Dismisses notification and save login prompts."""
    popup_texts = ["Not Now", "Not now", "Cancel"]
    for text in popup_texts:
        try:
            btn = page.locator(f"button:has-text('{text}')")
            if btn.count() > 0 and btn.first.is_visible():
                btn.first.click()
                page.wait_for_timeout(1000)
        except Exception:
            pass

def run_dry_run(filter_category: str = None, no_website_only: bool = False):
    print("=" * 60)
    print("         INSTAGRAM OUTREACH - DRY RUN PREVIEW")
    if no_website_only:
        print("    [TARGETING LEADS WITH NO WEBSITE - WEBSITE PITCH]")
    print("=" * 60)
    print("No messages will be sent. Validating leads & generating copy...\n")

    history = load_history()
    leads = load_leads(filter_category, no_website_only=no_website_only)

    if not leads:
        print("No matching leads found in leads.csv.")
        return

    preview_lines = [
        f"Instagram Outreach Preview - Generated {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        f"No-Website Only Filter: {no_website_only}",
        "=" * 60,
        ""
    ]

    ready_count = 0
    skipped_count = 0

    for idx, lead in enumerate(leads, 1):
        handle = lead["handle"]
        if handle.lower() in history and history[handle.lower()].get("status") == "SENT":
            print(f"[{idx}/{len(leads)}] @{handle} - ALREADY CONTACTED (Skipping)")
            skipped_count += 1
            continue

        has_web = lead.get("has_website")
        # In dry-run, if has_web is None, assume True unless category says NoWebsite
        effective_has_web = False if has_web is False else True
        if lead["category"].lower() in ("nowebsite", "no_website", "no website"):
            effective_has_web = False

        message = get_outreach_message(
            lead["category"], 
            lead["name"], 
            lead["business_name"], 
            has_website=effective_has_web
        )
        ready_count += 1

        pitch_type = "WEBSITE CREATION PITCH" if not effective_has_web else "CUSTOM SOFTWARE / AUTOMATION PITCH"
        info_header = f"[{ready_count}] TARGET: @{handle} | Cat: {lead['category']} | Pitch: {pitch_type} | Biz: {lead['business_name']}"
        print(info_header)
        print("-" * 50)
        print(message)
        print("=" * 60 + "\n")

        preview_lines.append(info_header)
        preview_lines.append("-" * 50)
        preview_lines.append(message)
        preview_lines.append("\n" + "=" * 60 + "\n")

    with open(PREVIEW_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(preview_lines))

    print(f"\nDRY RUN COMPLETE:")
    print(f"  • Total leads evaluated: {len(leads)}")
    print(f"  • Already contacted (skipped): {skipped_count}")
    print(f"  • Ready to send: {ready_count}")
    print(f"  • Full preview saved to: {PREVIEW_FILE.name}")

def setup_login():
    """Opens a visible browser window allowing the user to manually log into Instagram."""
    print("=" * 60)
    print("     INSTAGRAM BROWSER LOGIN SETUP")
    print("=" * 60)
    print("1. A browser window will open.")
    print("2. Log into your Instagram account normally (complete any 2FA/SMS code).")
    print("3. Once your feed loads and you are logged in, return here and press ENTER.")
    print("=" * 60)

    USER_DATA_DIR.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        context = p.chromium.launch_persistent_context(
            user_data_dir=str(USER_DATA_DIR),
            headless=False,
            viewport={"width": 1280, "height": 850},
            args=["--disable-blink-features=AutomationControlled"]
        )
        page = context.pages[0] if context.pages else context.new_page()
        page.goto("https://www.instagram.com/", timeout=60000)
        
        input("\n>>> Press ENTER after you have successfully logged into Instagram... <<<")
        
        # Verify login
        time.sleep(2)
        dismiss_popups(page)
        cookies = context.cookies()
        session_found = any(c['name'] == 'sessionid' for c in cookies)
        if session_found:
            print("\nSUCCESS: Login session saved successfully in browser_profile/!")
        else:
            print("\nWARNING: 'sessionid' cookie not detected yet. If you logged in, your profile is still stored.")

        context.close()
        print("Browser closed. You are now ready to run campaigns!")

def send_outreach_dms(max_limit: int = 10, delay_range: tuple = (50, 90), headless: bool = False, filter_category: str = None, no_website_only: bool = False):
    print("=" * 60)
    print("         INSTAGRAM OUTREACH CAMPAIGN RUNNER")
    if no_website_only:
        print("    [TARGETING LEADS WITH NO WEBSITE - WEBSITE PITCH]")
    print("=" * 60)
    print(f"Max DMs for this batch: {max_limit}")
    print(f"Delay between messages: {delay_range[0]} - {delay_range[1]} seconds")
    print(f"Headless mode: {headless}")
    if filter_category:
        print(f"Category filter: {filter_category}")
    print("=" * 60 + "\n")

    history = load_history()
    leads = load_leads(filter_category, no_website_only=no_website_only)

    # Filter out already contacted
    pending_leads = [l for l in leads if l["handle"].lower() not in history or history[l["handle"].lower()].get("status") != "SENT"]

    if not pending_leads:
        print("No pending leads to contact in leads.csv!")
        return

    print(f"Total leads: {len(leads)} | Pending leads to message: {len(pending_leads)}")
    confirm = input("Are you sure you want to start sending live Instagram DMs? (y/N): ").strip().lower()
    if confirm not in ("y", "yes"):
        print("Operation cancelled by user.")
        return

    USER_DATA_DIR.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        print("\nLaunching browser with saved profile...")
        context = p.chromium.launch_persistent_context(
            user_data_dir=str(USER_DATA_DIR),
            headless=headless,
            viewport={"width": 1280, "height": 850},
            args=["--disable-blink-features=AutomationControlled"]
        )
        page = context.pages[0] if context.pages else context.new_page()

        # Step 1: Verify login state
        page.goto("https://www.instagram.com/", timeout=60000)
        page.wait_for_timeout(3000)
        dismiss_popups(page)

        if "accounts/login" in page.url:
            print("\nERROR: Not logged in! Please run 'python instagram_outreach_bot.py --setup-login' first.")
            context.close()
            return

        sent_count = 0

        for lead in pending_leads:
            if sent_count >= max_limit:
                print(f"\nReached batch limit of {max_limit} DMs. Stopping for account safety.")
                break

            handle = lead["handle"]
            name = lead["name"]
            biz_name = lead["business_name"]
            cat = lead["category"]

            print(f"\n--- [{sent_count + 1}/{max_limit}] Visiting @{handle} ({biz_name}) ---")
            profile_url = f"https://www.instagram.com/{handle}/"
            
            try:
                page.goto(profile_url, timeout=30000)
                page.wait_for_timeout(random.randint(2500, 4500))
                dismiss_popups(page)

                # Check if page is broken or user not found
                if "Sorry, this page isn't available" in page.content() or page.locator("text=Page Not Found").count() > 0:
                    print(f"  [!] Profile @{handle} does not exist or is unavailable.")
                    log_contact(handle, name, biz_name, cat, "", "FAILED", "Profile unavailable")
                    continue

                # Check for website link in bio
                has_web = lead.get("has_website")
                if has_web is None:
                    # Detect if bio has a link
                    bio_link = page.locator("header a[href*='l.instagram.com'], header a[rel*='nofollow'], section a[href*='l.instagram.com']").first
                    has_web = (bio_link.count() > 0 and bio_link.is_visible())
                    print(f"  [Bio Check] External link in bio: {'Yes' if has_web else 'No (Will use Website Creation Pitch)'}")

                if no_website_only and has_web is True:
                    print(f"  [Skipping] Lead already has a website and --no-website-only filter is active.")
                    continue

                # Locate the Message button
                # Selectors for 'Message' button on desktop profile
                message_btn_selectors = [
                    "//div[text()='Message' and @role='button']",
                    "//button[div[text()='Message']]",
                    "button:has-text('Message')",
                    "div[role='button']:has-text('Message')",
                    "header button:has-text('Message')"
                ]

                message_btn = None
                for sel in message_btn_selectors:
                    loc = page.locator(sel).first
                    if loc.count() > 0 and loc.is_visible():
                        message_btn = loc
                        break

                if not message_btn:
                    print(f"  [!] Message button not found on @{handle}'s profile (private or DMs restricted).")
                    log_contact(handle, name, biz_name, cat, "", "FAILED", "Message button not visible/allowed")
                    continue

                # Click Message button
                message_btn.click()
                print("  [>] Clicked 'Message' button...")
                page.wait_for_timeout(random.randint(3000, 5000))
                dismiss_popups(page)

                # Find the chat input box
                chat_box_selectors = [
                    "div[role='textbox'][aria-label*='Message']",
                    "div[contenteditable='true'][role='textbox']",
                    "div[role='textbox']",
                    "p[class*='xat24cr']"
                ]

                chat_box = None
                for sel in chat_box_selectors:
                    box = page.locator(sel).first
                    if box.count() > 0 and box.is_visible():
                        chat_box = box
                        break

                if not chat_box:
                    print(f"  [!] Could not locate chat input box for @{handle}.")
                    log_contact(handle, name, biz_name, cat, "", "FAILED", "Chat input box not found")
                    continue

                # Generate customized spintax message
                outreach_text = get_outreach_message(cat, name, biz_name, has_website=has_web)
                pitch_type = "Website Creation" if not has_web else "Custom Software"
                print(f"  [+] Typing {pitch_type} outreach message ({len(outreach_text)} chars)...")
                human_type(page, chat_box, outreach_text)
                page.wait_for_timeout(random.randint(1200, 2500))

                # Press Enter to send
                page.keyboard.press("Enter")
                page.wait_for_timeout(random.randint(2000, 3500))

                # Check if Send button is also present just in case
                send_btn = page.locator("button:has-text('Send')").first
                if send_btn.count() > 0 and send_btn.is_visible():
                    try:
                        send_btn.click()
                        page.wait_for_timeout(2000)
                    except Exception:
                        pass

                print(f"  [SUCCESS] DM sent to @{handle}!")
                log_contact(handle, name, biz_name, cat, outreach_text, "SENT")
                sent_count += 1

                # Randomized safe delay before next action
                if sent_count < max_limit and sent_count < len(pending_leads):
                    wait_seconds = random.randint(delay_range[0], delay_range[1])
                    print(f"  [Waiting] Cooling down for {wait_seconds}s to mimic natural human activity...")
                    for remaining in range(wait_seconds, 0, -5):
                        time.sleep(5)
                        print(f"    ... {remaining - 5}s remaining")

            except PlaywrightTimeoutError:
                print(f"  [Timeout] Action timed out on @{handle}")
                log_contact(handle, name, biz_name, cat, "", "TIMEOUT", "Playwright Timeout")
            except Exception as e:
                print(f"  [Error] Failed to message @{handle}: {e}")
                log_contact(handle, name, biz_name, cat, "", "ERROR", str(e))

        context.close()
        print("\n" + "=" * 60)
        print(f"CAMPAIGN FINISHED: Sent {sent_count} DMs.")
        print(f"Detailed history saved in {HISTORY_FILE.name}")
        print("=" * 60)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Instagram Direct Outreach Bot for Custom Software")
    parser.add_argument("--setup-login", action="store_true", help="Launch browser to manually log into Instagram")
    parser.add_argument("--dry-run", action="store_true", help="Preview all messages without sending")
    parser.add_argument("--limit", type=int, default=10, help="Maximum number of DMs to send in this run (default: 10)")
    parser.add_argument("--category", type=str, default=None, help="Filter leads by category (e.g. CA, Company, LocalService)")
    parser.add_argument("--headless", action="store_true", help="Run browser in headless mode")
    parser.add_argument("--min-delay", type=int, default=45, help="Minimum delay between DMs in seconds (default: 45)")
    parser.add_argument("--max-delay", type=int, default=85, help="Maximum delay between DMs in seconds (default: 85)")
    parser.add_argument("--no-website-only", action="store_true", help="Only target businesses/CAs that do NOT have a website")

    args = parser.parse_args()

    if args.setup_login:
        setup_login()
    elif args.dry_run:
        run_dry_run(filter_category=args.category, no_website_only=args.no_website_only)
    else:
        # If no explicit flag is passed, default to dry-run or prompt
        if len(sys.argv) == 1:
            print("No arguments provided. Running DRY RUN preview by default.")
            print("Use '--help' to see all available commands.\n")
            run_dry_run()
        else:
            send_outreach_dms(
                max_limit=args.limit,
                delay_range=(args.min_delay, args.max_delay),
                headless=args.headless,
                filter_category=args.category,
                no_website_only=args.no_website_only
            )
