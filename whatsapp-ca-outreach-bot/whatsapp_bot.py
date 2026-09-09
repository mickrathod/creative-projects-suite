import argparse
import csv
import json
import os
import random
import re
import sys
import time
import urllib.parse
from datetime import datetime
from pathlib import Path
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError

# Ensure UTF-8 console output for Windows terminal
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

from templates import get_ca_message

BASE_DIR = Path(__file__).parent
CONTACTS_FILE = BASE_DIR / "ca_contacts.csv"
HISTORY_FILE = BASE_DIR / "sent_whatsapp_history.json"
USER_DATA_DIR = BASE_DIR / "whatsapp_profile"
PREVIEW_FILE = BASE_DIR / "dry_run_preview.txt"

def clean_phone(phone: str, default_country: str = "91") -> str:
    """Normalizes phone numbers to international digits (e.g. 919812345678)."""
    digits = re.sub(r"\D", "", str(phone))
    if not digits:
        return ""
    digits = digits.lstrip("0")
    if len(digits) == 10:
        digits = default_country + digits
    return digits

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

def log_contact(phone: str, ca_name: str, firm_name: str, pitch_type: str, message: str, status: str, error: str = ""):
    history = load_history()
    history[phone] = {
        "timestamp": datetime.now().isoformat(),
        "ca_name": ca_name,
        "firm_name": firm_name,
        "pitch_type": pitch_type,
        "status": status,
        "error": error,
        "message_snippet": message[:120] + "..." if len(message) > 120 else message
    }
    save_history(history)

def load_contacts(filter_pitch: str = None) -> list:
    if not CONTACTS_FILE.exists():
        print(f"Error: {CONTACTS_FILE} does not exist.")
        return []

    contacts = []
    with open(CONTACTS_FILE, "r", encoding="utf-8", errors="ignore") as f:
        reader = csv.DictReader(f)
        for row in reader:
            raw_phone = row.get("phone_number", "").strip()
            phone = clean_phone(raw_phone)
            if not phone or len(phone) < 10:
                continue

            pitch_type = row.get("pitch_type", "PORTAL").strip().upper()
            if filter_pitch and filter_pitch.upper() != pitch_type:
                continue

            contacts.append({
                "phone": phone,
                "ca_name": row.get("ca_name", "").strip(),
                "firm_name": row.get("firm_name", "").strip(),
                "city": row.get("city", "").strip(),
                "pitch_type": pitch_type,
                "notes": row.get("notes", "").strip()
            })
    return contacts

def run_dry_run(filter_pitch: str = None):
    print("=" * 65)
    print("       CA WHATSAPP OUTREACH - DRY RUN PREVIEW")
    print("=" * 65)
    print("No messages will be sent. Validating contacts & generating copy...\n")

    history = load_history()
    contacts = load_contacts(filter_pitch)

    if not contacts:
        print("No valid CA contacts found in ca_contacts.csv.")
        return

    preview_lines = [
        f"CA WhatsApp Outreach Preview - Generated {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        "=" * 65,
        ""
    ]

    ready_count = 0
    skipped_count = 0

    for idx, contact in enumerate(contacts, 1):
        phone = contact["phone"]
        if phone in history and history[phone].get("status") == "SENT":
            print(f"[{idx}/{len(contacts)}] +{phone} - ALREADY CONTACTED (Skipping)")
            skipped_count += 1
            continue

        message = get_ca_message(
            contact["pitch_type"],
            contact["ca_name"],
            contact["firm_name"],
            contact["city"]
        )
        ready_count += 1

        info_header = (
            f"[{ready_count}] TARGET: CA {contact['ca_name']} (+{phone})\n"
            f"     Firm: {contact['firm_name']} | City: {contact['city']} | Pitch: {contact['pitch_type']}"
        )
        print(info_header)
        print("-" * 55)
        print(message)
        print("=" * 65 + "\n")

        preview_lines.append(info_header)
        preview_lines.append("-" * 55)
        preview_lines.append(message)
        preview_lines.append("\n" + "=" * 65 + "\n")

    with open(PREVIEW_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(preview_lines))

    print(f"DRY RUN COMPLETE:")
    print(f"  • Total contacts evaluated: {len(contacts)}")
    print(f"  • Already contacted (skipped): {skipped_count}")
    print(f"  • Ready to send: {ready_count}")
    print(f"  • Full preview saved to: {PREVIEW_FILE.name}")

def setup_login():
    """Opens a visible browser for scanning the WhatsApp Web QR code and saving session."""
    print("=" * 65)
    print("         WHATSAPP WEB LOGIN SETUP")
    print("=" * 65)
    print("1. A browser window will open displaying WhatsApp Web.")
    print("2. On your phone: Open WhatsApp -> Linked Devices -> Link a Device.")
    print("3. Scan the QR code shown on the screen.")
    print("4. Once your chats load and WhatsApp Web is active, return here and press ENTER.")
    print("=" * 65)

    USER_DATA_DIR.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        context = p.chromium.launch_persistent_context(
            user_data_dir=str(USER_DATA_DIR),
            headless=False,
            viewport={"width": 1280, "height": 850},
            args=["--disable-blink-features=AutomationControlled"]
        )
        page = context.pages[0] if context.pages else context.new_page()
        page.goto("https://web.whatsapp.com/", timeout=60000)

        input("\n>>> Press ENTER after your WhatsApp chats have loaded on the screen... <<<")

        page.wait_for_timeout(3000)
        context.close()
        print("\nSUCCESS: WhatsApp session saved in whatsapp_profile/!")
        print("You can now run outreach campaigns without scanning again.")

def send_whatsapp_messages(max_limit: int = 10, delay_range: tuple = (35, 65), headless: bool = False, filter_pitch: str = None):
    print("=" * 65)
    print("         CA WHATSAPP OUTREACH CAMPAIGN RUNNER")
    print("=" * 65)
    print(f"Max contacts for this batch: {max_limit}")
    print(f"Randomized delay between messages: {delay_range[0]} - {delay_range[1]} seconds")
    print(f"Headless: {headless}")
    if filter_pitch:
        print(f"Pitch filter: {filter_pitch}")
    print("=" * 65 + "\n")

    history = load_history()
    contacts = load_contacts(filter_pitch)

    # Exclude already contacted numbers
    pending_contacts = [c for c in contacts if c["phone"] not in history or history[c["phone"]].get("status") != "SENT"]

    if not pending_contacts:
        print("No pending CA contacts to message in ca_contacts.csv!")
        return

    print(f"Total contacts: {len(contacts)} | Pending to message: {len(pending_contacts)}")
    confirm = input("Are you sure you want to send live WhatsApp messages? (y/N): ").strip().lower()
    if confirm not in ("y", "yes"):
        print("Operation cancelled by user.")
        return

    USER_DATA_DIR.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        print("\nLaunching browser with saved WhatsApp session...")
        context = p.chromium.launch_persistent_context(
            user_data_dir=str(USER_DATA_DIR),
            headless=headless,
            viewport={"width": 1280, "height": 850},
            args=["--disable-blink-features=AutomationControlled"]
        )
        page = context.pages[0] if context.pages else context.new_page()

        # Step 1: Open WhatsApp Web and ensure session is active
        page.goto("https://web.whatsapp.com/", timeout=60000)
        page.wait_for_timeout(5000)

        # Check if QR code canvas is visible (meaning not logged in)
        qr_code = page.locator("canvas[aria-label='Scan me!'], div[data-ref]")
        if qr_code.count() > 0 and qr_code.first.is_visible():
            print("\nERROR: WhatsApp Web is not logged in! Please run 'python whatsapp_bot.py --setup-login' first.")
            context.close()
            return

        sent_count = 0

        for contact in pending_contacts:
            if sent_count >= max_limit:
                print(f"\nReached batch limit of {max_limit} messages. Pausing campaign for account safety.")
                break

            phone = contact["phone"]
            ca_name = contact["ca_name"]
            firm_name = contact["firm_name"]
            pitch_type = contact["pitch_type"]

            print(f"\n--- [{sent_count + 1}/{max_limit}] Messaging CA {ca_name} (+{phone}) ---")

            message_text = get_ca_message(pitch_type, ca_name, firm_name, contact["city"])
            encoded_text = urllib.parse.quote(message_text)
            chat_url = f"https://web.whatsapp.com/send?phone={phone}&text={encoded_text}"

            try:
                page.goto(chat_url, timeout=45000)
                page.wait_for_timeout(random.randint(4000, 7000))

                # Check if invalid number dialog appears
                invalid_dialog = page.locator("div:has-text('Phone number shared via url is invalid.'), div:has-text('url is invalid')")
                if invalid_dialog.count() > 0 and invalid_dialog.first.is_visible():
                    print(f"  [!] Phone number +{phone} is NOT registered on WhatsApp.")
                    # Dismiss dialog if OK button exists
                    ok_btn = page.locator("button:has-text('OK')").first
                    if ok_btn.count() > 0 and ok_btn.is_visible():
                        ok_btn.click()
                    log_contact(phone, ca_name, firm_name, pitch_type, message_text, "INVALID_NUMBER", "Number not on WhatsApp")
                    continue

                # Locate the Send button or chat input box
                send_button_selectors = [
                    "button[aria-label='Send']",
                    "span[data-icon='send']",
                    "button:has(span[data-icon='send'])",
                    "span[data-testid='send']"
                ]

                send_button = None
                for sel in send_button_selectors:
                    btn = page.locator(sel).first
                    if btn.count() > 0 and btn.is_visible():
                        send_button = btn
                        break

                if send_button:
                    page.wait_for_timeout(random.randint(1000, 2000))
                    send_button.click()
                    print("  [>] Clicked Send button!")
                else:
                    # Alternative: Click into chat input box and press Enter
                    input_box = page.locator("div[contenteditable='true'][role='textbox']").first
                    if input_box.count() > 0 and input_box.is_visible():
                        input_box.click()
                        page.wait_for_timeout(random.randint(800, 1500))
                        page.keyboard.press("Enter")
                        print("  [>] Pressed Enter to send message!")
                    else:
                        print(f"  [!] Could not locate send button or input box for +{phone}.")
                        log_contact(phone, ca_name, firm_name, pitch_type, message_text, "FAILED", "Send button not found")
                        continue

                # Wait for message to register
                page.wait_for_timeout(random.randint(2500, 4500))
                print(f"  [SUCCESS] WhatsApp message sent to CA {ca_name} (+{phone})!")
                log_contact(phone, ca_name, firm_name, pitch_type, message_text, "SENT")
                sent_count += 1

                # Delay before next contact
                if sent_count < max_limit and sent_count < len(pending_contacts):
                    wait_seconds = random.randint(delay_range[0], delay_range[1])
                    print(f"  [Waiting] Cooling down for {wait_seconds}s to mimic natural human typing...")
                    for remaining in range(wait_seconds, 0, -5):
                        time.sleep(5)
                        print(f"    ... {remaining - 5}s remaining")

            except PlaywrightTimeoutError:
                print(f"  [Timeout] Timed out loading chat for +{phone}")
                log_contact(phone, ca_name, firm_name, pitch_type, message_text, "TIMEOUT", "Playwright Timeout")
            except Exception as e:
                print(f"  [Error] Failed to message +{phone}: {e}")
                log_contact(phone, ca_name, firm_name, pitch_type, message_text, "ERROR", str(e))

        context.close()
        print("\n" + "=" * 65)
        print(f"CAMPAIGN FINISHED: Sent {sent_count} WhatsApp messages.")
        print(f"Detailed history saved in {HISTORY_FILE.name}")
        print("=" * 65)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="CA WhatsApp Direct Outreach Bot for Custom Software")
    parser.add_argument("--setup-login", action="store_true", help="Launch browser to scan WhatsApp Web QR code")
    parser.add_argument("--dry-run", action="store_true", help="Preview all messages without sending")
    parser.add_argument("--limit", type=int, default=10, help="Maximum number of messages to send in this run (default: 10)")
    parser.add_argument("--pitch", type=str, default=None, help="Filter by pitch type (PORTAL, WEBSITE, FILING_TRACKER, GENERAL_CUSTOM)")
    parser.add_argument("--headless", action="store_true", help="Run browser in headless mode")
    parser.add_argument("--min-delay", type=int, default=35, help="Minimum delay between messages in seconds (default: 35)")
    parser.add_argument("--max-delay", type=int, default=65, help="Maximum delay between messages in seconds (default: 65)")

    args = parser.parse_args()

    if args.setup_login:
        setup_login()
    elif args.dry_run:
        run_dry_run(filter_pitch=args.pitch)
    else:
        if len(sys.argv) == 1:
            print("No arguments provided. Running DRY RUN preview by default.")
            print("Use '--help' to see all available commands.\n")
            run_dry_run()
        else:
            send_whatsapp_messages(
                max_limit=args.limit,
                delay_range=(args.min_delay, args.max_delay),
                headless=args.headless,
                filter_pitch=args.pitch
            )
