# 🎯 GroupRadar AI — Community Intelligence & WhatsApp Business Card OCR Extractor

> **Multi-Modal WhatsApp Lead Discovery • Native Windows OCR Vision • Group Member Harvesting • Structured B2B Intelligence**

---

## 🔍 Vision & Product Overview

**GroupRadar AI** is a multi-modal lead discovery and contact extraction platform designed to turn closed professional WhatsApp groups, community channels, and shared media into structured, actionable B2B prospect databases.

In emerging business ecosystems, a vast amount of high-value B2B networking occurs inside invite-only WhatsApp groups (trade associations, Chartered Accountant networks, real estate mastermind groups, contractor forums). Valuable contact details are frequently shared not as plain text, but as photos of printed business cards, flyer attachments, and member rosters.

GroupRadar AI bridges this physical-to-digital divide. It pairs automated WhatsApp group participant extraction with local Windows Native Optical Character Recognition (OCR) to ingest, read, and normalize professional contact information into clean CSV lead databases.

---

## ⚡ Multi-Modal Extraction Engines

### 1. WhatsApp Group Participant Harvester
- **Automated Member Enumeration:** Connects securely to authorized WhatsApp Web groups and traverses member rosters, extracting phone numbers, public display names, and profile statuses.
- **Role Detection:** Identifies group administrators, moderators, and active contributors.

### 2. High-Accuracy Visiting Card OCR Vision
- **Automated Media Gallery Traversal:** Automatically navigates through group media archives (*Media, Links, and Docs*), downloading uploaded photos of printed business cards and digital flyers.
- **Native Windows OCR Engine:** Leverages hardware-accelerated Windows native OCR (`Windows.Media.Ocr`) to process images locally with high speed, zero API costs, and complete privacy.
- **Deep Entity Extraction:**
  - *Full Name & Professional Designation:* Identifies partner titles (e.g. *CA*, *Partner*, *FCA*, *Director*).
  - *Firm & Enterprise Names:* Extracts commercial entity names and corporate branding text.
  - *Indian & International Mobile Phone Numbers:* Parses numbers with country code normalization (e.g. `+91`).
  - *Geographic Location & City:* Detects commercial office locations and municipal regions.
  - *Corporate Email Addresses:* Validates email domains and patterns.

### 3. Local Batch Image Ingestion
- **Drop-Folder Processing:** Allows operators to ingest bulk directories of photographed business cards collected at trade expos, conferences, and seminars.
- **Image Pre-Processing Filters:** Automatically applies contrast enhancement, deskewing, and grayscale binarization to maximize OCR character recognition accuracy on crumpled or low-light business card photos.

### 4. Chat History & Bio Text Stream Parser
- **Unstructured Chat Parsing:** Scans plain text conversation logs and member introduction bios (`_chat.txt`) to extract phone numbers, website links, and service offerings.

### 5. Automated Data Cleansing & CRM Sync
- **Deduplication Matrix:** Discards duplicate entries based on unique phone numbers and email addresses.
- **Instant Outreach Pipeline Sync:** Formats and synchronizes clean prospect data directly into outbound messaging engines (such as *NexusWhatsApp CA*).

---

## 🏗️ Architectural Flow & Vision Pipeline

```
           [WhatsApp Community Group / Card Photos]
                              │
          ┌───────────────────┴───────────────────┐
          ▼                                       ▼
 [Group Member Traversal]            [Media Gallery & Photo Drop]
 - Scraping participant DOM          - Visiting card JPG / PNG files
 - Extracting phone & name           - Contrast enhancement & deskew
          │                                       │
          │                                       ▼
          │                          [Native Windows OCR Vision]
          │                          - Optical character recognition
          │                          - Multi-line text reconstruction
          │                                       │
          │                                       ▼
          │                          [Regex Entity Matcher]
          │                          ├── CA / Professional Name
          │                          ├── Firm / Company Name
          │                          ├── Normalized Phone Number
          │                          └── Email & City Location
          │                                       │
          └───────────────────┬───────────────────┘
                              ▼
                [Deduplication & Sanitizer]
                              │
                              ▼
            [Structured CSV Intelligence Vault]
```

---

## 💼 High-Value Industry Applications

- **Professional Service Lead Generation:** Rapidly harvesting contact rosters from state and regional CA associations, tax consultant groups, and Bar councils.
- **Trade Show & Conference Digitization:** Processing hundreds of physical visiting cards collected at industry expos into clean spreadsheet rows within seconds.
- **Sub-Contractor Sourcing:** Extracting active contractor numbers from regional builders' and trade professionals' groups.
