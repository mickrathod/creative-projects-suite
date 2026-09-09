"""
Test Email Dispatcher
=====================
Sends a single sample personalized pitch email with the screenshot attachment
directly to YOUR inbox (manavrathod6466@gmail.com) so you can review it live.
"""

import os
import sys
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage

# Force UTF-8 in console
try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_NAME = "Manav Rathod"
SENDER_EMAIL = "manavrathod6466@gmail.com"
SENDER_PASSWORD = "uhwpvmfrcltrmext"

RECIPIENT_EMAIL = "manavrathod6466@gmail.com"  # Sending to yourself for verification

# Pick a sample campaign folder
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
SAMPLE_FOLDER = os.path.abspath(os.path.join(CURRENT_DIR, "..", "outreach_campaigns", "A-Denver_Roofing"))


def send_test_email():
    print("=" * 65)
    print("🚀 SENDING LIVE TEST EMAIL WITH SCREENSHOT ATTACHMENT")
    print(f"📧 From: {SENDER_NAME} <{SENDER_EMAIL}>")
    print(f"📥 To:   {RECIPIENT_EMAIL}")
    print(f"📁 Sample Lead: A-Denver Roofing")
    print("=" * 65)

    if not os.path.exists(SAMPLE_FOLDER):
        print(f"❌ Sample folder not found at: {SAMPLE_FOLDER}")
        return

    html_path = os.path.join(SAMPLE_FOLDER, "cold_email.html")
    txt_path = os.path.join(SAMPLE_FOLDER, "cold_email.txt")
    screenshot_path = os.path.join(SAMPLE_FOLDER, "personalized_calculator_A-Denver_Roofing.png")

    with open(html_path, "r", encoding="utf-8") as f:
        html_content = f.read()

    with open(txt_path, "r", encoding="utf-8") as f:
        txt_content = f.read()

    # Modify HTML to use inline CID image so it shows directly inside the email body
    html_content = html_content.replace('src="personalized_calculator_A-Denver_Roofing.png"', 'src="cid:calculator_preview"')
    html_content = html_content.replace('<strong>Manav</strong>', '<strong>Manav Rathod</strong>')
    txt_content = txt_content.replace('Manav\nLocal Growth', 'Manav Rathod\nLocal Growth')

    msg = MIMEMultipart("related")
    msg["Subject"] = "[LIVE TEST] Quick question about A-Denver Roofing's website quote requests"
    msg["From"] = f"{SENDER_NAME} <{SENDER_EMAIL}>"
    msg["To"] = RECIPIENT_EMAIL

    alt_part = MIMEMultipart("alternative")
    alt_part.attach(MIMEText(txt_content, "plain", "utf-8"))
    alt_part.attach(MIMEText(html_content, "html", "utf-8"))
    msg.attach(alt_part)

    # Attach the high-res screenshot
    if os.path.exists(screenshot_path):
        with open(screenshot_path, "rb") as img_file:
            img_data = img_file.read()
            img_part = MIMEImage(img_data)
            img_part.add_header('Content-ID', '<calculator_preview>')
            img_part.add_header('Content-Disposition', 'inline', filename="A_Denver_Roofing_Calculator_Preview.png")
            msg.attach(img_part)

    try:
        print("🔌 Connecting to Gmail SMTP server...")
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        print("✅ Logged in to Gmail successfully!")

        print("📤 Sending email message...")
        server.sendmail(SENDER_EMAIL, [RECIPIENT_EMAIL], msg.as_string())
        server.quit()

        print("\n" + "=" * 65)
        print("🎉 SUCCESS! Test email has been sent to manavrathod6466@gmail.com!")
        print("📱 Check your Gmail inbox (or spam/promotions tab) on your phone or browser.")
        print("=" * 65)

    except Exception as e:
        print(f"\n❌ Failed to send email: {e}")


if __name__ == "__main__":
    send_test_email()
