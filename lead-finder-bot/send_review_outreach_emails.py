"""
Automated Review Booster Cold Email Sender
==========================================
Sends personalized Smart Review Booster outreach emails with the attached
custom Acrylic Tabletop QR Stand screenshot to business leads.
"""

import os
import sys
import smtplib
import json
import time
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

# =========================================================================
# CONFIGURATION
# =========================================================================
DRY_RUN = False  # LIVE SENDING ACTIVE
BATCH_LIMIT = 100

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_NAME = "Manav Rathod"
SENDER_EMAIL = "manavrathod6466@gmail.com"
SENDER_PASSWORD = "uhwpvmfrcltrmext"

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
CAMPAIGNS_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", "outreach_campaigns_reviews"))
HISTORY_FILE = os.path.join(CURRENT_DIR, "sent_review_emails_history.json")


def load_sent_history():
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}


def save_sent_history(history):
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(history, f, indent=2)


def send_review_campaign_emails():
    if not os.path.exists(CAMPAIGNS_DIR):
        print(f"❌ Reviews directory not found at: {CAMPAIGNS_DIR}")
        return

    sent_history = load_sent_history()
    folders = [f for f in os.listdir(CAMPAIGNS_DIR) if os.path.isdir(os.path.join(CAMPAIGNS_DIR, f))]

    print("=" * 70)
    print("⭐ SMART REVIEW BOOSTER OUTREACH DISPATCHER")
    print(f"📧 Sender: {SENDER_NAME} <{SENDER_EMAIL}>")
    print(f"📁 Target Directory: {CAMPAIGNS_DIR}")
    print(f"📊 Available Businesses: {len(folders)}")
    print(f"📬 Already Sent: {len(sent_history)}")
    print(f"🛡️ Mode: {'DRY RUN (Preview Only)' if DRY_RUN else 'LIVE SENDING ACTIVE'}")
    print("=" * 70)

    server = None
    if not DRY_RUN:
        try:
            print(f"🔌 Connecting to Gmail SMTP ({SMTP_SERVER}:{SMTP_PORT})...")
            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            print("✅ Logged in to Gmail successfully!\n")
        except Exception as e:
            print(f"❌ Failed to connect to SMTP: {e}")
            return

    sent_count = 0

    for idx, folder_name in enumerate(folders, 1):
        if sent_count >= BATCH_LIMIT:
            print(f"\n✋ Reached batch limit of {BATCH_LIMIT} emails.")
            break

        folder_path = os.path.join(CAMPAIGNS_DIR, folder_name)
        info_path = os.path.join(folder_path, "lead_info.json")
        email_html_path = os.path.join(folder_path, "cold_email.html")
        email_txt_path = os.path.join(folder_path, "cold_email.txt")

        if not os.path.exists(info_path):
            continue

        with open(info_path, "r", encoding="utf-8") as f:
            lead = json.load(f)

        biz_name = lead.get("business_name", folder_name)

        if biz_name in sent_history:
            continue

        screenshot_file = lead.get("screenshot_file", "")
        screenshot_path = os.path.join(folder_path, screenshot_file)

        web = lead.get("website", "")
        clean_domain = web.replace("https://", "").replace("http://", "").replace("www.", "").split("/")[0]
        target_email = f"info@{clean_domain}" if clean_domain and "." in clean_domain else None

        if not target_email:
            continue

        with open(email_html_path, "r", encoding="utf-8") as hf:
            html_body = hf.read()
        with open(email_txt_path, "r", encoding="utf-8") as tf:
            txt_body = tf.read()

        html_body = html_body.replace('src="' + screenshot_file + '"', 'src="cid:stand_preview"')

        subject = f"Quick question about {biz_name}'s Google Reviews rating"

        if DRY_RUN:
            has_img = os.path.exists(screenshot_path)
            sent_count += 1
            print(f"  [Preview {sent_count}] {biz_name} | Target: {target_email} | QR Stand: {'✅ Yes' if has_img else '❌ No'}")
        else:
            try:
                msg = MIMEMultipart("related")
                msg["Subject"] = subject
                msg["From"] = f"{SENDER_NAME} <{SENDER_EMAIL}>"
                msg["To"] = target_email

                alt_part = MIMEMultipart("alternative")
                alt_part.attach(MIMEText(txt_body, "plain", "utf-8"))
                alt_part.attach(MIMEText(html_body, "html", "utf-8"))
                msg.attach(alt_part)

                if os.path.exists(screenshot_path):
                    with open(screenshot_path, "rb") as img_f:
                        img_data = img_f.read()
                        img_part = MIMEImage(img_data)
                        img_part.add_header('Content-ID', '<stand_preview>')
                        img_part.add_header('Content-Disposition', 'inline', filename=os.path.basename(screenshot_path))
                        msg.attach(img_part)

                server.sendmail(SENDER_EMAIL, [target_email], msg.as_string())
                sent_count += 1

                sent_history[biz_name] = {
                    "email": target_email,
                    "phone": lead.get("phone"),
                    "sent_at": time.strftime("%Y-%m-%d %H:%M:%S")
                }
                save_sent_history(sent_history)

                print(f"  ✓ [Sent {sent_count}] ⭐ Emailed Review Stand to: {biz_name} -> {target_email}")
                time.sleep(3)

            except Exception as send_err:
                print(f"  ❌ Error sending to {biz_name}: {send_err}")

    if server:
        server.quit()

    print("\n" + "=" * 70)
    print(f"🎉 REVIEW BOOSTER CAMPAIGN COMPLETE: Sent {sent_count} live emails with custom QR stands!")
    print(f"📊 Total Lifetime Contacted for Reviews: {len(sent_history)}")
    print("=" * 70)


if __name__ == "__main__":
    send_review_campaign_emails()
