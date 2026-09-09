import argparse
import asyncio
import csv
import os
import re
import sys
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

# Configure console for UTF-8 on Windows
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

from card_ocr import (
    clean_phone_number,
    extract_phone_numbers,
    save_leads_to_csv,
    parse_card_image,
    OUTPUT_DIR,
    LEADS_CSV
)

BASE_DIR = Path(__file__).parent
LOCAL_USER_DATA = BASE_DIR / "whatsapp_profile"
OUTREACH_BOT_USER_DATA = BASE_DIR.parent / "whatsapp-ca-outreach-bot" / "whatsapp_profile"
CARDS_DIR = BASE_DIR / "card_photos"
OUTREACH_BOT_CSV = BASE_DIR.parent / "whatsapp-ca-outreach-bot" / "ca_contacts.csv"

def get_best_profile_dir() -> Path:
    """Uses existing outreach bot session if available, so user doesn't need to re-scan."""
    if OUTREACH_BOT_USER_DATA.exists() and any(OUTREACH_BOT_USER_DATA.iterdir()):
        return OUTREACH_BOT_USER_DATA
    LOCAL_USER_DATA.mkdir(parents=True, exist_ok=True)
    return LOCAL_USER_DATA

def extract_participants(page, group_title: str) -> list:
    """Extracts member phone numbers and names from the open Group Info panel."""
    print("\n>>> 1. Extracting Group Member Phone Numbers...")
    contacts = []
    seen = set()

    # Expand participant list if 'more' or 'View all' button is present
    try:
        view_all = page.locator("div[role='button']:has-text('more'), div[role='button']:has-text('View all')")
        if view_all.count() > 0 and view_all.first.is_visible():
            view_all.first.click()
            page.wait_for_timeout(1500)
    except Exception:
        pass

    # Scroll drawer to trigger lazy loading
    drawer = page.locator("div[data-testid='contact-info-drawer'], div[data-testid='drawer-right']")
    if drawer.count() > 0:
        for _ in range(6):
            drawer.first.evaluate("el => el.scrollBy(0, 1000)")
            page.wait_for_timeout(700)

    elements = page.locator("span[title], div[title], span[dir='auto']").all()
    for el in elements:
        try:
            title = el.get_attribute("title") or el.inner_text()
            if not title:
                continue

            phones = extract_phone_numbers(title)
            for p in phones:
                if p not in seen:
                    seen.add(p)
                    # Try to capture name from parent element
                    parent_text = ""
                    try:
                        parent_text = el.locator("xpath=..").inner_text()
                    except Exception:
                        pass

                    name = "CA Member"
                    lines = [l.strip() for l in parent_text.splitlines() if l.strip()]
                    for l in lines:
                        if not re.search(r"\d", l) and len(l) >= 3 and not re.search(r"(Admin|Group|You|Community)", l, re.IGNORECASE):
                            name = l
                            break

                    contacts.append({
                        "phone_number": p,
                        "ca_name": name,
                        "firm_name": "Chartered Accountants",
                        "city": "India",
                        "email": "",
                        "source": f"Group Member List: {group_title}"
                    })
        except Exception:
            continue

    print(f"  [+] Found {len(contacts)} member mobile numbers in group list.")
    return contacts

def download_and_ocr_group_cards(page, group_title: str, max_cards: int = 35) -> list:
    """Navigates to group media gallery, downloads visiting cards, and runs Windows OCR."""
    print("\n>>> 2. Downloading & Scanning Visiting Card Photos from Group Media...")
    CARDS_DIR.mkdir(parents=True, exist_ok=True)
    downloaded_cards = []

    try:
        media_btn = page.locator("div[role='button']:has-text('Media, links and docs'), div:has-text('Media, links and docs')")
        if media_btn.count() > 0:
            media_btn.first.click()
            page.wait_for_timeout(2500)
            print("  [+] Opened Group Media gallery.")

            # Scroll media container
            media_box = page.locator("div[data-testid='media-gallery'], div[data-tab='6']")
            if media_box.count() > 0:
                for _ in range(3):
                    media_box.first.evaluate("el => el.scrollBy(0, 1000)")
                    page.wait_for_timeout(800)

            images = page.locator("img[src^='blob:'], img[src^='data:'], div[data-testid='media-canvas'] img").all()
            print(f"  [+] Found {len(images)} shared media photos.")

            # Full-screen high resolution capture
            if len(images) > 0:
                try:
                    images[0].click()
                    page.wait_for_timeout(2000)
                    print(f"  [+] Navigating high-res card gallery (capturing up to {max_cards} photos)...")

                    for card_idx in range(min(max_cards, len(images) * 2)):
                        viewer_img = page.locator("div[data-testid='media-viewer'] img, div[role='dialog'] img")
                        if viewer_img.count() > 0 and viewer_img.first.is_visible():
                            file_path = CARDS_DIR / f"{re.sub(r'[^a-zA-Z0-9]', '_', group_title)[:15]}_card_{card_idx+1}.png"
                            viewer_img.first.screenshot(path=str(file_path))
                            downloaded_cards.append(file_path)

                        page.keyboard.press("ArrowRight")
                        page.wait_for_timeout(700)

                    page.keyboard.press("Escape")
                    page.wait_for_timeout(1000)
                except Exception as ex:
                    print(f"  [*] Lightbox notice: {ex}")
                    try:
                        page.keyboard.press("Escape")
                    except Exception:
                        pass

            # Back button to return to group
            back_btn = page.locator("button[aria-label='Back'], span[data-icon='back']")
            if back_btn.count() > 0:
                back_btn.first.click()
                page.wait_for_timeout(1000)
    except Exception as e:
        print(f"  [!] Note on media gallery: {e}")

    # Run native Windows OCR on all captured visiting cards
    card_leads = []
    if downloaded_cards:
        print(f"\n>>> Running Windows OCR on {len(downloaded_cards)} Visiting Card Photos...")
        for img_path in downloaded_cards:
            try:
                results = asyncio.run(parse_card_image(img_path))
                for lead in results:
                    lead["source"] = f"Card OCR ({img_path.name}) from {group_title}"
                    card_leads.append(lead)
                    print(f"    [+] [CARD OCR] CA {lead['ca_name']} | {lead['firm_name']} | +91 {lead['phone_number']} ({lead['city']})")
            except Exception:
                pass

    return card_leads

def extract_chat_numbers(page, group_title: str) -> list:
    """Scans recent chat bubbles for numbers and CA bios posted in text."""
    print("\n>>> 3. Scanning Group Chat Messages for Numbers & Bios...")
    contacts = []
    seen = set()

    bubbles = page.locator("div.copyable-text, div[data-testid='msg-container']").all()
    for b in bubbles:
        try:
            text = b.inner_text()
            if not text:
                continue

            phones = extract_phone_numbers(text)
            if not phones:
                continue

            ca_name = "Chartered Accountant"
            for l in text.splitlines():
                m = re.search(r"\b(?:CA|C\.A\.|FCA|ACA)\.?\s+([A-Za-z\s\.\']{3,30})", l, re.IGNORECASE)
                if m:
                    ca_name = m.group(1).strip().title()
                    break

            for p in phones:
                if p not in seen:
                    seen.add(p)
                    contacts.append({
                        "phone_number": p,
                        "ca_name": ca_name,
                        "firm_name": "Chartered Accountants",
                        "city": "India",
                        "email": "",
                        "source": f"Chat Message in {group_title}"
                    })
                    print(f"    [+] [CHAT TEXT] CA {ca_name} | +91 {p}")
        except Exception:
            continue

    return contacts

def copy_to_outreach_bot(leads: list):
    """Optionally syncs found leads directly into the outreach bot's contact list."""
    if not leads or not OUTREACH_BOT_CSV.exists():
        return
    try:
        existing = set()
        with open(OUTREACH_BOT_CSV, "r", encoding="utf-8", errors="ignore") as f:
            reader = csv.DictReader(f)
            for r in reader:
                p = clean_phone_number(r.get("phone_number", ""))
                if p:
                    existing.add(p)

        new_count = 0
        with open(OUTREACH_BOT_CSV, "a", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=["phone_number", "ca_name", "firm_name", "city", "pitch_type", "notes"])
            for lead in leads:
                p = lead["phone_number"]
                if p not in existing:
                    writer.writerow({
                        "phone_number": p,
                        "ca_name": lead.get("ca_name", "Chartered Accountant"),
                        "firm_name": lead.get("firm_name", "CA Office"),
                        "city": lead.get("city", "India"),
                        "pitch_type": "PORTAL",
                        "notes": lead.get("source", "Found via Lead Finder")
                    })
                    existing.add(p)
                    new_count += 1
        if new_count > 0:
            print(f"  [SYNC] {new_count} new leads were also synced to WhatsApp Outreach Bot (ca_contacts.csv)!")
    except Exception as e:
        pass

def scrape_group_leads(search_query: str = None):
    profile_dir = get_best_profile_dir()
    print("=" * 72)
    print("      WHATSAPP CA GROUP LEAD FINDER & CARD OCR SCANNER")
    print("=" * 72)
    print("Launching browser with your WhatsApp session...")
    print(f"Session profile: {profile_dir.name}")
    print("=" * 72 + "\n")

    with sync_playwright() as p:
        context = p.chromium.launch_persistent_context(
            user_data_dir=str(profile_dir),
            headless=False,
            viewport={"width": 1366, "height": 850},
            args=["--disable-blink-features=AutomationControlled"]
        )
        page = context.pages[0] if context.pages else context.new_page()
        page.goto("https://web.whatsapp.com/", timeout=60000)
        page.wait_for_timeout(5000)

        # Check if login QR needed
        qr = page.locator("canvas[aria-label='Scan me!'], div[data-ref]")
        if qr.count() > 0 and qr.first.is_visible():
            print("\n[!] Please scan the QR code to connect WhatsApp Web!")
            input("Press ENTER after your chats have loaded... ")

        # Auto-search group if requested
        if search_query:
            try:
                search_box = page.locator("div[contenteditable='true'][data-tab='3'], [data-testid='chat-list-search']")
                if search_box.count() > 0:
                    search_box.first.click()
                    search_box.first.fill(search_query)
                    page.wait_for_timeout(2000)
                    page.keyboard.press("Enter")
                    page.wait_for_timeout(2000)
            except Exception:
                pass

        print("\n" + "*" * 65)
        print("ACTION IN BROWSER:")
        print("1. In the WhatsApp Web window, CLICK ON YOUR CA GROUP.")
        print("2. Once the group chat is open on screen, return here and press ENTER.")
        print("*" * 65)
        input("\n>>> Press ENTER after opening your CA Group chat... <<< ")

        # Detect group name
        group_title = "CA Group"
        try:
            h = page.locator("header span[dir='auto']").first
            if h.count() > 0:
                group_title = h.inner_text().strip()
                print(f"\nActive Group: '{group_title}'")
        except Exception:
            pass

        # Open Group Info panel
        try:
            page.locator("header").first.click()
            page.wait_for_timeout(2000)
        except Exception:
            pass

        # 1. Members
        members = extract_participants(page, group_title)

        # 2. Photos & Visiting Cards
        card_leads = download_and_ocr_group_cards(page, group_title, max_cards=35)

        # 3. Chat text
        chat_leads = extract_chat_numbers(page, group_title)

        # Deduplicate all
        all_leads = members + card_leads + chat_leads
        seen = set()
        deduped = []
        for l in all_leads:
            p = l["phone_number"]
            if p not in seen:
                seen.add(p)
                deduped.append(l)

        # Save to extracted_ca_leads.csv
        added, skipped = save_leads_to_csv(deduped)

        # Also sync to outreach bot
        copy_to_outreach_bot(deduped)

        print("\n" + "=" * 72)
        print("                    LEAD FINDER SUMMARY")
        print("=" * 72)
        print(f"  • Group: {group_title}")
        print(f"  • Members Extracted: {len(members)}")
        print(f"  • Cards Scanned via OCR: {len(card_leads)}")
        print(f"  • Chat Messages Scanned: {len(chat_leads)}")
        print(f"  • Total Unique CA Leads: {len(deduped)}")
        print(f"  • Saved into: {LEADS_CSV.resolve()} ({added} new, {skipped} dupes)")
        print("=" * 72)

        page.wait_for_timeout(3000)
        context.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Find CA leads and visiting cards from WhatsApp groups")
    parser.add_argument("--group", help="Optional group name to search", default=None)
    args = parser.parse_args()
    scrape_group_leads(args.group)
