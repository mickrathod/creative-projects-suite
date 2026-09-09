import csv
import re
import sys
from pathlib import Path

# Ensure UTF-8 console output
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

CONTACTS_FILE = Path(__file__).parent / "ca_contacts.csv"

def clean_phone(phone: str, default_country: str = "91") -> str:
    """Cleans phone numbers into a standard international format (no +, no spaces)."""
    digits = re.sub(r"\D", "", str(phone))
    if not digits:
        return ""
    # Strip leading zeros
    digits = digits.lstrip("0")
    # If 10 digits, prepend default country code (India 91)
    if len(digits) == 10:
        digits = default_country + digits
    return digits

def add_single_contact(phone: str, name: str, firm: str = "", city: str = "", pitch_type: str = "PORTAL", notes: str = ""):
    cleaned = clean_phone(phone)
    if not cleaned:
        print("Invalid phone number!")
        return

    file_exists = CONTACTS_FILE.exists()
    with open(CONTACTS_FILE, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(["phone_number", "ca_name", "firm_name", "city", "pitch_type", "notes"])
        writer.writerow([cleaned, name.strip(), firm.strip(), city.strip(), pitch_type.strip(), notes.strip()])
    print(f"Added CA {name} (+{cleaned}) to ca_contacts.csv!")

def bulk_paste_contacts():
    print("\n--- BULK ADD CA CONTACTS ---")
    print("Format options:")
    print(" Option A: phone_number,ca_name,firm_name,pitch_type")
    print("   Example: 9812345678,Rajesh Sharma,Sharma & Associates,PORTAL")
    print(" Option B: Just paste phone numbers (one per line)")
    print("\n(Type 'DONE' or press Enter on an empty line when finished)\n")

    rows = []
    while True:
        try:
            line = input("> ").strip()
            if not line or line.upper() == "DONE":
                break
            parts = [p.strip() for p in line.split(",")]
            phone = clean_phone(parts[0])
            if not phone or len(phone) < 10:
                print(f"  [Skipped] Invalid phone format: {parts[0]}")
                continue

            name = parts[1] if len(parts) > 1 and parts[1] else "Sir/Madam"
            firm = parts[2] if len(parts) > 2 else ""
            pitch = parts[3] if len(parts) > 3 and parts[3] else "PORTAL"
            city = parts[4] if len(parts) > 4 else ""
            rows.append([phone, name, firm, city, pitch, "Bulk added"])
        except (EOFError, KeyboardInterrupt):
            break

    if rows:
        file_exists = CONTACTS_FILE.exists()
        with open(CONTACTS_FILE, "a", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            if not file_exists:
                writer.writerow(["phone_number", "ca_name", "firm_name", "city", "pitch_type", "notes"])
            writer.writerows(rows)
        print(f"\nSuccessfully added {len(rows)} CA contacts to {CONTACTS_FILE.name}!")
    else:
        print("No contacts added.")

def view_summary():
    if not CONTACTS_FILE.exists():
        print("ca_contacts.csv does not exist yet.")
        return
    with open(CONTACTS_FILE, "r", encoding="utf-8") as f:
        reader = list(csv.DictReader(f))
        print(f"\nTotal CA contacts in ca_contacts.csv: {len(reader)}")
        pitches = {}
        for r in reader:
            p = r.get("pitch_type", "PORTAL").upper()
            pitches[p] = pitches.get(p, 0) + 1
        for p_name, count in pitches.items():
            print(f"  • {p_name}: {count} contacts")

if __name__ == "__main__":
    print("=" * 60)
    print("       CA WHATSAPP CONTACTS MANAGER")
    print("=" * 60)
    print("1. Bulk paste CA phone numbers / leads")
    print("2. Add a single CA contact")
    print("3. View contact summary in ca_contacts.csv")
    print("4. Exit")

    choice = input("\nSelect an option [1-4]: ").strip()
    if choice == "1":
        bulk_paste_contacts()
    elif choice == "2":
        ph = input("Phone number: ")
        nm = input("CA Name: ")
        fm = input("Firm Name (optional): ")
        ct = input("City (optional): ")
        pt = input("Pitch Type (PORTAL / WEBSITE / FILING_TRACKER) [default: PORTAL]: ")
        add_single_contact(ph, nm, fm, ct, pt or "PORTAL")
    elif choice == "3":
        view_summary()
    else:
        print("Exiting.")
