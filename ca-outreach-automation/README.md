# 🚀 CA Outreach & Message Automation Suite

This lightweight suite contains your complete list of **121 CA and enterprise leads**, pre-loaded with custom B2B cold outreach messages, phone numbers, priorities, and firm details.

---

## 📁 Clean File Structure (Only Essential Files)

```
ca-outreach-automation/
├── leads.csv                 # Master database with 121 leads & tailored messages
├── dashboard.html            # 100% Self-contained 1-Click WhatsApp Command Center
├── send_whatsapp.py          # Automated WhatsApp Bot using Playwright Chrome
├── outreach_log.csv          # Audit log tracking sent leads (prevents duplicate sends)
└── README.md                 # Usage guide
```

---

## ⚡ Option 1: 1-Click WhatsApp Command Center (`dashboard.html`)
*(Recommended: 100% account safety, zero bot detection risk, completely self-contained)*

1. Double-click [`dashboard.html`](file:///c:/Users/manav/.gemini/antigravity-ide/scratch/ca-outreach-automation/dashboard.html) to open in Chrome or Edge.
2. **Features:**
   - **Search & Priority Filters:** Instant filter for High Priority leads, cities, or firm names.
   - **1-Click WhatsApp:** Click **"💬 WhatsApp"** to open WhatsApp Web or Desktop with the personalized message pre-filled.
   - **Copy Button:** Click **"📋 Copy"** to copy the exact tailored pitch.
   - **Status Tracking:** Mark leads as `Sent`, `Interested`, or `Follow-Up` (saved automatically in browser storage).
   - **Export CSV:** Download your updated outreach progress anytime.

---

## 🤖 Option 2: Automated WhatsApp Bot (`send_whatsapp.py`)
*(Automates sending messages using Chrome & Playwright)*

### 1. Test in Dry-Run Mode (Safe Preview):
```powershell
python send_whatsapp.py --dry-run --limit 5
```

### 2. Live Send to Top Leads (e.g. 10 High Priority leads):
```powershell
python send_whatsapp.py --priority High --limit 10
```

- **First Run:** A Chrome window opens to `web.whatsapp.com`. Scan the QR code once with your phone. Your login session is saved in `./whatsapp_session`, so you **never have to scan it again**.
- **Safe Human Delays:** The bot waits 15–28 seconds randomly between messages to protect your account.
- **Duplicate Protection:** Automatically logs sent messages in `outreach_log.csv` and skips them on future runs.
