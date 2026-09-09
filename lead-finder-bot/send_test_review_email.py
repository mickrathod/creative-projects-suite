"""
Test Dispatcher for Review Booster
==================================
Sends a live sample Review Booster pitch email with the custom Acrylic Tabletop Stand
directly to YOUR inbox (manavrathod6466@gmail.com) so you can review it live.
"""

import os
import sys
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_NAME = "Manav Rathod"
SENDER_EMAIL = "manavrathod6466@gmail.com"
SENDER_PASSWORD = "uhwpvmfrcltrmext"

RECIPIENT_EMAIL = "manavrathod6466@gmail.com"

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
SAMPLE_FOLDER = os.path.abspath(os.path.join(CURRENT_DIR, "..", "outreach_campaigns_reviews", "Brickell_Dental_Care"))


def send_test_review_email():
    print("=" * 65)
    print("🚀 SENDING LIVE REVIEW BOOSTER SAMPLE WITH QR STAND PREVIEW")
    print(f"📧 From: {SENDER_NAME} <{SENDER_EMAIL}>")
    print(f"📥 To:   {RECIPIENT_EMAIL}")
    print(f"📁 Sample Lead: Brickell Dental Care")
    print("=" * 65)

    if not os.path.exists(SAMPLE_FOLDER):
        print(f"❌ Sample folder not found at: {SAMPLE_FOLDER}")
        return

    html_path = os.path.join(SAMPLE_FOLDER, "cold_email.html")
    txt_path = os.path.join(SAMPLE_FOLDER, "cold_email.txt")
    screenshot_path = os.path.join(SAMPLE_FOLDER, "review_stand_Brickell_Dental_Care.png")

    with open(html_path, "r", encoding="utf-8") as f:
        html_content = f.read()

    with open(txt_path, "r", encoding="utf-8") as f:
        txt_content = f.read()

    html_content = html_content.replace('src="review_stand_Brickell_Dental_Care.png"', 'src="cid:stand_preview"')

    msg = MIMEMultipart("related")
    msg["Subject"] = "[REVIEW BOOSTER DEMO] Quick question about Brickell Dental Care's Google Reviews rating"
    msg["From"] = f"{SENDER_NAME} <{SENDER_EMAIL}>"
    msg["To"] = RECIPIENT_EMAIL

    alt_part = MIMEMultipart("alternative")
    alt_part.attach(MIMEText(txt_content, "plain", "utf-8"))
    alt_part.attach(MIMEText(html_content, "html", "utf-8"))
    msg.attach(alt_part)

    if os.path.exists(screenshot_path):
        with open(screenshot_path, "rb") as img_file:
            img_data = img_file.read()
            img_part = MIMEImage(img_data)
            img_part.add_header('Content-ID', '<stand_preview>')
            img_part.add_header('Content-Disposition', 'inline', filename="Brickell_Dental_Review_Stand.png")
            msg.attach(img_part)

    try:
        print("🔌 Connecting to Gmail SMTP server...")
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        print("✅ Logged in to Gmail successfully!")

        print("📤 Sending Review Booster email...")
        server.sendmail(SENDER_EMAIL, [RECIPIENT_EMAIL], msg.as_string())
        server.quit()

        print("\n" + "=" * 65)
        print("🎉 SUCCESS! Review Booster test email sent to manavrathod6466@gmail.com!")
        print("📱 Check your Gmail inbox to see the acrylic table stand preview.")
        print("=" * 65)

    except Exception as e:
        print(f"❌ Error sending email: {e}")


if __name__ == "__main__":
    send_test_review_email()
