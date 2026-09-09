"""
Automated Lead Organizer, Personalized Screenshot Generator & Campaign Builder
=============================================================================
1. Reads scraped Google Maps leads from CSV.
2. Cleans business names and extracts phone numbers, ratings, websites, and addresses.
3. Creates a separate, dedicated folder for EVERY business.
4. Uses Playwright to render a personalized live preview with THEIR business name & phone,
   and captures high-resolution PNG screenshots.
5. Generates customized cold email copy, HTML email template with screenshot, and WhatsApp pitch.
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

# Directories
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
SCRATCH_DIR = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
OUTPUT_BASE_DIR = os.path.join(SCRATCH_DIR, "outreach_campaigns")


def clean_business_name(raw_name, maps_url):
    """Extract clean business name from URL or fallback."""
    if raw_name and raw_name.strip() and raw_name.strip().lower() != "results":
        return raw_name.strip()
    
    if maps_url and "/place/" in maps_url:
        try:
            match = re.search(r'/place/([^/@]+)', maps_url)
            if match:
                encoded_name = match.group(1)
                clean_name = urllib.parse.unquote(encoded_name).replace("+", " ").strip()
                # Clean up any trailing query strings
                clean_name = clean_name.split("?")[0].strip()
                if clean_name:
                    return clean_name
        except Exception:
            pass
            
    return raw_name if raw_name else "Local Business"


def sanitize_filename(name):
    """Sanitize string for Windows folder name."""
    s = re.sub(r'[\\/*?:"<>|]', "", name)
    s = re.sub(r'\s+', '_', s).strip("_")
    return s[:60] if s else "Business_Lead"


def determine_industry_preset(query, name, category):
    combined = f"{query} {name} {category}".lower()
    if "roof" in combined or "siding" in combined or "contractor" in combined:
        return {
            "niche": "Roofing & Contractors",
            "icon": "🏠",
            "color": "#ea580c",
            "service_sample": "Architectural Shingle Roofing",
            "base_price": "$1,200",
            "unit_label": "Roof Area (2,000 sq ft)",
            "discount_text": "🔥 $250 Instant Online Voucher Applied"
        }
    elif "dental" in combined or "dentist" in combined or "spa" in combined or "clinic" in combined:
        return {
            "niche": "Dental & Aesthetic Care",
            "icon": "🦷",
            "color": "#6366f1",
            "service_sample": "Cosmetic Teeth Whitening & Cleaning",
            "base_price": "$189",
            "unit_label": "Treatment Session",
            "discount_text": "✨ $50 First-Visit New Patient Credit"
        }
    elif "auto" in combined or "detail" in combined or "car" in combined:
        return {
            "niche": "Mobile Auto Detailing",
            "icon": "🚗",
            "color": "#059669",
            "service_sample": "Signature Full Interior & Exterior Detail",
            "base_price": "$195",
            "unit_label": "Vehicle Size: SUV",
            "discount_text": "💎 Free Hydrophobic Ceramic Topcoat"
        }
    else: # Default: Cleaning
        return {
            "niche": "Residential & Commercial Cleaning",
            "icon": "🧹",
            "color": "#2563eb",
            "service_sample": "Deep Sanitization & House Turnover",
            "base_price": "$149",
            "unit_label": "Home Size: 1,800 sq ft",
            "discount_text": "⚡ 10% Instant Online Booking Discount"
        }


def generate_html_preview_card(biz_name, phone, rating, reviews_count, preset):
    """Generate a sleek, standalone HTML card for crisp Playwright screenshot rendering."""
    return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {{ margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }}
    body {{
      background: #090d16;
      color: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 40px;
      background-image: radial-gradient(circle at 50% 0%, {preset['color']}22 0%, transparent 60%);
    }}
    .widget-container {{
      width: 620px;
      background: #0d1322;
      border: 2px solid {preset['color']}55;
      border-radius: 24px;
      padding: 32px;
      box-shadow: 0 25px 60px -10px rgba(0,0,0,0.8), 0 0 40px {preset['color']}22;
      position: relative;
    }}
    .top-badge {{
      background: linear-gradient(90deg, #f59e0b22, #ea580c22);
      border: 1px solid #f59e0b55;
      color: #fbbf24;
      font-size: 12px;
      font-weight: 700;
      padding: 8px 14px;
      border-radius: 10px;
      text-align: center;
      margin-bottom: 20px;
    }}
    .header-row {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }}
    .biz-brand {{
      display: flex;
      align-items: center;
      gap: 12px;
    }}
    .biz-icon {{
      width: 46px;
      height: 46px;
      border-radius: 12px;
      background: {preset['color']};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      box-shadow: 0 4px 14px {preset['color']}66;
    }}
    .biz-title {{
      font-size: 18px;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.2;
    }}
    .biz-meta {{
      font-size: 12px;
      color: #94a3b8;
      display: flex;
      align-items: center;
      gap: 6px;
    }}
    .stepper {{
      display: flex;
      justify-content: space-between;
      margin-bottom: 24px;
    }}
    .step-item {{
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 600;
      color: #cbd5e1;
    }}
    .step-circle {{
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: {preset['color']};
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 800;
    }}
    .services-grid {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 20px;
    }}
    .service-card {{
      background: rgba(255,255,255,0.03);
      border: 2px solid {preset['color']};
      border-radius: 14px;
      padding: 16px;
      position: relative;
    }}
    .service-name {{
      font-weight: 700;
      font-size: 14px;
      margin-bottom: 4px;
    }}
    .service-price {{
      color: #38bdf8;
      font-weight: 800;
      font-size: 15px;
    }}
    .calc-slider-box {{
      background: #090d16;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 20px;
    }}
    .slider-track {{
      height: 6px;
      background: #1e293b;
      border-radius: 3px;
      margin: 10px 0;
      position: relative;
    }}
    .slider-fill {{
      height: 100%;
      width: 65%;
      background: {preset['color']};
      border-radius: 3px;
    }}
    .footer-action {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 14px;
      padding: 14px 20px;
    }}
    .price-total {{
      font-size: 26px;
      font-weight: 800;
      color: #10b981;
    }}
    .btn-submit {{
      background: #10b981;
      color: #022c22;
      font-weight: 800;
      font-size: 14px;
      padding: 12px 24px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }}
  </style>
</head>
<body>
  <div class="widget-container">
    <div class="top-badge">{preset['discount_text']}</div>
    
    <div class="header-row">
      <div class="biz-brand">
        <div class="biz-icon">{preset['icon']}</div>
        <div>
          <div class="biz-title">{biz_name}</div>
          <div class="biz-meta">
            <span style="color: #fbbf24;">★ {rating if rating != 'N/A' else '5.0'}</span> ({reviews_count} Google Reviews) • 📞 {phone if phone != 'N/A' else 'Inbound Phone Line'}
          </div>
        </div>
      </div>
    </div>

    <div class="stepper">
      <div class="step-item"><div class="step-circle">✓</div> 1. Select Service</div>
      <div class="step-item"><div class="step-circle" style="background: {preset['color']};">2</div> 2. Dimensions</div>
      <div class="step-item" style="opacity: 0.5;"><div class="step-circle" style="background: #1e293b;">3</div> 3. Lock In Price</div>
    </div>

    <div class="services-grid">
      <div class="service-card">
        <div style="font-size: 20px; margin-bottom: 6px;">{preset['icon']}</div>
        <div class="service-name">{preset['service_sample']}</div>
        <div class="service-price">Starting at {preset['base_price']}</div>
      </div>
      <div class="service-card" style="border-color: rgba(255,255,255,0.08); background: #090d16;">
        <div style="font-size: 20px; margin-bottom: 6px;">✨</div>
        <div class="service-name">Premium Package & Warranty</div>
        <div class="service-price" style="color: #94a3b8;">Custom Scope</div>
      </div>
    </div>

    <div class="calc-slider-box">
      <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 600;">
        <span>Property Scope / Dimensions:</span>
        <span style="color: {preset['color']}; font-weight: 800;">{preset['unit_label']}</span>
      </div>
      <div class="slider-track"><div class="slider-fill"></div></div>
    </div>

    <div class="footer-action">
      <div>
        <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 700;">Instant Quoted Estimate:</div>
        <div class="price-total">{preset['base_price']} <span style="font-size: 13px; color: #94a3b8; font-weight: 500;">(Ready to Book)</span></div>
      </div>
      <div class="btn-submit">
        <span>Lock In Estimate →</span>
      </div>
    </div>
  </div>
</body>
</html>
"""


def generate_email_text(biz_name, phone, rating, reviews_count, preset, screenshot_filename):
    return f"""Subject: Quick question about {biz_name}'s website quote requests

Hi {biz_name} Team,

I came across {biz_name} on Google Maps while looking up top-rated {preset['niche']} companies in your area. 

Congrats on having a {rating}★ rating ({reviews_count} reviews) — your craftsmanship clearly speaks for itself.

I noticed that prospective clients visiting your website currently have to fill out a standard static form or wait on hold to find out your ballpark pricing. 

Most homeowners leave before contacting because they want immediate price reassurance.

I built a custom Instant Price Estimator widget specifically tailored for {biz_name} that calculates real-time estimates and captures their name & phone number straight into your CRM or WhatsApp.

I generated a live preview of how it looks customized for {biz_name} (attached as {screenshot_filename}).

I would love to set this up on your website for a 100% FREE 7-Day Trial so you can see the new quote inquiries roll in. 

Would you like me to send over the 1-line installation code?

Best regards,
Manav
Local Growth & Software Partner
"""


def generate_email_html(biz_name, phone, rating, reviews_count, preset, screenshot_filename):
    return f"""<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; color: #1e293b; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
  <p>Hi <strong>{biz_name}</strong> Team,</p>

  <p>I came across <strong>{biz_name}</strong> on Google Maps while researching top-rated <strong>{preset['niche']}</strong> businesses in your area.</p>

  <p>Congrats on maintaining a strong <strong>⭐ {rating} rating ({reviews_count} reviews)</strong> — your reputation is impressive!</p>

  <p>I noticed that website visitors currently have to fill out a static contact form and wait 24–48 hours just to get a ballpark price estimate. Many high-intent shoppers bounce away because they want immediate answers.</p>

  <p>I built an interactive <strong>Instant Quote Estimator</strong> customized specifically for <strong>{biz_name}</strong> that gives homeowners instant pricing in exchange for their name and phone number.</p>

  <div style="margin: 20px 0; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
    <img src="{screenshot_filename}" alt="{biz_name} Instant Quote Calculator Preview" style="width: 100%; height: auto; display: block;" />
  </div>

  <p>I would love to install this on your website for a <strong>100% Free 7-Day Trial</strong> so you can test it risk-free and watch new customer phone numbers roll in.</p>

  <p>Can I send over the 1-line embed snippet or help you plug it in this week?</p>

  <p style="margin-top: 24px;">
    Best regards,<br />
    <strong>Manav</strong><br />
    <span style="color: #64748b; font-size: 13px;">Local Business Growth & Automation Partner</span>
  </p>
</body>
</html>
"""


def generate_whatsapp_pitch(biz_name, phone, preset):
    clean_phone = re.sub(r'\D', '', phone)
    msg = f"Hi {biz_name}, I saw your company on Google Maps. I created a custom Instant Price Calculator widget for your website that sends quote leads straight to your WhatsApp. Here is a quick screenshot of how it looks with your branding: Can I set it up for a free 7-day test run for you?"
    encoded_msg = urllib.parse.quote(msg)
    wa_url = f"https://wa.me/{clean_phone}?text={encoded_msg}" if clean_phone else "N/A"
    return f"""========================================
WHATSAPP DIRECT 1-CLICK OUTREACH PITCH
========================================
Business: {biz_name}
Target Phone: {phone}
Direct WhatsApp Link: {wa_url}

Message Text:
----------------------------------------
{msg}
----------------------------------------
"""


def process_campaigns():
    os.makedirs(OUTPUT_BASE_DIR, exist_ok=True)

    # Find the most recent google maps leads CSV
    csv_files = [f for f in os.listdir(CURRENT_DIR) if f.startswith("google_maps_leads_") and f.endswith(".csv")]
    if not csv_files:
        print("No google_maps_leads_*.csv found in lead-finder-bot directory!", flush=True)
        return

    csv_files.sort(reverse=True)
    target_csv = os.path.join(CURRENT_DIR, csv_files[0])

    print("=" * 70, flush=True)
    print("STARTING AUTOMATED PERSONALIZED SCREENSHOT & CAMPAIGN GENERATOR", flush=True)
    print(f"Reading Leads from: {os.path.basename(target_csv)}", flush=True)
    print(f"Output Directory: {OUTPUT_BASE_DIR}", flush=True)
    print("=" * 70, flush=True)

    leads = []
    with open(target_csv, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            clean_name = clean_business_name(row.get("Business Name"), row.get("Google Maps URL"))
            row["Clean Business Name"] = clean_name
            leads.append(row)

    print(f"Found {len(leads)} leads to process.", flush=True)

    # Launch Playwright to capture screenshots
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 900}, device_scale_factor=2)

        processed_count = 0
        seen_names = set()

        for idx, lead in enumerate(leads, 1):
            biz_name = lead["Clean Business Name"]
            if not biz_name or biz_name.lower() in seen_names:
                continue
            seen_names.add(biz_name.lower())

            folder_name = sanitize_filename(biz_name)
            biz_folder = os.path.join(OUTPUT_BASE_DIR, folder_name)
            os.makedirs(biz_folder, exist_ok=True)

            phone = lead.get("Phone Number", "N/A")
            rating = lead.get("Rating", "5.0")
            reviews = lead.get("Review Count", "50")
            query = lead.get("Search Query", "")
            category = lead.get("Category", "")
            website = lead.get("Website", "N/A")
            address = lead.get("Address", "N/A")
            maps_url = lead.get("Google Maps URL", "")

            preset = determine_industry_preset(query, biz_name, category)

            # 1. Generate & Capture Personalized High-Res Screenshot
            html_content = generate_html_preview_card(biz_name, phone, rating, reviews, preset)
            
            screenshot_filename = f"personalized_calculator_{folder_name}.png"
            screenshot_path = os.path.join(biz_folder, screenshot_filename)

            page.set_content(html_content, wait_until="load")
            time.sleep(0.1)

            widget_el = page.locator(".widget-container")
            if widget_el.is_visible():
                widget_el.screenshot(path=screenshot_path)
            else:
                page.screenshot(path=screenshot_path, full_page=False)

            # 2. Save Lead Info JSON
            lead_info = {
                "business_name": biz_name,
                "phone": phone,
                "website": website,
                "rating": rating,
                "review_count": reviews,
                "category": category,
                "address": address,
                "niche": preset["niche"],
                "google_maps_url": maps_url,
                "folder_path": biz_folder,
                "screenshot_file": screenshot_filename,
                "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            with open(os.path.join(biz_folder, "lead_info.json"), "w", encoding="utf-8") as jf:
                json.dump(lead_info, jf, indent=2)

            # 3. Generate Cold Email (Plaintext & HTML)
            email_txt = generate_email_text(biz_name, phone, rating, reviews, preset, screenshot_filename)
            with open(os.path.join(biz_folder, "cold_email.txt"), "w", encoding="utf-8") as ef:
                ef.write(email_txt)

            email_html = generate_email_html(biz_name, phone, rating, reviews, preset, screenshot_filename)
            with open(os.path.join(biz_folder, "cold_email.html"), "w", encoding="utf-8") as ehf:
                ehf.write(email_html)

            # 4. Generate WhatsApp 1-Click Pitch
            wa_txt = generate_whatsapp_pitch(biz_name, phone, preset)
            with open(os.path.join(biz_folder, "whatsapp_pitch.txt"), "w", encoding="utf-8") as waf:
                waf.write(wa_txt)

            processed_count += 1
            print(f"  [Processed {processed_count}] Saved assets for: \"{biz_name}\" -> {folder_name}/", flush=True)

        browser.close()

    print("\n" + "=" * 70, flush=True)
    print(f"SUCCESS! Processed {processed_count} individual business campaign folders.", flush=True)
    print(f"All campaign folders are ready in: {OUTPUT_BASE_DIR}", flush=True)
    print("=" * 70, flush=True)


if __name__ == "__main__":
    process_campaigns()
