"""
Google Maps Lead Finder Bot using Playwright
============================================
Scrapes local businesses from Google Maps based on your target keyword and location.
Extracts: Business Name, Rating, Review Count, Category, Phone, Website, Address, and Maps Link.
Saves all leads directly into a timestamped CSV spreadsheet.
"""

import time
import re
import csv
import os
from datetime import datetime
from playwright.sync_api import sync_playwright

# ==========================================
# CONFIGURATION: Customize Your Search Query
# ==========================================
SEARCH_QUERIES = [
    "house cleaning in Austin TX",
    "roofing contractors in Denver CO",
    "dental clinic in Miami FL"
]

MAX_RESULTS_PER_SEARCH = 25  # Number of business leads to extract per query
HEADLESS = False  # Set to False to watch the browser work in real-time


def scrape_google_maps(queries, max_results=20, headless=False):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_filename = f"google_maps_leads_{timestamp}.csv"
    
    leads_data = []

    print("=" * 65)
    print("🚀 GOOGLE MAPS PLAYWRIGHT LEAD FINDER BOT")
    print(f"📁 Output file: {output_filename}")
    print(f"🔍 Total search queries: {len(queries)}")
    print("=" * 65)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=headless, args=["--start-maximized"])
        context = browser.new_context(
            viewport=None,
            locale="en-US",
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = context.new_page()

        for query_idx, query in enumerate(queries, 1):
            print(f"\n[{query_idx}/{len(queries)}] 🔎 Searching Google Maps for: \"{query}\"...")
            
            search_url = f"https://www.google.com/maps/search/{query.replace(' ', '+')}"
            try:
                page.goto(search_url, wait_until="domcontentloaded", timeout=60000)
                time.sleep(3)

                # Accept Google consent cookies if presented
                try:
                    consent_btn = page.locator("button:has-text('Accept all'), button:has-text('I agree'), button:has-text('Accept')")
                    if consent_btn.count() > 0 and consent_btn.first.is_visible():
                        consent_btn.first.click()
                        time.sleep(1)
                except Exception:
                    pass

                # Locate the scrollable results feed
                feed_locator = page.locator("div[role='feed']")
                try:
                    feed_locator.wait_for(state="visible", timeout=10000)
                except Exception:
                    print("⚠️ Feed container not immediately found, scanning visible listings...")

                # Scroll down to load more results
                print("⏳ Scrolling results list to load businesses...")
                scrolled_count = 0
                max_scroll_attempts = 15
                
                while scrolled_count < max_scroll_attempts:
                    page.mouse.wheel(0, 3000)
                    time.sleep(1.2)
                    
                    # Count currently loaded items
                    items = page.locator("div[role='feed'] > div > div > a[href*='/maps/place/']").all()
                    if len(items) >= max_results:
                        break
                    scrolled_count += 1

                # Extract listings
                listings = page.locator("div[role='feed'] > div > div > a[href*='/maps/place/']").all()
                print(f"📊 Found {len(listings)} listings on page. Extracting top {min(len(listings), max_results)} leads...")

                collected_for_query = 0

                for idx, listing in enumerate(listings):
                    if collected_for_query >= max_results:
                        break

                    try:
                        # Click on listing to open detail panel
                        listing.scroll_into_view_if_needed()
                        listing.click()
                        time.sleep(1.5)

                        # Extract Business Name
                        name = "N/A"
                        try:
                            name_el = page.locator("h1.DUwDvf, h1").first
                            if name_el.is_visible():
                                name = name_el.inner_text().strip()
                        except Exception:
                            pass

                        if not name or name == "N/A":
                            # Fallback from aria-label
                            name = listing.get_attribute("aria-label") or "Unknown Business"

                        # Extract Rating & Reviews
                        rating = "N/A"
                        reviews_count = "0"
                        try:
                            rating_el = page.locator("div.F7nice span[aria-hidden='true']").first
                            if rating_el.is_visible():
                                rating = rating_el.inner_text().strip()
                            
                            reviews_el = page.locator("div.F7nice span[aria-label*='reviews'], div.F7nice span[aria-label*='review']").first
                            if reviews_el.is_visible():
                                raw_reviews = reviews_el.get_attribute("aria-label") or ""
                                reviews_match = re.search(r'([\d,]+)', raw_reviews)
                                if reviews_match:
                                    reviews_count = reviews_match.group(1).replace(",", "")
                        except Exception:
                            pass

                        # Extract Category
                        category = "N/A"
                        try:
                            cat_el = page.locator("button.DkEaL, jsaction*='category'").first
                            if cat_el.is_visible():
                                category = cat_el.inner_text().strip()
                        except Exception:
                            pass

                        # Extract Phone Number
                        phone = "N/A"
                        try:
                            phone_el = page.locator("button[data-item-id*='phone:tel:'], button[aria-label*='Phone:']").first
                            if phone_el.is_visible():
                                raw_phone = phone_el.get_attribute("aria-label") or phone_el.inner_text()
                                phone = raw_phone.replace("Phone:", "").replace("Copy phone number", "").strip()
                        except Exception:
                            pass

                        # Extract Website
                        website = "N/A"
                        try:
                            web_el = page.locator("a[data-item-id='authority'], a[aria-label*='Website:']").first
                            if web_el.is_visible():
                                website = web_el.get_attribute("href") or "N/A"
                        except Exception:
                            pass

                        # Extract Address
                        address = "N/A"
                        try:
                            addr_el = page.locator("button[data-item-id='address'], button[aria-label*='Address:']").first
                            if addr_el.is_visible():
                                raw_addr = addr_el.get_attribute("aria-label") or addr_el.inner_text()
                                address = raw_addr.replace("Address:", "").strip()
                        except Exception:
                            pass

                        place_url = page.url

                        lead_item = {
                            "Search Query": query,
                            "Business Name": name,
                            "Rating": rating,
                            "Review Count": reviews_count,
                            "Category": category,
                            "Phone Number": phone,
                            "Website": website,
                            "Address": address,
                            "Google Maps URL": place_url,
                            "Scraped At": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                        }

                        leads_data.append(lead_item)
                        collected_for_query += 1

                        print(f"  ✓ [{collected_for_query}/{max_results}] {name} | 📞 {phone} | ⭐ {rating} ({reviews_count} reviews) | 🌐 {website[:30] if website != 'N/A' else 'No site'}")

                    except Exception as item_err:
                        # If single item fails, continue to next
                        continue

            except Exception as query_err:
                print(f"❌ Error processing query '{query}': {query_err}")
                continue

        browser.close()

    # Save to CSV
    if leads_data:
        keys = leads_data[0].keys()
        with open(output_filename, "w", newline="", encoding="utf-8-sig") as f:
            writer = csv.DictWriter(f, fieldnames=keys)
            writer.writeheader()
            writer.writerows(leads_data)

        print("\n" + "=" * 65)
        print(f"🎉 SUCCESS: Extracted {len(leads_data)} total business leads!")
        print(f"📁 Saved to spreadsheet: {os.path.abspath(output_filename)}")
        print("=" * 65)
    else:
        print("\n⚠️ No leads were collected. Please check your internet connection or search queries.")


if __name__ == "__main__":
    scrape_google_maps(
        queries=SEARCH_QUERIES,
        max_results=MAX_RESULTS_PER_SEARCH,
        headless=HEADLESS
    )
