"""
Automated Review Booster Campaign & Acrylic QR Stand Generator
==============================================================
Generates personalized Smart Review Booster outreach packages:
1. Renders a luxury 4"x6" Branded Acrylic Tabletop QR Counter Stand preview with their business name & rating.
2. Generates tailored reputation-protection pitch email copy.
3. Generates 1-click WhatsApp message.
"""

import sys
import os
import csv
import json
import re
import time
import urllib.parse
from datetime import datetime

# Ensure utf-8 output in Windows PowerShell/cmd
try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

from playwright.sync_api import sync_playwright

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
SCRATCH_DIR = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
OUTPUT_REVIEWS_DIR = os.path.join(SCRATCH_DIR, "outreach_campaigns_reviews")


def clean_business_name(raw_name, maps_url):
    if raw_name and raw_name.strip() and raw_name.strip().lower() != "results":
        return raw_name.strip()
    if maps_url and "/place/" in maps_url:
        try:
            match = re.search(r'/place/([^/@]+)', maps_url)
            if match:
                encoded_name = match.group(1)
                clean_name = urllib.parse.unquote(encoded_name).replace("+", " ").strip()
                clean_name = clean_name.split("?")[0].strip()
                if clean_name:
                    return clean_name
        except Exception:
            pass
    return raw_name if raw_name else "Local Business"


def sanitize_filename(name):
    s = re.sub(r'[\\/*?:"<>|]', "", name)
    s = re.sub(r'\s+', '_', s).strip("_")
    return s[:60] if s else "Business_Lead"


def generate_acrylic_stand_html(biz_name, rating, reviews_count):
    """Render a luxury printable 4x6 acrylic tabletop review counter stand."""
    return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {{ margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }}
    body {{
      background: #090d16;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 30px;
    }}
    .stand-card {{
      width: 440px;
      height: 600px;
      background: linear-gradient(145deg, #0f172a, #090d16);
      border: 3px solid #6366f1;
      border-radius: 28px;
      padding: 36px 28px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      text-align: center;
      box-shadow: 0 30px 70px -15px rgba(0,0,0,0.9), 0 0 50px rgba(99, 102, 241, 0.3);
      position: relative;
      color: #ffffff;
    }}
    .stand-badge {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 16px;
      background: rgba(251, 191, 36, 0.15);
      border: 1px solid rgba(251, 191, 36, 0.4);
      border-radius: 30px;
      color: #fbbf24;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }}
    .biz-title {{
      font-size: 24px;
      font-weight: 800;
      color: #ffffff;
      margin-top: 10px;
      line-height: 1.2;
    }}
    .biz-sub {{
      font-size: 13px;
      color: #94a3b8;
      margin-top: 4px;
    }}
    .qr-box {{
      width: 200px;
      height: 200px;
      background: #ffffff;
      border-radius: 20px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      position: relative;
    }}
    .fake-qr {{
      width: 100%;
      height: 100%;
      background: 
        repeating-linear-gradient(0deg, #000 0, #000 6px, transparent 6px, transparent 12px),
        repeating-linear-gradient(90deg, #000 0, #000 6px, #fff 6px, #fff 12px);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }}
    .qr-center-icon {{
      width: 44px;
      height: 44px;
      background: #4f46e5;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }}
    .stars-row {{
      display: flex;
      gap: 6px;
      font-size: 26px;
      color: #fbbf24;
    }}
    .callout-text {{
      font-size: 16px;
      font-weight: 700;
      color: #f1f5f9;
    }}
    .smart-filter-note {{
      font-size: 11px;
      color: #10b981;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.25);
      padding: 6px 12px;
      border-radius: 8px;
      font-weight: 600;
    }}
  </style>
</head>
<body>
  <div class="stand-card">
    <div>
      <div class="stand-badge">⭐ How Did We Do Today?</div>
      <div class="biz-title">{biz_name}</div>
      <div class="biz-sub">★ {rating} ({reviews_count} Google Reviews)</div>
    </div>

    <div class="qr-box">
      <div class="fake-qr">
        <div class="qr-center-icon">⭐</div>
      </div>
    </div>

    <div>
      <div class="stars-row">★★★★★</div>
      <div class="callout-text" style="margin-top: 6px;">Tap or Scan to Leave a Review</div>
    </div>

    <div class="smart-filter-note">
      🛡️ Smart Protected: 5★ Goes to Google • 1-3★ Intercepted Privately
    </div>
  </div>
</body>
</html>
"""


def generate_review_email_text(biz_name, rating, reviews_count, screenshot_file):
    return f"""Subject: Quick question about {biz_name}'s Google Reviews rating

Hi {biz_name} Team,

I noticed {biz_name} has a great reputation ({rating}★ with {reviews_count} reviews on Google Maps), but you could easily be at 4.9+ stars if more of your happy everyday customers left reviews at the front desk.

The biggest challenge local businesses face is that unhappy customers are 10x more likely to post on Google than happy ones.

I built a "Smart Review Booster" table tent stand system specifically for local businesses:
1. When happy customers (4-5 stars) scan the counter stand, they are routed straight to Google Maps with celebratory confetti.
2. If someone had an issue (1-3 stars), it privately intercepts their feedback straight to your manager's WhatsApp or email before it ever touches Google.

I generated a custom demo stand designed for {biz_name} (attached as {screenshot_file}).

Can I drop off / send over a 100% Free Acrylic Test Stand for your front counter for 14 days so you can test it risk-free?

Best regards,
Manav Rathod
Reputation & Local Growth Partner
"""


def generate_review_email_html(biz_name, rating, reviews_count, screenshot_file):
    return f"""<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; color: #1e293b; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
  <p>Hi <strong>{biz_name}</strong> Team,</p>

  <p>I noticed <strong>{biz_name}</strong> has great service (<strong>⭐ {rating} rating with {reviews_count} reviews</strong> on Google Maps), but your rating could easily be 4.9+ stars if more of your happy walk-in clients left reviews at the checkout counter.</p>

  <p>The problem is that <em>unhappy customers are 10x more likely to post on Google</em> than happy ones.</p>

  <p>I created a <strong>Smart Review Booster</strong> acrylic counter stand specifically for your business:</p>

  <ul>
    <li><strong>Happy Customers (4–5 Stars):</strong> Routed straight to your Google Maps review page with 1 tap.</li>
    <li><strong>Unhappy Visits (1–3 Stars):</strong> Privately intercepted straight to your manager's inbox before it ever touches Google.</li>
  </ul>

  <div style="margin: 20px 0; text-align: center;">
    <img src="{screenshot_file}" alt="{biz_name} Review Stand Preview" style="max-width: 380px; width: 100%; border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); display: inline-block;" />
  </div>

  <p>I would love to set up a <strong>100% Free 14-Day Test Run</strong> with a printed acrylic counter stand for {biz_name}.</p>

  <p>Can I send over the live link or drop off a test stand this week?</p>

  <p style="margin-top: 24px;">
    Best regards,<br />
    <strong>Manav Rathod</strong><br />
    <span style="color: #64748b; font-size: 13px;">Reputation & Local Growth Partner</span>
  </p>
</body>
</html>
"""


def process_review_campaigns():
    os.makedirs(OUTPUT_REVIEWS_DIR, exist_ok=True)

    csv_files = [f for f in os.listdir(CURRENT_DIR) if f.startswith("google_maps_leads_") and f.endswith(".csv")]
    if not csv_files:
        print("No google_maps_leads_*.csv found!", flush=True)
        return

    csv_files.sort(reverse=True)
    target_csv = os.path.join(CURRENT_DIR, csv_files[0])

    print("=" * 70, flush=True)
    print("🚀 GENERATING SMART REVIEW BOOSTER CAMPAIGNS & QR STANDS", flush=True)
    print(f"📄 Source Leads: {os.path.basename(target_csv)}", flush=True)
    print(f"📁 Output Directory: {OUTPUT_REVIEWS_DIR}", flush=True)
    print("=" * 70, flush=True)

    leads = []
    with open(target_csv, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            clean_name = clean_business_name(row.get("Business Name"), row.get("Google Maps URL"))
            row["Clean Business Name"] = clean_name
            leads.append(row)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1000, "height": 900}, device_scale_factor=2)

        processed_count = 0
        seen_names = set()

        for idx, lead in enumerate(leads, 1):
            biz_name = lead["Clean Business Name"]
            if not biz_name or biz_name.lower() in seen_names:
                continue
            seen_names.add(biz_name.lower())

            folder_name = sanitize_filename(biz_name)
            biz_folder = os.path.join(OUTPUT_REVIEWS_DIR, folder_name)
            os.makedirs(biz_folder, exist_ok=True)

            phone = lead.get("Phone Number", "N/A")
            rating = lead.get("Rating", "4.8")
            reviews = lead.get("Review Count", "50")
            website = lead.get("Website", "N/A")
            address = lead.get("Address", "N/A")
            maps_url = lead.get("Google Maps URL", "")

            # 1. Render & Capture Stand Screenshot
            html_content = generate_acrylic_stand_html(biz_name, rating, reviews)
            screenshot_filename = f"review_stand_{folder_name}.png"
            screenshot_path = os.path.join(biz_folder, screenshot_filename)

            page.set_content(html_content, wait_until="load")
            time.sleep(0.1)

            stand_el = page.locator(".stand-card")
            if stand_el.is_visible():
                stand_el.screenshot(path=screenshot_path)
            else:
                page.screenshot(path=screenshot_path)

            # 2. Lead info
            lead_info = {
                "business_name": biz_name,
                "phone": phone,
                "website": website,
                "rating": rating,
                "review_count": reviews,
                "address": address,
                "google_maps_url": maps_url,
                "screenshot_file": screenshot_filename,
                "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            with open(os.path.join(biz_folder, "lead_info.json"), "w", encoding="utf-8") as jf:
                json.dump(lead_info, jf, indent=2)

            # 3. Emails
            email_txt = generate_review_email_text(biz_name, rating, reviews, screenshot_filename)
            with open(os.path.join(biz_folder, "cold_email.txt"), "w", encoding="utf-8") as ef:
                ef.write(email_txt)

            email_html = generate_review_email_html(biz_name, rating, reviews, screenshot_filename)
            with open(os.path.join(biz_folder, "cold_email.html"), "w", encoding="utf-8") as ehf:
                ehf.write(email_html)

            processed_count += 1
            print(f"  ✓ [Processed {processed_count}] Branded Stand created for: \"{biz_name}\" -> {folder_name}/", flush=True)

        browser.close()

    print("\n" + "=" * 70, flush=True)
    print(f"🎉 SUCCESS! Processed {processed_count} Review Booster campaign folders with custom QR stands.")
    print("=" * 70, flush=True)


if __name__ == "__main__":
    process_review_campaigns()
