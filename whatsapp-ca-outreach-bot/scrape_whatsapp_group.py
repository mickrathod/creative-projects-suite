import argparse
import asyncio
import base64
import csv
import os
import re
import sys
import time
from pathlib import Path
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError

# Configure console for UTF-8 on Windows
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

from card_ocr_extractor import (
    clean_phone_number,
    extract_phone_numbers,
    append_contacts_to_csv,
    parse_card_image,
    run_card_scan,
    DEFAULT_CARDS_DIR,
    CONTACTS_FILE
)

BASE_DIR = Path(__file__).parent
USER_DATA_DIR = BASE_DIR / "whatsapp_profile"
DOWNLOADS_DIR = BASE_DIR / "ca_card_photos"

def extract_participants_from_page(page, group_title: str) -> list:
    """Extracts participant phone numbers and names from the open Group Info drawer."""
    print("\n>>> Extracting Group Member Phone Numbers...")
    contacts = []
    seen_phones = set()

    # Try clicking the 'View all' or participants expand button if present
    try:
        view_all = page.locator("div[role='button']:has-text('more'), div[role='button']:has-text('View all')")
        if view_all.count() > 0 and view_all.first.is_visible():
            view_all.first.click()
            page.wait_for_timeout(1500)
    except Exception:
        pass

    # Find the participants container
    # In WhatsApp Web, participants appear in a scrollable list inside the right drawer or modal
    participant_selectors = [
        "div[data-testid='cell-frame-container']",
        "div[role='listitem']",
        "div[data-testid='group-chat-drawer-participants-list'] > div",
        "div[data-testid='contact-info-drawer'] div[tabindex='-1']"
    ]

    # Scroll the drawer to load lazy-loaded members
    drawer = page.locator("div[data-testid='contact-info-drawer'], div[data-testid='drawer-right']")
    if drawer.count() > 0:
        for _ in range(5):
            drawer.first.evaluate("el => el.scrollBy(0, 1000)")
            page.wait_for_timeout(800)

    # Search for phone numbers in all participant text elements
    elements = page.locator("span[title], div[title], span[dir='auto']").all()
    for el in elements:
        try:
            title = el.get_attribute("title") or el.inner_text()
            if not title:
                continue

            # Look for Indian mobile numbers (+91 or 10 digits)
            phones = extract_phone_numbers(title)
            for p in phones:
                if p not in seen_phones:
                    seen_phones.add(p)
                    # Try to see if there is an adjacent or parent name
                    parent_text = ""
                    try:
                        parent_text = el.locator("xpath=..").inner_text()
                    except Exception:
                        pass
                    
                    # Clean up CA name if available
                    name = "CA Member"
                    lines = [l.strip() for l in parent_text.splitlines() if l.strip()]
                    for l in lines:
                        if not re.search(r"\d", l) and len(l) >= 3 and not re.search(r"(Admin|Group|You)", l, re.IGNORECASE):
                            name = l
                            break

                    contacts.append({
                        "phone_number": p,
                        "ca_name": name,
                        "firm_name": "Chartered Accountants",
                        "city": "India",
                        "pitch_type": "PORTAL",
                        "notes": f"Scraped from WhatsApp Group: {group_title}"
                    })
        except Exception:
            continue

    print(f"  [+] Extracted {len(contacts)} unique member numbers from Group Info.")
    return contacts

def download_group_media_cards(page, group_title: str, max_cards: int = 30) -> list:
    """
    Opens 'Media, links and docs' inside Group Info,
    downloads visiting card photos into ca_card_photos/ and scans them with OCR.
    """
    print("\n>>> Checking Group Media for Visiting Cards & Photos...")
    DOWNLOADS_DIR.mkdir(parents=True, exist_ok=True)
    downloaded_files = []

    try:
        # Click 'Media, links and docs'
        media_btn = page.locator("div[role='button']:has-text('Media, links and docs'), div:has-text('Media, links and docs')")
        if media_btn.count() > 0:
            media_btn.first.click()
            page.wait_for_timeout(2500)
            print("  [+] Opened Group Media gallery.")

            # Scroll media grid to reveal images
            media_container = page.locator("div[data-testid='media-gallery'], div[data-tab='6']")
            if media_container.count() > 0:
                for _ in range(3):
                    media_container.first.evaluate("el => el.scrollBy(0, 1000)")
                    page.wait_for_timeout(1000)

            # Find media images
            images = page.locator("img[src^='blob:'], img[src^='data:'], div[data-testid='media-canvas'] img").all()
            print(f"  [+] Found {len(images)} shared images in media gallery.")

            # Method 1: High-Resolution Gallery Viewer (clicks first photo and flips with ArrowRight)
            captured_high_res = False
            if len(images) > 0:
                try:
                    print(f"  [+] Opening full-screen viewer to capture high-res visiting cards...")
                    images[0].click()
                    page.wait_for_timeout(2000)

                    for card_idx in range(min(max_cards, len(images) * 2)):
                        viewer_img = page.locator("div[data-testid='media-viewer'] img, div[role='dialog'] img, div[data-testid='image-thumb'] img")
                        if viewer_img.count() > 0 and viewer_img.first.is_visible():
                            file_path = DOWNLOADS_DIR / f"group_card_{int(time.time())}_{card_idx+1}.png"
                            viewer_img.first.screenshot(path=str(file_path))
                            downloaded_files.append(file_path)
                            captured_high_res = True
                        
                        # Next image in gallery
                        page.keyboard.press("ArrowRight")
                        page.wait_for_timeout(800)

                    # Exit viewer
                    page.keyboard.press("Escape")
                    page.wait_for_timeout(1000)
                except Exception as ex:
                    print(f"  [*] Viewer navigation notice: {ex}")
                    try:
                        page.keyboard.press("Escape")
                    except Exception:
                        pass

            # Method 2: Fallback to thumbnail screenshots if lightbox wasn't triggered
            if not captured_high_res:
                for idx, img in enumerate(images[:max_cards]):
                    try:
                        file_path = DOWNLOADS_DIR / f"group_card_{int(time.time())}_{idx+1}.png"
                        img.screenshot(path=str(file_path))
                        downloaded_files.append(file_path)
                    except Exception:
                        continue

            print(f"  [+] Saved {len(downloaded_files)} photos to {DOWNLOADS_DIR.name}/ for OCR scanning.")

            # Go back from media view to group info
            back_btn = page.locator("button[aria-label='Back'], span[data-icon='back']")
            if back_btn.count() > 0:
                back_btn.first.click()
                page.wait_for_timeout(1000)
    except Exception as e:
        print(f"  [!] Note: Could not auto-download media grid: {e}")

    # Run OCR on newly downloaded files
    card_contacts = []
    if downloaded_files:
        print("\n>>> Running Native Windows OCR on Downloaded Visiting Cards...")
        for img_path in downloaded_files:
            try:
                results = asyncio.run(parse_card_image(img_path))
                for c in results:
                    c["notes"] = f"Card OCR from Group: {group_title} ({img_path.name})"
                    card_contacts.append(c)
                    print(f"    [+] [CARD OCR] CA {c['ca_name']} | {c['firm_name']} | +91 {c['phone_number']}")
            except Exception as e:
                pass

    return card_contacts

def extract_numbers_from_recent_chat(page, group_title: str) -> list:
    """Scans visible chat messages in the group for posted phone numbers & CA announcements."""
    print("\n>>> Scanning Chat Messages for Posted CA Numbers & Bios...")
    contacts = []
    seen_phones = set()

    # Get message text bubbles
    message_bubbles = page.locator("div.copyable-text, div[data-testid='msg-container']").all()
    for bubble in message_bubbles:
        try:
            text = bubble.inner_text()
            if not text:
                continue

            phones = extract_phone_numbers(text)
            if not phones:
                continue

            lines = [l.strip() for l in text.splitlines() if l.strip()]
            
            # Detect CA Name from message
            ca_name = "Chartered Accountant"
            for l in lines:
                m = re.search(r"\b(?:CA|C\.A\.|FCA|ACA)\.?\s+([A-Za-z\s\.\']{3,30})", l, re.IGNORECASE)
                if m:
                    ca_name = m.group(1).strip().title()
                    break

            for p in phones:
                if p not in seen_phones:
                    seen_phones.add(p)
                    contacts.append({
                        "phone_number": p,
                        "ca_name": ca_name,
                        "firm_name": "Chartered Accountants",
                        "city": "India",
                        "pitch_type": "PORTAL",
                        "notes": f"Found in chat message in {group_title}"
                    })
                    print(f"    [+] [CHAT MESSAGE] CA {ca_name} | Phone: +91 {p}")
        except Exception:
            continue

    return contacts

def scrape_group(group_search: str = None):
    print("=" * 70)
    print("     WHATSAPP GROUP CA LEADS & VISITING CARD EXTRACTOR")
    print("=" * 70)
    print("1. Opening WhatsApp Web with your saved session...")
    print("2. You can either specify the group name or select it manually on screen.")
    print("=" * 70 + "\n")

    USER_DATA_DIR.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        context = p.chromium.launch_persistent_context(
            user_data_dir=str(USER_DATA_DIR),
            headless=False,
            viewport={"width": 1366, "height": 850},
            args=["--disable-blink-features=AutomationControlled"]
        )
        page = context.pages[0] if context.pages else context.new_page()
        page.goto("https://web.whatsapp.com/", timeout=60000)
        page.wait_for_timeout(5000)

        # Ensure user is logged in
        qr = page.locator("canvas[aria-label='Scan me!'], div[data-ref]")
        if qr.count() > 0 and qr.first.is_visible():
            print("\n[!] Please scan the QR code first to log into WhatsApp Web!")
            input("\nPress ENTER after you have scanned the QR code and chats are visible... ")

        # Step A: Select the group
        if group_search:
            print(f"Searching for group: '{group_search}'...")
            try:
                search_box = page.locator("div[contenteditable='true'][data-tab='3'], [data-testid='chat-list-search']")
                if search_box.count() > 0:
                    search_box.first.click()
                    search_box.first.fill(group_search)
                    page.wait_for_timeout(2000)
                    page.keyboard.press("Enter")
                    page.wait_for_timeout(2000)
            except Exception as e:
                print(f"Could not auto-search group: {e}")

        print("\n" + "*" * 60)
        print("ACTION REQUIRED:")
        print("1. In the open WhatsApp Web browser window, click on your CA GROUP.")
        print("2. Once the group chat is open on your screen, come back here and press ENTER.")
        print("*" * 60)
        input("\n>>> Press ENTER after opening your CA Group chat... <<< ")

        # Get the group title from the active chat header
        group_title = "CA WhatsApp Group"
        try:
            header_title = page.locator("header span[dir='auto']").first
            if header_title.count() > 0:
                group_title = header_title.inner_text().strip()
                print(f"\nActive Group Detected: '{group_title}'")
        except Exception:
            pass

        # Step B: Open Group Info drawer by clicking the chat header
        try:
            chat_header = page.locator("header").first
            chat_header.click()
            page.wait_for_timeout(2000)
        except Exception as e:
            print(f"Warning: Could not auto-click header: {e}")

        # 1. Extract member numbers
        participant_contacts = extract_participants_from_page(page, group_title)

        # 2. Extract visiting cards from group media and run OCR
        card_contacts = download_group_media_cards(page, group_title, max_cards=25)

        # 3. Extract numbers posted in chat messages
        chat_contacts = extract_numbers_from_recent_chat(page, group_title)

        # Combine all contacts
        all_new_contacts = participant_contacts + card_contacts + chat_contacts

        # Deduplicate
        seen = set()
        deduped = []
        for c in all_new_contacts:
            p = c["phone_number"]
            if p not in seen:
                seen.add(p)
                deduped.append(c)

        # Save to ca_contacts.csv
        added, skipped = append_contacts_to_csv(deduped)

        print("\n" + "=" * 70)
        print("                 SCRAPING SUMMARY")
        print("=" * 70)
        print(f"  • Group Name: {group_title}")
        print(f"  • Member Numbers Extracted: {len(participant_contacts)}")
        print(f"  • Cards Scanned via OCR: {len(card_contacts)}")
        print(f"  • Chat Messages Scanned: {len(chat_contacts)}")
        print(f"  • Total Unique Leads Found: {len(deduped)}")
        print(f"  • Added to ca_contacts.csv: {added} new contacts ({skipped} duplicates skipped)")
        print("=" * 70)
        print("\nAll new leads are now saved and ready in ca_contacts.csv for WhatsApp outreach!")
        
        page.wait_for_timeout(3000)
        context.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Scrape CA leads and visiting cards from WhatsApp groups")
    parser.add_argument("--group", help="Optional search query for group name", default=None)
    args = parser.parse_args()

    scrape_group(args.group)
