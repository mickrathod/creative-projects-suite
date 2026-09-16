#!/usr/bin/env python3
"""
Remote Job Application & Outreach Mailer
Supports categories: shopify, laravel_react, wordpress, fullstack
"""

import os
import sys
import csv
import time
import random
import smtplib
import ssl
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from dotenv import load_dotenv

# Import our customized email templates
from templates import get_email_content

# Load configuration from .env
load_dotenv()

EMAIL_USER = os.getenv("EMAIL_USER", "").strip()
EMAIL_APP_PASSWORD = os.getenv("EMAIL_APP_PASSWORD", "").strip()
MY_NAME = os.getenv("MY_NAME", "Remote Developer").strip()
MY_PHONE = os.getenv("MY_PHONE", "").strip()
MY_PORTFOLIO = os.getenv("MY_PORTFOLIO", "").strip()
MY_LINKEDIN = os.getenv("MY_LINKEDIN", "").strip()

CONTACTS_FILE = "contacts.csv"
LOG_FILE = "outreach_log.csv"
RESUME_FILE = "resume.pdf"

USER_INFO = {
    "name": MY_NAME,
    "phone": MY_PHONE,
    "portfolio": MY_PORTFOLIO,
    "linkedin": MY_LINKEDIN,
}

def load_sent_emails():
    """Reads outreach_log.csv to avoid sending duplicate emails."""
    sent = set()
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row.get("status") == "SUCCESS":
                    sent.add(row.get("email", "").strip().lower())
    return sent

def log_email_result(email, company, category, status, error_msg=""):
    """Appends send status to outreach_log.csv."""
    file_exists = os.path.exists(LOG_FILE)
    with open(LOG_FILE, mode="a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(["timestamp", "email", "company", "category", "status", "error"])
        writer.writerow([
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            email,
            company,
            category,
            status,
            error_msg
        ])

def build_message(to_email, recipient_name, recipient_company, category):
    """Constructs the MIME message including HTML body and optional resume."""
    subject, body_html = get_email_content(category, recipient_name, recipient_company, USER_INFO)

    msg = MIMEMultipart("mixed")
    msg["From"] = f"{MY_NAME} <{EMAIL_USER}>"
    msg["To"] = to_email
    msg["Subject"] = subject

    # Attach HTML body
    part_html = MIMEText(body_html, "html", "utf-8")
    msg.attach(part_html)

    # Attach resume.pdf if present
    if os.path.exists(RESUME_FILE):
        try:
            with open(RESUME_FILE, "rb") as f:
                part_attach = MIMEBase("application", "pdf")
                part_attach.set_payload(f.read())
            encoders.encode_base64(part_attach)
            part_attach.add_header(
                "Content-Disposition",
                f'attachment; filename="{os.path.basename(RESUME_FILE)}"',
            )
            msg.attach(part_attach)
        except Exception as e:
            print(f"  [!] Warning: Could not attach {RESUME_FILE}: {e}")

    return msg, subject

def send_test_email():
    """Sends 1 test email to YOUR OWN EMAIL to preview how it looks."""
    if not EMAIL_USER or not EMAIL_APP_PASSWORD:
        print("[!] ERROR: Please configure EMAIL_USER and EMAIL_APP_PASSWORD in .env first.")
        return

    print(f"\n[*] Sending TEST email to yourself ({EMAIL_USER})...")
    msg, subject = build_message(
        to_email=EMAIL_USER,
        recipient_name="Alex (Test)",
        recipient_company="Example E-Commerce Agency",
        category="shopify"
    )

    context = ssl.create_default_context()
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(EMAIL_USER, EMAIL_APP_PASSWORD)
            server.sendmail(EMAIL_USER, EMAIL_USER, msg.as_string())
        print(f"[✓] TEST EMAIL SENT SUCCESSFULLY to {EMAIL_USER}!")
        print(f"    Subject: {subject}")
        print("    Open your Gmail inbox to inspect formatting and attachment.\n")
    except Exception as e:
        print(f"[!] SMTP Authentication or Send Error: {e}\n")

def dry_run():
    """Previews contacts and email templates in terminal without sending."""
    if not os.path.exists(CONTACTS_FILE):
        print(f"[!] File not found: {CONTACTS_FILE}")
        return

    print("\n--- DRY RUN PREVIEW (No emails will be sent) ---")
    with open(CONTACTS_FILE, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader, start=1):
            name = row.get("name", "").strip()
            company = row.get("company", "").strip()
            email = row.get("email", "").strip()
            category = row.get("category", "fullstack").strip()
            subject, _ = get_email_content(category, name, company, USER_INFO)

            print(f"#{i} -> To: {email} | Name: {name} | Company: {company} | Cat: {category}")
            print(f"      Subject: {subject}")

    has_resume = os.path.exists(RESUME_FILE)
    print(f"\nResume file attached?: {'YES (' + RESUME_FILE + ')' if has_resume else 'NO (resume.pdf not found)'}")
    print("------------------------------------------------\n")

def run_campaign():
    """Sends outreach emails with duplicate prevention and anti-spam delays."""
    if not EMAIL_USER or not EMAIL_APP_PASSWORD:
        print("[!] ERROR: Please configure EMAIL_USER and EMAIL_APP_PASSWORD in .env first.")
        return

    if not os.path.exists(CONTACTS_FILE):
        print(f"[!] File not found: {CONTACTS_FILE}")
        return

    sent_emails = load_sent_emails()
    print(f"[*] Found {len(sent_emails)} already-contacted emails in {LOG_FILE}.")

    contacts = []
    with open(CONTACTS_FILE, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            email = row.get("email", "").strip()
            if email and email.lower() not in sent_emails:
                contacts.append(row)

    if not contacts:
        print("[✓] No pending contacts to send to. All emails in contacts.csv have already been contacted!")
        return

    print(f"[*] Ready to send outreach to {len(contacts)} contacts.")
    print("[*] Connecting to Gmail SMTP server (smtp.gmail.com:465)...")

    context = ssl.create_default_context()
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(EMAIL_USER, EMAIL_APP_PASSWORD)
            print("[✓] Gmail authentication successful!\n")

            for index, row in enumerate(contacts, start=1):
                name = row.get("name", "").strip()
                company = row.get("company", "").strip()
                email = row.get("email", "").strip()
                category = row.get("category", "fullstack").strip()

                print(f"[{index}/{len(contacts)}] Sending to {name} <{email}> ({company})...")

                try:
                    msg, _ = build_message(email, name, company, category)
                    server.sendmail(EMAIL_USER, email, msg.as_string())
                    print(f"    [✓] SUCCESS")
                    log_email_result(email, company, category, "SUCCESS")
                except Exception as err:
                    print(f"    [!] FAILED: {err}")
                    log_email_result(email, company, category, "FAILED", str(err))

                # Human-like delay between emails (5 to 9 seconds) to stay safe from spam flags
                if index < len(contacts):
                    wait_time = random.uniform(5.0, 9.0)
                    print(f"    ... waiting {wait_time:.1f}s before next send ...")
                    time.sleep(wait_time)

        print("\n[✓] Campaign completed! Details saved to outreach_log.csv.\n")

    except Exception as e:
        print(f"\n[!] SMTP Error: {e}\n")

def main():
    args = sys.argv[1:]
    if "--test" in args:
        send_test_email()
    elif "--dry-run" in args:
        dry_run()
    elif "--run" in args:
        run_campaign()
    else:
        print("\nUsage:")
        print("  python send_emails.py --dry-run   (Preview contacts and templates without sending)")
        print("  python send_emails.py --test      (Send 1 test email to yourself to check inbox formatting)")
        print("  python send_emails.py --run       (Send campaign to all contacts in contacts.csv)")
        print()

if __name__ == "__main__":
    main()
