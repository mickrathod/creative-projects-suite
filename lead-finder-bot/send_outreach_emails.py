"""
Automated Cold Email Sender with Personalized Screenshots
==========================================================
Sends personalized cold outreach emails with the attached custom calculator screenshot.
Includes sent-history tracking to avoid sending duplicate emails.
"""

import os
import sys
import smtplib
import json
import time
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage

# Ensure utf-8 output in Windows PowerShell/cmd
try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

# =========================================================================
# CONFIGURATION
# =========================================================================
DRY_RUN = False  # Set to True for preview mode, False for live sending!
BATCH_LIMIT = 100  # Send all remaining leads in outreach_campaigns

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_NAME = "Manav Rathod"
SENDER_EMAIL = "manavrathod6466@gmail.com"
SENDER_PASSWORD = "uhwpvmfrcltrmext"

# Paths
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
CAMPAIGNS_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", "outreach_campaigns"))
HISTORY_FILE = os.path.join(CURRENT_DIR, "sent_emails_history.json")


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


def send_campaign_emails():
    if not os.path.exists(CAMPAIGNS_DIR):
        print(f"❌ Campaigns directory not found at: {CAMPAIGNS_DIR}")
        print("Please run `generate_personalized_campaigns.py` first!")
        return

    sent_history = load_sent_history()
    folders = [f for f in os.listdir(CAMPAIGNS_DIR) if os.path.isdir(os.path.join(CAMPAIGNS_DIR, f))]

    print("=" * 70)
    print("🚀 AUTOMATED COLD OUTREACH DISPATCHER")
    print(f"📧 Sender: {SENDER_NAME} <{SENDER_EMAIL}>")
    print(f"📁 Target Campaigns Directory: {CAMPAIGNS_DIR}")
    print(f"📊 Total Available Leads: {len(folders)}")
    print(f"📬 Already Contacted: {len(sent_history)}")
    print(f"⚡ Batch Limit for This Run: {BATCH_LIMIT}")
    print(f"🛡️ Mode: {'DRY RUN (Preview Only)' if DRY_RUN else 'LIVE SENDING ACTIVE'}")
    print("=" * 70)

    server = None
    if not DRY_RUN:
        try:
            print(f"🔌 Connecting to Gmail SMTP server ({SMTP_SERVER}:{SMTP_PORT})...")
            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            print("✅ Logged in to Gmail successfully!\n")
        except Exception as e:
            print(f"❌ Failed to connect to SMTP server: {e}")
            return

    sent_count = 0

    for idx, folder_name in enumerate(folders, 1):
        if sent_count >= BATCH_LIMIT:
            print(f"\n✋ Reached batch limit of {BATCH_LIMIT} emails for this session.")
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

        # Check if already contacted
        if biz_name in sent_history:
            continue

        screenshot_file = lead.get("screenshot_file", "")
        screenshot_path = os.path.join(folder_path, screenshot_file)
        
        # Determine recipient domain
        web = lead.get("website", "")
        clean_domain = web.replace("https://", "").replace("http://", "").replace("www.", "").split("/")[0]
        target_email = f"info@{clean_domain}" if clean_domain and "." in clean_domain else None

        if not target_email:
            continue

        # Read Email Body
        with open(email_html_path, "r", encoding="utf-8") as hf:
            html_body = hf.read()
        with open(email_txt_path, "r", encoding="utf-8") as tf:
            txt_body = tf.read()

        html_body = html_body.replace('src="' + screenshot_file + '"', 'src="cid:calculator_preview"')
        html_body = html_body.replace('<strong>Manav</strong>', f'<strong>{SENDER_NAME}</strong>')
        txt_body = txt_body.replace('Manav\nLocal Growth', f'{SENDER_NAME}\nLocal Growth')

        subject = f"Quick question about {biz_name}'s website quote requests"

        if DRY_RUN:
            has_img = os.path.exists(screenshot_path)
            sent_count += 1
            print(f"  [Preview {sent_count}/{BATCH_LIMIT}] 📝 {biz_name} | Target: {target_email} | Screenshot: {'✅ Yes' if has_img else '❌ No'}")
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

                # Attach personalized screenshot as inline image
                if os.path.exists(screenshot_path):
                    with open(screenshot_path, "rb") as img_f:
                        img_data = img_f.read()
                        img_part = MIMEImage(img_data)
                        img_part.add_header('Content-ID', '<calculator_preview>')
                        img_part.add_header('Content-Disposition', 'inline', filename=os.path.basename(screenshot_path))
                        msg.attach(img_part)

                server.sendmail(SENDER_EMAIL, [target_email], msg.as_string())
                sent_count += 1

                # Record in sent history
                sent_history[biz_name] = {
                    "email": target_email,
                    "phone": lead.get("phone"),
                    "sent_at": time.strftime("%Y-%m-%d %H:%M:%S")
                }
                save_sent_history(sent_history)

                print(f"  ✓ [Sent {sent_count}/{BATCH_LIMIT}] 🚀 Emailed {biz_name} -> {target_email}")
                time.sleep(3)  # Polite delay between sends

            except Exception as send_err:
                print(f"  ❌ Error emailing {biz_name}: {send_err}")

    if server:
        server.quit()

    print("\n" + "=" * 70)
    print(f"🎉 BATCH COMPLETE: Successfully dispatched {sent_count} personalized emails with screenshots!")
    print(f"📊 Total Lifetime Contacted Businesses: {len(sent_history)}")
    print("=" * 70)


if __name__ == "__main__":
    send_campaign_emails()
