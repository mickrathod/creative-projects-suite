"""
Automated WhatsApp Outreach Script for CA Firms & Financial Leaders
Powered by Playwright (Chrome Automation)

Features:
- Persistent WhatsApp Web session (Scan QR code once, saved in ./whatsapp_session)
- Prevents duplicate sending via outreach_log.csv
- Intelligent phone number normalization (India + International)
- Safe human-like random delays (default 15-30 seconds) to protect your WhatsApp account
- Dry-run mode to preview messages before sending
- Filter by Priority (High / Medium) or set Batch Limits (--limit 10)
"""

import os
import sys
import csv
import time
import random
import urllib.parse
import argparse
import re
from datetime import datetime

# Configure UTF-8 for Windows PowerShell / CMD terminals
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

from playwright.sync_api import sync_playwright

LOG_FILE = "outreach_log.csv"
SESSION_DIR = os.path.abspath("./whatsapp_session")
CSV_PATH = "leads.csv"


def clean_phone_number(raw_phone: str) -> str | None:
    """Normalizes phone numbers to international format without + or spaces."""
    if not raw_phone:
        return None
    # Strip any text or unwanted characters, keeping digits and +
    digits = re.sub(r"[^0-9+]", "", raw_phone)
    if not digits:
        return None
    if digits.startswith("+"):
        digits = digits[1:]
    elif len(digits) == 10:
        # Default 10-digit Indian numbers to +91
        digits = "91" + digits
    elif len(digits) == 11 and digits.startswith("0"):
        digits = "91" + digits[1:]
    return digits if len(digits) >= 10 else None


def load_outreach_log() -> set:
    """Returns set of Lead_IDs that have already been sent."""
    sent_leads = set()
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row.get("Status") == "SENT":
                    sent_leads.add(row.get("Lead_ID"))
    return sent_leads


def log_result(lead_id, name, phone, status, note=""):
    """Appends send result to outreach_log.csv."""
    file_exists = os.path.exists(LOG_FILE)
    with open(LOG_FILE, mode="a", newline="", encoding="utf-8") as f:
        fieldnames = ["Timestamp", "Lead_ID", "Name", "Phone", "Status", "Note"]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        if not file_exists:
            writer.writeheader()
        writer.writerow({
            "Timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "Lead_ID": lead_id,
            "Name": name,
            "Phone": phone,
            "Status": status,
            "Note": note
        })


def load_leads(csv_path: str, priority_filter: str = None) -> list:
    leads = []
    if not os.path.exists(csv_path):
        print(f"[!] Error: {csv_path} not found.")
        sys.exit(1)

    with open(csv_path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if priority_filter and priority_filter.lower() != "all":
                if row.get("Lead_Priority", "").strip().lower() != priority_filter.lower():
                    continue
            leads.append(row)
    return leads


def countdown(seconds: int, message: str = "Next message in"):
    """Displays terminal countdown."""
    for remaining in range(seconds, 0, -1):
        sys.stdout.write(f"\r⏳ {message} {remaining:2d}s... ")
        sys.stdout.flush()
        time.sleep(1)
    sys.stdout.write("\r" + " " * 45 + "\r")
    sys.stdout.flush()


def run(args):
    leads = load_leads(args.csv, args.priority)
    sent_leads = load_outreach_log()

    print("=" * 65)
    print(" 🚀 CA OUTREACH AUTOMATION - WHATSAPP BOT")
    print("=" * 65)
    print(f"📁 Leads file:        {args.csv}")
    print(f"🎯 Priority filter:   {args.priority or 'ALL'}")
    print(f"📊 Total leads:       {len(leads)}")
    print(f"✅ Already contacted: {len(sent_leads)}")
    print(f"⏱️ Delay interval:    {args.delay_min}s - {args.delay_max}s")
    print(f"🧪 Dry Run Mode:      {'ENABLED (No messages will be sent)' if args.dry_run else 'DISABLED (LIVE SENDING)'}")
    print("=" * 65)

    queue = []
    for lead in leads:
        lead_id = lead.get("Lead_ID")
        if lead_id in sent_leads and not args.force:
            continue
        cleaned_phone = clean_phone_number(lead.get("Phone_Number", ""))
        if not cleaned_phone:
            log_result(lead_id, lead.get("Name"), lead.get("Phone_Number"), "SKIPPED_NO_PHONE", "Missing or invalid phone number format")
            continue
        queue.append((lead, cleaned_phone))

    print(f"📬 Leads in active queue to process: {len(queue)}")
    if args.limit and args.limit > 0:
        queue = queue[:args.limit]
        print(f"⚡ Batch limit applied: Processing first {len(queue)} leads")

    if not queue:
        print("\n🎉 No pending leads to send! All leads in this filter are contacted.")
        return

    # Dry-Run mode preview
    if args.dry_run:
        print("\n📋 [DRY-RUN PREVIEW]")
        for idx, (lead, phone) in enumerate(queue, 1):
            print(f"\n--- [{idx}/{len(queue)}] {lead['Lead_ID']} - {lead['Name']} ({phone}) ---")
            print(f"🏢 Firm:     {lead.get('Firm_Company_Name', 'N/A')}")
            print(f"📍 City:     {lead.get('City_Location', 'N/A')}")
            print(f"⭐ Priority: {lead.get('Lead_Priority', 'N/A')}")
            print(f"💬 Message:\n{lead.get('Tailored_Business_Outreach_Message')}")
        print("\n✅ Dry run complete. Run without --dry-run to send live messages.")
        return

    # Live automation with Playwright
    os.makedirs(SESSION_DIR, exist_ok=True)

    with sync_playwright() as p:
        print("\n🌐 Launching Chrome with session in ./whatsapp_session...")
        context = p.chromium.launch_persistent_context(
            user_data_dir=SESSION_DIR,
            channel="chrome",
            headless=args.headless,
            viewport={"width": 1280, "height": 800},
            args=["--disable-blink-features=AutomationControlled"]
        )

        page = context.pages[0] if context.pages else context.new_page()
        page.goto("https://web.whatsapp.com")

        print("\n🔑 Checking WhatsApp Web Login Status...")
        print("ℹ️ If you see a QR code on screen, scan it with your phone now.")
        print("⏳ Waiting for WhatsApp Web to load...")

        # Wait up to 60s for chats to load
        try:
            page.wait_for_selector("#pane-side, div[data-tab='3'], div[contenteditable='true']", timeout=60000)
            print("✅ Logged in successfully to WhatsApp Web!\n")
        except Exception:
            print("\n⚠️ Login timed out or QR code not scanned.")
            input("👉 Please scan the QR code manually, wait for chats to load, then press ENTER here to continue...")

        success_count = 0
        failure_count = 0

        for idx, (lead, phone) in enumerate(queue, 1):
            lead_id = lead.get("Lead_ID")
            name = lead.get("Name")
            msg = lead.get("Tailored_Business_Outreach_Message", "").strip()

            print(f"\n[{idx}/{len(queue)}] Preparing: {lead_id} - {name} ({phone})")

            encoded_msg = urllib.parse.quote(msg)
            url = f"https://web.whatsapp.com/send?phone={phone}&text={encoded_msg}"

            try:
                page.goto(url, wait_until="domcontentloaded", timeout=45000)

                # Check if invalid number dialog appears
                invalid_dialog = False
                try:
                    page.wait_for_selector("div[data-animate-modal-popup='true']", timeout=6000)
                    popup_text = page.inner_text("div[data-animate-modal-popup='true']").lower()
                    if "phone number shared via url is invalid" in popup_text or "invalid" in popup_text:
                        invalid_dialog = True
                        print(f"❌ WhatsApp reports invalid phone number for {name} ({phone})")
                        log_result(lead_id, name, phone, "INVALID_PHONE", "Not registered on WhatsApp or invalid format")
                        failure_count += 1
                        # Close popup by pressing Escape or clicking OK
                        page.keyboard.press("Escape")
                        time.sleep(2)
                        continue
                except Exception:
                    pass  # No popup, continue

                # Wait for the chat text box to be ready
                # WhatsApp input editable div
                input_box = page.wait_for_selector(
                    "footer div[contenteditable='true'][role='textbox'], div[data-tab='10']",
                    timeout=20000
                )

                if input_box:
                    # Small human pause
                    time.sleep(random.uniform(1.5, 3.0))

                    # Press Enter to send the pre-filled message
                    page.keyboard.press("Enter")
                    time.sleep(2.5)

                    print(f"✅ Sent message to {name} ({phone})")
                    log_result(lead_id, name, phone, "SENT", "Delivered via WhatsApp Web")
                    success_count += 1

                    # Sleep safe jitter delay before next lead
                    if idx < len(queue):
                        delay = random.randint(args.delay_min, args.delay_max)
                        countdown(delay, message=f"Waiting safely before next CA lead")

            except Exception as e:
                print(f"⚠️ Error sending to {name} ({phone}): {str(e)[:120]}")
                log_result(lead_id, name, phone, "FAILED", str(e)[:120])
                failure_count += 1
                time.sleep(5)

        print("\n" + "=" * 65)
        print(f"🎯 OUTREACH RUN FINISHED")
        print(f"✅ Successfully Sent: {success_count}")
        print(f"❌ Failed / Invalid:   {failure_count}")
        print(f"📝 Full audit log saved in: {LOG_FILE}")
        print("=" * 65)

        time.sleep(5)
        context.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="CA Lead WhatsApp Outreach Automation")
    parser.add_argument("--csv", default=CSV_PATH, help="Path to leads CSV (default: leads.csv)")
    parser.add_argument("--priority", choices=["High", "Medium", "Low", "All"], default="All", help="Filter leads by priority")
    parser.add_argument("--limit", type=int, default=0, help="Max number of leads to message in this session (0 = no limit)")
    parser.add_argument("--dry-run", action="store_true", help="Preview messages without opening browser or sending")
    parser.add_argument("--delay-min", type=int, default=15, help="Minimum delay seconds between messages (default: 15)")
    parser.add_argument("--delay-max", type=int, default=28, help="Maximum delay seconds between messages (default: 28)")
    parser.add_argument("--force", action="store_true", help="Resend even if lead is already marked SENT in log")
    parser.add_argument("--headless", action="store_true", help="Run browser in headless mode (use only after logged in)")

    args = parser.parse_args()
    run(args)
