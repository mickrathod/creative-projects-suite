import os
import re
from datetime import datetime
from typing import Dict, Optional, Any
from pypdf import PdfReader

# Known common vendors/brands for high-confidence matching
KNOWN_VENDORS = [
    # Tech & Software
    "Google", "Amazon", "Apple", "Microsoft", "Adobe", "Stripe", "PayPal", "Shopify",
    "Slack", "Zoom", "GitHub", "DigitalOcean", "Cloudflare", "Atlassian", "Canva",
    "OpenAI", "Notion", "Dropbox", "Intuit", "QuickBooks", "Xero",
    # Retail & Home
    "Home Depot", "Lowe's", "Walmart", "Target", "Costco", "Best Buy", "IKEA",
    "Office Depot", "Staples", "Walgreens", "CVS",
    # Travel & Transport
    "Uber", "Lyft", "Airbnb", "Delta", "United Airlines", "American Airlines",
    # Logistics
    "FedEx", "UPS", "DHL", "USPS",
    # Telecom & Utilities
    "AT&T", "Verizon", "T-Mobile", "Comcast", "Xfinity", "Spectrum",
    # Financial Institutions
    "Chase", "Bank of America", "Wells Fargo", "Citibank", "Capital One", "American Express"
]

MONTH_MAP = {
    "jan": 1, "january": 1,
    "feb": 2, "february": 2,
    "mar": 3, "march": 3,
    "apr": 4, "april": 4,
    "may": 5,
    "jun": 6, "june": 6,
    "jul": 7, "july": 7,
    "aug": 8, "august": 8,
    "sep": 9, "sept": 9, "september": 9,
    "oct": 10, "october": 10,
    "nov": 11, "november": 11,
    "dec": 12, "december": 12
}


class PDFParser:
    """Extracts metadata and classifies PDF documents completely offline."""

    @staticmethod
    def extract_text_from_pdf(file_path: str, max_pages: int = 2) -> str:
        """Extract text from the first N pages of a PDF."""
        text = ""
        try:
            reader = PdfReader(file_path)
            if reader.is_encrypted:
                try:
                    reader.decrypt("")
                except Exception:
                    return ""
            pages_to_read = min(len(reader.pages), max_pages)
            for i in range(pages_to_read):
                page_text = reader.pages[i].extract_text()
                if page_text:
                    text += " " + page_text
        except Exception as e:
            # If reading fails or corrupt, return empty text
            return ""
        return text.strip()

    @classmethod
    def detect_document_type(cls, text: str, filename: str = "") -> str:
        """Determines the document type using keyword scoring."""
        text_lower = (text + " " + filename).lower()

        scores = {
            "Invoice": 0,
            "Receipt": 0,
            "Statement": 0,
            "Tax_Document": 0,
            "Contract": 0,
            "Estimate": 0,
            "Resume": 0,
        }

        # Weighted signals
        if re.search(r"\b(tax\s+invoice|invoice\s*#|bill\s+to|amount\s+due|due\s+date)\b", text_lower):
            scores["Invoice"] += 5
        if re.search(r"\binvoice\b", text_lower):
            scores["Invoice"] += 3

        if re.search(r"\b(sales\s+receipt|payment\s+received|transaction\s+receipt|order\s+confirmation|total\s+paid)\b", text_lower):
            scores["Receipt"] += 5
        if re.search(r"\breceipt\b", text_lower):
            scores["Receipt"] += 3

        if re.search(r"\b(account\s+statement|bank\s+statement|billing\s+statement|closing\s+balance|opening\s+balance)\b", text_lower):
            scores["Statement"] += 5
        if re.search(r"\bstatement\b", text_lower):
            scores["Statement"] += 2

        if re.search(r"\b(form\s+w-?2|form\s+1099|tax\s+return|form\s+1040|internal\s+revenue|gst\s+return|vat\s+return)\b", text_lower):
            scores["Tax_Document"] += 6

        if re.search(r"\b(non-disclosure|agreement|terms\s+and\s+conditions|service\s+agreement|contract\s+agreement)\b", text_lower):
            scores["Contract"] += 5

        if re.search(r"\b(estimate|quotation|quote\s*#|proforma\s+invoice|proposal)\b", text_lower):
            scores["Estimate"] += 5

        if re.search(r"\b(curriculum\s+vitae|education\s+experience|work\s+experience|skills\s+experience)\b", text_lower):
            scores["Resume"] += 5

        best_type, best_score = max(scores.items(), key=lambda item: item[1])
        return best_type if best_score > 0 else "Document"

    @classmethod
    def detect_vendor(cls, text: str, filename: str = "") -> str:
        """Detects the company, vendor or sender name."""
        combined = filename + "\n" + text

        # 1. Match known high-confidence vendors
        for vendor in KNOWN_VENDORS:
            pattern = rf"\b{re.escape(vendor)}\b"
            if re.search(pattern, combined, re.IGNORECASE):
                # Clean up name for file naming (e.g. "Home Depot" -> "HomeDepot")
                return re.sub(r"[^\w]", "", vendor)

        # 2. Look for explicit "From:", "Vendor:", "Merchant:", "Billed By:"
        match = re.search(r"(?:from|vendor|merchant|seller|billed\s+by|company)\s*[:\-]\s*([A-Za-z0-9\s&,.\-]{2,35})", text, re.IGNORECASE)
        if match:
            candidate = match.group(1).split("\n")[0].strip()
            # Clean common trailing punctuation
            candidate = re.sub(r"[,.\-]$", "", candidate).strip()
            if candidate and len(candidate) > 2 and not candidate.lower().startswith("http"):
                clean = re.sub(r"[^\w]", "", candidate.title())
                if clean:
                    return clean[:25]

        # 3. Look for standard corporate suffixes in first few lines (LLC, Inc, Corp, Services, etc.)
        lines = [line.strip() for line in text.split("\n") if line.strip()][:10]
        for line in lines:
            suffix_match = re.search(
                r"\b([A-Z][A-Za-z0-9\s&]{2,30}\s+(?:Inc\.?|LLC|Ltd\.?|Corp\.?|Corporation|Co\.?|Services|Solutions|Group|Agency|Roofing|Construction))\b",
                line
            )
            if suffix_match:
                candidate = suffix_match.group(1).strip()
                clean = re.sub(r"[^\w]", "", candidate.title())
                if clean:
                    return clean[:25]

        return "UnknownVendor"

    @classmethod
    def detect_date(cls, text: str, file_path: str = "") -> str:
        """Extracts date from text, or falls back to file modification date (YYYY-MM-DD)."""
        # Format 1: YYYY-MM-DD or YYYY/MM/DD
        match_iso = re.search(r"\b(20\d{2})[-/.](0[1-9]|1[0-2])[-/.](0[1-9]|[12]\d|3[01])\b", text)
        if match_iso:
            return f"{match_iso.group(1)}-{match_iso.group(2)}-{match_iso.group(3)}"

        # Format 2: Word Month, e.g. "January 15, 2026" or "15 Jan 2026"
        month_names = "|".join(MONTH_MAP.keys())
        match_named = re.search(rf"\b({month_names})\s+([0-2]?[0-9]|3[01]),?\s+(20\d{{2}})\b", text, re.IGNORECASE)
        if match_named:
            m_str, d_str, y_str = match_named.group(1).lower(), match_named.group(2), match_named.group(3)
            m_num = MONTH_MAP.get(m_str, 1)
            return f"{y_str}-{m_num:02d}-{int(d_str):02d}"

        match_named_rev = re.search(rf"\b([0-2]?[0-9]|3[01])\s+({month_names}),?\s+(20\d{{2}})\b", text, re.IGNORECASE)
        if match_named_rev:
            d_str, m_str, y_str = match_named_rev.group(1), match_named_rev.group(2).lower(), match_named_rev.group(3)
            m_num = MONTH_MAP.get(m_str, 1)
            return f"{y_str}-{m_num:02d}-{int(d_str):02d}"

        # Format 3: MM/DD/YYYY or DD/MM/YYYY
        match_slash = re.search(r"\b(0?[1-9]|1[0-2])/(0?[1-9]|[12]\d|3[01])/(20\d{2})\b", text)
        if match_slash:
            return f"{match_slash.group(3)}-{int(match_slash.group(1)):02d}-{int(match_slash.group(2)):02d}"

        # Fallback: File modification date
        if file_path and os.path.exists(file_path):
            mtime = os.path.getmtime(file_path)
            return datetime.fromtimestamp(mtime).strftime("%Y-%m-%d")

        return datetime.now().strftime("%Y-%m-%d")

    @classmethod
    def detect_reference_number(cls, text: str) -> str:
        """Finds invoice number, order number, estimate number, or account number."""
        # Pattern 1: Explicit separator or 'Number / No / #' e.g., "Invoice Number: HD-90821", "Estimate #: EST-5520", "Order #12345"
        match = re.search(
            r"\b(?:invoice|inv|order|receipt|bill|account|ref|reference|estimate|quote|est)\s*(?:no\.?|number|#)?\s*[:#\-]\s*([A-Za-z0-9\-_]{3,25})\b",
            text,
            re.IGNORECASE
        )
        if match:
            candidate = match.group(1).strip()
            # Verify it contains at least one digit or hyphen
            if any(char.isdigit() for char in candidate) or "-" in candidate:
                return candidate

        # Pattern 2: Followed directly by alphanumeric identifier with digits, e.g. "Invoice INV-9821" or "Order 88319"
        match2 = re.search(
            r"\b(?:invoice|inv|order|receipt|bill|account|ref|reference|estimate|quote|est)\s+([A-Za-z0-9\-_]*\d+[A-Za-z0-9\-_]*)\b",
            text,
            re.IGNORECASE
        )
        if match2:
            candidate = match2.group(1).strip()
            # Ignore standard 4-digit years like 2025, 2026 if standalone
            if not (len(candidate) == 4 and candidate.startswith("20")):
                return candidate

        return ""

    @classmethod
    def detect_amount(cls, text: str) -> str:
        """Finds total transaction amount."""
        match = re.search(r"(?:total|amount\s+due|grand\s+total|balance\s+due|total\s+paid)\s*[:\-]?\s*([$€£₹]\s*[0-9,]+(?:\.\d{2})?)", text, re.IGNORECASE)
        if match:
            return re.sub(r"\s+", "", match.group(1))

        # Secondary match: general currency symbol
        curr_match = re.search(r"([$€£₹]\s*[0-9,]+\.\d{2})\b", text)
        if curr_match:
            return re.sub(r"\s+", "", curr_match.group(1))

        return ""

    @classmethod
    def parse(cls, file_path: str) -> Dict[str, Any]:
        """Complete pipeline to extract metadata and propose clean filename."""
        filename = os.path.basename(file_path)
        text = cls.extract_text_from_pdf(file_path)

        doc_type = cls.detect_document_type(text, filename)
        vendor = cls.detect_vendor(text, filename)
        date_str = cls.detect_date(text, file_path)
        ref_no = cls.detect_reference_number(text)
        amount = cls.detect_amount(text)

        # Build clean standardized filename
        # Pattern: YYYY-MM-DD_Vendor_DocType[_RefNo].pdf
        name_parts = [date_str]
        if vendor and vendor != "UnknownVendor":
            name_parts.append(vendor)
        name_parts.append(doc_type)
        if ref_no:
            name_parts.append(ref_no)

        clean_base = "_".join(name_parts)
        # Sanitize for windows filesystem
        clean_base = re.sub(r'[\\/*?:"<>|]', "", clean_base)
        clean_filename = f"{clean_base}.pdf"

        return {
            "file_path": file_path,
            "original_filename": filename,
            "doc_type": doc_type,
            "vendor": vendor,
            "date": date_str,
            "ref_number": ref_no,
            "amount": amount,
            "proposed_filename": clean_filename,
            "text_snippet": (text[:200] + "...") if len(text) > 200 else text
        }
