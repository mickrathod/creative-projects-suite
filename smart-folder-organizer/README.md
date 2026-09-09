# 📁 ArchivalIQ — Privacy-First Content-Aware Document & Financial Archive Engine

> **100% Offline • Zero API Keys • Deep Content-Aware PDF Parsing • Enterprise Data Privacy • Atomic Rollback Safety**

---

## 🔒 Vision & Product Overview

**ArchivalIQ** is an autonomous desktop document intelligence and file organization system built specifically for privacy-sensitive professions (accountants, bookkeepers, tax attorneys, medical practitioners, general contractors, and financial advisors).

Modern professionals accumulate hundreds of randomly named digital receipts, vendor invoices, bank statements, tax forms, and signed agreements each month (e.g. `scan_00481_final(2).pdf`, `download.pdf`, `Invoice-2026.pdf`). Organizing these documents manually wastes hours each week, while uploading them to cloud-based AI tools (like OpenAI or public document parsers) exposes sensitive client financial data to severe data privacy violations.

ArchivalIQ eliminates this problem entirely. It operates **100% locally and offline** with zero API keys and zero network transmissions. By inspecting the internal content of documents using deep text analysis and regex pattern matching, ArchivalIQ extracts vendor names, document classifications, transaction dates, reference IDs, and financial totals—automatically standardizing filenames and organizing files into structured directory archives.

---

## ⚡ Core Engine & Key Highlights

### 1. Zero Cloud Dependency & Enterprise Data Privacy
- **100% Local Execution:** No data leaves the user’s local workstation. No external HTTP requests, no third-party cloud models, and no recurring API costs.
- **Compliance-Ready:** Complies with strict privacy standards (HIPAA, GDPR, CCPA, and Bar Association client confidentiality rules).

### 2. Deep Content-Aware PDF Parsing Engine
- **Internal Text Extraction:** Uses low-level PDF stream parsing to inspect the full internal text layer of scanned and digital documents.
- **Intelligent Entity Recognition:**
  - *Vendor & Company Detection:* Identifies known vendors (e.g., Home Depot, Amazon, Lowe's, Adobe, Google, Microsoft, utility providers) and discovers unknown vendors using entity positioning heuristic algorithms.
  - *Document Type Categorization:* Automatically classifies documents into *Invoices*, *Receipts*, *Bank Statements*, *Tax Documents (W2/1099)*, *Contracts & Legal Agreements*, or *Estimates/Quotes*.
  - *Date Normalization:* Detects varied date formats (`MM/DD/YYYY`, `DD-MM-YYYY`, `Month DD, YYYY`, `YYYY-MM-DD`) and normalizes them into ISO 8601 standardized format (`YYYY-MM-DD`).
  - *Invoice & Reference Numbers:* Extracts purchase order numbers, invoice IDs, and check numbers.
  - *Financial Totals:* Parses currency amounts, balances due, and net totals.

### 3. Standardized Semantic Renaming Syntax
- Automatically transforms chaotic names like `INV_009941_2.pdf` into a deterministic, human-readable format:
  ```
  YYYY-MM-DD_[Vendor]_[DocType]_[ReferenceNumber].pdf
  Example: 2026-03-01_HomeDepot_Invoice_HD-90821.pdf
  ```

### 4. Flexible Multi-Strategy Filing Taxonomies
- **By Category:** Sorts into structured folders (`Invoices/`, `Receipts/`, `Bank_Statements/`, `Contracts/`, `Spreadsheets/`).
- **By Date Hierarchy:** Categorizes into chronological archives (`2026/03 - March/`).
- **By Vendor / Client:** Consolidates all documents for a single company into one place (`Vendors/HomeDepot/`, `Vendors/Amazon/`).
- **In-Place Renaming:** Renames files cleanly within their existing folder without moving them.

### 5. Client Trust & Atomic Rollback Engine
- **Dry-Run Preview Table:** Displays a complete before-and-after mapping showing current path, detected vendor, detected type, and proposed new path before touching a single file.
- **1-Click Batch Rollback (Undo):** Logs every operation to an atomic state journal. Users can undo an entire reorganization batch with a single click, restoring all files to their original names and locations.
- **Zero-Collision Guarantee:** Never overwrites existing files; intelligently appends sequential suffixes (`_1`, `_2`) if identical filenames are encountered.

### 6. Background Watchdog Monitoring
- **Live Folder Guard:** Monitors designated hot folders (such as `Downloads` or `Scans Inbox`) in the background. The moment an invoice or receipt finishes downloading, it is parsed, renamed, and moved into its destination archive instantly.

---

## 🏗️ Architectural Flow & Processing Pipeline

```
     [Target Folder: Downloads / Invoices / Desktop]
                           │
                           ▼
             [Document Discovery & Filtering]
              - PDF, DOCX, XLSX, Images, CSV
                           │
                           ▼
             [pypdf Internal Text Extractor]
                           │
                           ▼
          [Regex & Heuristic Analysis Engine]
          ├── Vendor Matcher (50+ Rules & Heuristics)
          ├── Document Classifier (Tax / Invoice / Statement)
          ├── Date Normalizer (ISO 8601)
          └── Reference & Currency Number Parser
                           │
                           ▼
                [Dry-Run Preview Matrix]
               (User Inspects & Approves)
                           │
                           ▼
              [Atomic File Dispatcher]
          ├── Collision Detection & Disambiguation
          ├── Directory Auto-Creation
          └── State Journal Transaction Logging
                           │
                           ▼
        [Organized Vault & 1-Click Rollback Journal]
```

---

## 💼 Industry Solutions & High-Ticket Use Cases

- **Bookkeepers & Small CPA Practices:** Transforming hundreds of client tax documents and shoebox receipts into spotless digital folders ready for tax preparation.
- **General Contractors & Builders:** Automatically separating Home Depot, lumber yard, and subcontractor invoices into project-specific folders for accurate job costing.
- **Law Firms & Solo Attorneys:** Organizing client agreements, retainers, case filings, and depositions without risking client privilege on public AI platforms.
- **Digital Agencies & Freelancers:** Consolidating monthly software subscription receipts (AWS, Google Workspace, Adobe, Figma) for painless tax deductions.
