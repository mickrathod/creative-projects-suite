import re
import os
import sys
import csv
import asyncio
from pathlib import Path
from PIL import Image
import winocr

# Configure console for UTF-8 on Windows
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = Path(__file__).parent
DEFAULT_CARDS_DIR = BASE_DIR / "ca_card_photos"
CONTACTS_FILE = BASE_DIR / "ca_contacts.csv"

# Top Indian cities for Chartered Accountants
INDIAN_CITIES = [
    "Mumbai", "Delhi", "New Delhi", "Bengaluru", "Bangalore", "Kolkata", "Chennai", 
    "Hyderabad", "Ahmedabad", "Pune", "Surat", "Jaipur", "Lucknow", "Kanpur", 
    "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", 
    "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", 
    "Meerut", "Rajkot", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", 
    "Navi Mumbai", "Allahabad", "Prayagraj", "Ranchi", "Howrah", "Coimbatore", 
    "Jabalpur", "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", 
    "Guwahati", "Chandigarh", "Solapur", "Hubballi", "Bareilly", "Moradabad", 
    "Mysore", "Gurgaon", "Gurugram", "Noida", "Greater Noida", "Jalandhar", 
    "Tiruchirappalli", "Salem", "Dehradun", "Ajmer", "Udaipur", "Jammu", "Panipat",
    "Karnal", "Rohtak", "Hisar", "Ambala", "Bhiwadi", "Sonipat"
]

def clean_phone_number(raw: str) -> str:
    """Normalizes Indian phone numbers to 10-digit standard or +91 format."""
    digits = re.sub(r"\D", "", raw)
    if not digits:
        return ""
    digits = digits.lstrip("0")
    if len(digits) == 10 and digits[0] in "6789":
        return digits
    elif len(digits) == 12 and digits.startswith("91") and digits[2] in "6789":
        return digits[2:]
    return ""

def extract_phone_numbers(text: str) -> list:
    """Finds all valid Indian mobile numbers in raw or line text."""
    found = []
    
    # Common phone patterns on visiting cards
    patterns = [
        r"(?:\+?91[\s\-]?)?[6789]\d{4}[\s\-]?\d{5}",
        r"(?:\+?91[\s\-]?)?[6789]\d{2}[\s\-]?\d{3}[\s\-]?\d{4}",
        r"(?:\+?91[\s\-]?)?[6789]\d{9}",
        r"(?:Mob(?:ile)?|Ph(?:one)?|Tel|WhatsApp|Call|Contact|Cell|M)[\s\:\.\-]*(\+?91[\s\-]?[6789]\d{9}|\b[6789]\d{9}\b)"
    ]
    
    for pat in patterns:
        matches = re.finditer(pat, text, re.IGNORECASE)
        for m in matches:
            cleaned = clean_phone_number(m.group(0))
            if cleaned and cleaned not in found:
                found.append(cleaned)
                
    # Fallback: scan for any standalone 10-digit number starting with 6-9
    for chunk in re.findall(r"\b[6789]\d{9}\b", text):
        cleaned = clean_phone_number(chunk)
        if cleaned and cleaned not in found:
            found.append(cleaned)
            
    return found

def extract_ca_name(lines: list, full_text: str) -> str:
    """Extracts CA name with titles like CA, FCA, ACA, or near Chartered Accountant."""
    # Priority 1: Line with CA. Name or CA Name
    for line in lines:
        match = re.search(r"\b(?:CA|C\.A\.|FCA|ACA)\.?\s+([A-Za-z\s\.\']{3,35})", line, re.IGNORECASE)
        if match:
            raw_name = match.group(1).strip()
            # Clean qualification post-nominals
            clean = re.sub(r"\b(FCA|ACA|DISA|B\.?Com|M\.?Com|LLB|LL\.?B|Partner|Proprietor|Founder|Head)\b", "", raw_name, flags=re.IGNORECASE).strip()
            # Remove trailing dots or commas
            clean = re.sub(r"^[,\.\s]+|[,\.\s]+$", "", clean)
            if 3 <= len(clean) <= 30 and not re.search(r"(Associates|Company|Chartered|Accountants|Tax)", clean, re.IGNORECASE):
                return clean.title()

    # Priority 2: Line before or after 'Chartered Accountant'
    for i, line in enumerate(lines):
        if re.search(r"Chartered\s+Accountant", line, re.IGNORECASE):
            if i > 0:
                prev_line = lines[i-1].strip()
                if 3 <= len(prev_line) <= 35 and not re.search(r"(& Co|Associates|Firm|Office|Mob|Ph|Email)", prev_line, re.IGNORECASE):
                    clean = re.sub(r"^(Mr\.|Ms\.|Shri|CA\.?|Dr\.)\s*", "", prev_line, flags=re.IGNORECASE).strip()
                    if 3 <= len(clean) <= 30:
                        return clean.title()
            if i + 1 < len(lines):
                next_line = lines[i+1].strip()
                if 3 <= len(next_line) <= 35 and not re.search(r"(& Co|Associates|Firm|Office|Mob|Ph|Email|Tax)", next_line, re.IGNORECASE):
                    clean = re.sub(r"^(Mr\.|Ms\.|Shri|CA\.?|Dr\.)\s*", "", next_line, flags=re.IGNORECASE).strip()
                    if 3 <= len(clean) <= 30:
                        return clean.title()

    # Priority 3: First line if it looks like a person's name (2-3 words, no corporate keywords)
    for line in lines[:3]:
        clean = line.strip()
        if 4 <= len(clean) <= 30 and len(clean.split()) in (2, 3):
            if not re.search(r"(&\s*Co|Associates|Chartered|Accountants|Tax|GST|Audit|LLP|Advisors|Mob|Ph)", clean, re.IGNORECASE):
                return clean.title()

    return "Chartered Accountant"

def extract_firm_name(lines: list, full_text: str, ca_name: str) -> str:
    """Extracts CA firm name (e.g. Sharma & Associates, Mehta & Co., Singhania LLP)."""
    for line in lines:
        if re.search(r"(&\s*Co\.?|&\s*Associates|&\s*Company|LLP|Tax\s*Consultants?|Advisors)", line, re.IGNORECASE):
            firm = re.sub(r"^(M/s\.?|Firm:\s*|Name:\s*)", "", line, flags=re.IGNORECASE).strip()
            firm = re.sub(r"\b(Chartered\s+Accountants?)\b", "", firm, flags=re.IGNORECASE).strip()
            if 4 <= len(firm) <= 50:
                return firm.title()

    # Fallback based on CA name
    if ca_name and ca_name != "Chartered Accountant":
        return f"{ca_name} & Associates"

    return "CA & Associates"

def extract_city(full_text: str) -> str:
    """Identifies the city from the visiting card text."""
    for city in INDIAN_CITIES:
        if re.search(rf"\b{re.escape(city)}\b", full_text, re.IGNORECASE):
            return city
    return "India"

def extract_email(full_text: str) -> str:
    """Finds email address in text."""
    match = re.search(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", full_text)
    return match.group(0).lower() if match else ""

async def ocr_image_lines(image_path: Path) -> tuple:
    """Performs native Windows OCR on an image and returns (lines, full_text)."""
    try:
        with Image.open(image_path) as img:
            # Upscale if small for OCR precision
            if img.width < 900 or img.height < 500:
                scale = max(2, int(1400 / max(img.width, 1)))
                img = img.resize((img.width * scale, img.height * scale), Image.Resampling.LANCZOS)
            
            op = winocr.recognize_pil(img, lang="en")
            res = await op
            lines = [l.text.strip() for l in res.lines if l.text.strip()]
            return lines, res.text
    except Exception as e:
        print(f"  [!] OCR Error on {image_path.name}: {e}")
        return [], ""

async def parse_card_image(image_path: Path) -> list:
    """Parses a visiting card image and returns extracted contact dictionaries."""
    lines, full_text = await ocr_image_lines(image_path)
    if not lines and not full_text:
        return []

    combined_text = "\n".join(lines) + "\n" + full_text
    phones = extract_phone_numbers(combined_text)
    if not phones:
        return []

    ca_name = extract_ca_name(lines, full_text)
    firm_name = extract_firm_name(lines, full_text, ca_name)
    city = extract_city(combined_text)
    email = extract_email(combined_text)

    contacts = []
    for phone in phones:
        contacts.append({
            "phone_number": phone,
            "ca_name": ca_name,
            "firm_name": firm_name,
            "city": city,
            "email": email,
            "pitch_type": "PORTAL",
            "notes": f"Scanned from card: {image_path.name}"
        })

    return contacts

def get_existing_phone_numbers() -> set:
    """Loads all existing phone numbers from ca_contacts.csv to avoid duplicates."""
    existing = set()
    if not CONTACTS_FILE.exists():
        return existing
    try:
        with open(CONTACTS_FILE, "r", encoding="utf-8", errors="ignore") as f:
            reader = csv.DictReader(f)
            for r in reader:
                p = clean_phone_number(r.get("phone_number", ""))
                if p:
                    existing.add(p)
    except Exception:
        pass
    return existing

def append_contacts_to_csv(contacts: list) -> tuple:
    """
    Appends new contacts to ca_contacts.csv, skipping duplicates.
    Returns (added_count, skipped_count).
    """
    if not contacts:
        return 0, 0

    existing_phones = get_existing_phone_numbers()
    file_exists = CONTACTS_FILE.exists()

    added = 0
    skipped = 0

    with open(CONTACTS_FILE, "a", newline="", encoding="utf-8") as f:
        fieldnames = ["phone_number", "ca_name", "firm_name", "city", "pitch_type", "notes"]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        
        if not file_exists or os.path.getsize(CONTACTS_FILE) == 0:
            writer.writeheader()

        for c in contacts:
            phone = c["phone_number"]
            if phone in existing_phones:
                skipped += 1
                continue

            writer.writerow({
                "phone_number": phone,
                "ca_name": c.get("ca_name", "Chartered Accountant"),
                "firm_name": c.get("firm_name", "CA Office"),
                "city": c.get("city", "India"),
                "pitch_type": c.get("pitch_type", "PORTAL"),
                "notes": c.get("notes", "Extracted lead")
            })
            existing_phones.add(phone)
            added += 1

    return added, skipped

async def scan_cards_directory(directory_path: Path = DEFAULT_CARDS_DIR) -> list:
    """Scans all card images in a directory, extracts details and displays results."""
    directory_path = Path(directory_path)
    if not directory_path.exists():
        directory_path.mkdir(parents=True, exist_ok=True)
        return []

    valid_exts = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff"}
    image_files = [f for f in directory_path.iterdir() if f.is_file() and f.suffix.lower() in valid_exts]

    if not image_files:
        print(f"\nNo card images found in: {directory_path}")
        print("Tip: Drop JPG/PNG visiting cards or screenshots in that folder and run this again!")
        return []

    print("=" * 70)
    print(f"      SCANNING {len(image_files)} VISITING CARDS WITH NATIVE OCR")
    print("=" * 70)

    all_contacts = []
    seen = set()

    for idx, img_path in enumerate(image_files, 1):
        print(f"[{idx}/{len(image_files)}] OCR Scanning: {img_path.name}...")
        results = await parse_card_image(img_path)
        if not results:
            print(f"    - No phone number detected in {img_path.name}")
            continue

        for c in results:
            phone = c["phone_number"]
            if phone not in seen:
                seen.add(phone)
                all_contacts.append(c)
                email_str = f" | {c['email']}" if c.get('email') else ""
                print(f"    [+] [FOUND] CA {c['ca_name']} | {c['firm_name']} | +91 {phone} ({c['city']}){email_str}")

    return all_contacts

def extract_from_chat_text(text: str, source_name: str = "WhatsApp Chat") -> list:
    """Extracts phone numbers and CA bios from pasted text or exported chat files."""
    phones = extract_phone_numbers(text)
    contacts = []
    seen = set()
    lines = [l.strip() for l in text.splitlines() if l.strip()]

    for p in phones:
        if p in seen:
            continue
        seen.add(p)
        
        # Look for nearest name in lines containing this phone
        ca_name = "Chartered Accountant"
        for l in lines:
            if p in re.sub(r"\D", "", l):
                # Check for CA Name in same line or line before
                m = re.search(r"\b(?:CA|C\.A\.|FCA|ACA)\.?\s+([A-Za-z\s\.\']{3,30})", l, re.IGNORECASE)
                if m:
                    ca_name = m.group(1).strip().title()
                    break

        contacts.append({
            "phone_number": p,
            "ca_name": ca_name,
            "firm_name": "Chartered Accountants",
            "city": extract_city(text),
            "pitch_type": "PORTAL",
            "notes": f"Extracted from {source_name}"
        })

    return contacts

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Scan visiting card photos or chat files with native OCR")
    parser.add_argument("--dir", help="Directory of card images to scan", default=str(DEFAULT_CARDS_DIR))
    parser.add_argument("--chat-file", help="Path to exported WhatsApp _chat.txt file", default=None)
    args = parser.parse_args()

    if args.chat_file and Path(args.chat_file).exists():
        with open(args.chat_file, "r", encoding="utf-8", errors="ignore") as f:
            chat_text = f.read()
        extracted = extract_from_chat_text(chat_text, Path(args.chat_file).name)
        added, skipped = append_contacts_to_csv(extracted)
        print(f"Chat Scan Results: {added} new contacts added to ca_contacts.csv ({skipped} duplicates skipped)")
    else:
        run_card_scan(Path(args.dir), save_to_csv=True)
