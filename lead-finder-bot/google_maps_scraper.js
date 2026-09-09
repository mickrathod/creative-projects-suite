/**
 * Google Maps Lead Finder Bot using Playwright (Node.js)
 * ====================================================
 * Scrapes local business leads from Google Maps.
 * Extracts: Name, Phone, Rating, Reviews Count, Website, Category, Address, and Maps URL.
 * Automatically saves all results into a CSV file.
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

// ==========================================
// CONFIGURATION: Customize Your Searches
// ==========================================
const SEARCH_QUERIES = [
  'house cleaning in Austin TX',
  'roofing contractors in Denver CO',
  'dental clinic in Miami FL'
];

const MAX_RESULTS_PER_SEARCH = 20;
const HEADLESS = false; // Set to true to run in background

async function runScraper() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outputFilename = `google_maps_leads_${timestamp}.csv`;
  const allLeads = [];

  console.log('='.repeat(65));
  console.log('🚀 GOOGLE MAPS LEAD FINDER (PLAYWRIGHT)');
  console.log(`📁 Target Output File: ${outputFilename}`);
  console.log(`🔍 Total Search Queries: ${SEARCH_QUERIES.length}`);
  console.log('='.repeat(65));

  const browser = await chromium.launch({ headless: HEADLESS });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  for (let qIdx = 0; qIdx < SEARCH_QUERIES.length; qIdx++) {
    const query = SEARCH_QUERIES[qIdx];
    console.log(`\n[${qIdx + 1}/${SEARCH_QUERIES.length}] 🔎 Searching Google Maps for: "${query}"...`);

    const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    
    try {
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(3000);

      // Handle cookie consent popup if present
      try {
        const consent = page.locator('button:has-text("Accept all"), button:has-text("I agree"), button:has-text("Accept")');
        if (await consent.count() > 0 && await consent.first().isVisible()) {
          await consent.first().click();
          await page.waitForTimeout(1000);
        }
      } catch (e) {}

      // Scroll to load listings
      console.log('⏳ Scrolling listings pane...');
      for (let i = 0; i < 10; i++) {
        await page.mouse.wheel(0, 3000);
        await page.waitForTimeout(1200);
        const count = await page.locator('div[role="feed"] > div > div > a[href*="/maps/place/"]').count();
        if (count >= MAX_RESULTS_PER_SEARCH) break;
      }

      const listings = page.locator('div[role="feed"] > div > div > a[href*="/maps/place/"]');
      const totalFound = await listings.count();
      console.log(`📊 Found ${totalFound} listings. Extracting top ${Math.min(totalFound, MAX_RESULTS_PER_SEARCH)}...`);

      let collected = 0;
      for (let i = 0; i < totalFound && collected < MAX_RESULTS_PER_SEARCH; i++) {
        try {
          const item = listings.nth(i);
          await item.scrollIntoViewIfNeeded();
          await item.click();
          await page.waitForTimeout(1500);

          // Name
          let name = 'N/A';
          try {
            const nameEl = page.locator('h1.DUwDvf, h1').first();
            if (await nameEl.isVisible()) {
              name = (await nameEl.innerText()).trim();
            }
          } catch (e) {}

          if (!name || name === 'N/A') {
            name = (await item.getAttribute('aria-label')) || 'Unknown Business';
          }

          // Rating & Reviews
          let rating = 'N/A';
          let reviewsCount = '0';
          try {
            const ratingEl = page.locator('div.F7nice span[aria-hidden="true"]').first();
            if (await ratingEl.isVisible()) {
              rating = (await ratingEl.innerText()).trim();
            }
            const reviewsEl = page.locator('div.F7nice span[aria-label*="reviews"], div.F7nice span[aria-label*="review"]').first();
            if (await reviewsEl.isVisible()) {
              const rawReviews = (await reviewsEl.getAttribute('aria-label')) || '';
              const match = rawReviews.match(/([\d,]+)/);
              if (match) reviewsCount = match[1].replace(/,/g, '');
            }
          } catch (e) {}

          // Category
          let category = 'N/A';
          try {
            const catEl = page.locator('button.DkEaL').first();
            if (await catEl.isVisible()) {
              category = (await catEl.innerText()).trim();
            }
          } catch (e) {}

          // Phone
          let phone = 'N/A';
          try {
            const phoneEl = page.locator('button[data-item-id*="phone:tel:"], button[aria-label*="Phone:"]').first();
            if (await phoneEl.isVisible()) {
              const rawPhone = (await phoneEl.getAttribute('aria-label')) || (await phoneEl.innerText());
              phone = rawPhone.replace(/Phone:|Copy phone number/g, '').trim();
            }
          } catch (e) {}

          // Website
          let website = 'N/A';
          try {
            const webEl = page.locator('a[data-item-id="authority"], a[aria-label*="Website:"]').first();
            if (await webEl.isVisible()) {
              website = (await webEl.getAttribute('href')) || 'N/A';
            }
          } catch (e) {}

          // Address
          let address = 'N/A';
          try {
            const addrEl = page.locator('button[data-item-id="address"], button[aria-label*="Address:"]').first();
            if (await addrEl.isVisible()) {
              const rawAddr = (await addrEl.getAttribute('aria-label')) || (await addrEl.innerText());
              address = rawAddr.replace('Address:', '').trim();
            }
          } catch (e) {}

          const placeUrl = page.url();

          const lead = {
            query,
            name,
            rating,
            reviewsCount,
            category,
            phone,
            website,
            address,
            placeUrl
          };

          allLeads.push(lead);
          collected++;

          console.log(`  ✓ [${collected}/${MAX_RESULTS_PER_SEARCH}] ${name} | 📞 ${phone} | ⭐ ${rating} (${reviewsCount} reviews) | 🌐 ${website !== 'N/A' ? website.slice(0, 30) : 'No website'}`);
        } catch (itemErr) {
          continue;
        }
      }
    } catch (qErr) {
      console.error(`❌ Error scraping "${query}":`, qErr.message);
    }
  }

  await browser.close();

  // Save CSV
  if (allLeads.length > 0) {
    const headers = ['Search Query', 'Business Name', 'Rating', 'Review Count', 'Category', 'Phone Number', 'Website', 'Address', 'Google Maps URL'];
    const rows = allLeads.map(l => [
      `"${l.query.replace(/"/g, '""')}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      l.rating,
      l.reviewsCount,
      `"${l.category.replace(/"/g, '""')}"`,
      `"${l.phone.replace(/"/g, '""')}"`,
      `"${l.website.replace(/"/g, '""')}"`,
      `"${l.address.replace(/"/g, '""')}"`,
      `"${l.placeUrl.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    fs.writeFileSync(outputFilename, '\uFEFF' + csvContent, 'utf-8');

    console.log('\n' + '='.repeat(65));
    console.log(`🎉 SUCCESS: Extracted ${allLeads.length} local business leads!`);
    console.log(`📁 CSV Spreadsheet saved: ${path.resolve(outputFilename)}`);
    console.log('='.repeat(65));
  } else {
    console.log('\n⚠️ No leads extracted.');
  }
}

runScraper();
