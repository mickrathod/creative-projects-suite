# 🚀 Remote Job Outreach Mailer (Python)

Automated, personalized cold email outreach system tailored for:
* **Shopify App & Theme Customization**
* **Laravel & React.js Full-Stack Engineering**
* **WordPress & WooCommerce Development**
* **Full-Stack E-Commerce**

---

## 📁 Project Structure

```text
remote-job-mailer/
├── .env                <- Your Gmail credentials & portfolio links (keep private)
├── contacts.csv        <- The leads list (name, company, email, category)
├── templates.py        <- Professional, targeted HTML email templates
├── send_emails.py      <- Main script (CLI with test, dry-run, and live modes)
├── resume.pdf          <- (Optional) Put your PDF resume here to auto-attach
└── outreach_log.csv    <- Automatically created log to prevent duplicate emails
```

---

## ⚡ Quick Start Guide

### 1. Configure `.env`
Open `.env` and fill in:
* `EMAIL_USER`: Your Gmail address
* `EMAIL_APP_PASSWORD`: Your 16-character Google App Password ([Get it here](https://myaccount.google.com/apppasswords))
* `MY_NAME`, `MY_PHONE`, `MY_PORTFOLIO`, `MY_LINKEDIN`

### 2. Preview Contacts & Templates (Dry Run)
Before sending any email, run:
```bash
python send_emails.py --dry-run
```
This shows you all contacts, which email template will be applied, and checks if your resume is detected.

### 3. Send a Test Email to Yourself
Test your connection and inspect how the email and formatting look in your real Gmail inbox:
```bash
python send_emails.py --test
```

### 4. Run the Live Campaign
Once you add your target contacts to `contacts.csv`:
```bash
python send_emails.py --run
```

---

## 🎯 Categories in `contacts.csv`

You can assign any of the following values to the `category` column in `contacts.csv`:

| Category | Targeted Skills Highlighted |
| :--- | :--- |
| `shopify` | Custom Shopify Apps (GraphQL / Remix), Liquid custom sections, Storefront API |
| `laravel_react` | Laravel APIs, React.js SPAs, Inertia.js, Database architecture, SaaS |
| `wordpress` | Custom WordPress plugins, Gutenberg React blocks, WooCommerce, theme customization |
| `fullstack` | Comprehensive showcase of all 4 technologies for digital agencies |

---

## 🛡️ Anti-Spam Safety Features Built-in
1. **Duplicate Prevention**: Every sent email is recorded in `outreach_log.csv`. The script will never email the same person twice.
2. **Random Delays**: Waits 5 to 9 seconds between emails to simulate human pacing and avoid Gmail's automated spam filters.
3. **SSL Authentication**: Connects over secure port 465 with modern TLS/SSL encryption.
