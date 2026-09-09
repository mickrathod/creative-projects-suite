import csv
import os
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

LEADS_FILE = Path(__file__).parent / "leads.csv"
HISTORY_FILE = Path(__file__).parent / "sent_instagram_history.json"

def clean_handle(handle: str) -> str:
    """Removes @ and full instagram.com URLs, leaving just the username."""
    handle = handle.strip()
    handle = re.sub(r"^https?://(www\.)?instagram\.com/", "", handle)
    handle = handle.rstrip("/").lstrip("@")
    return handle.split("?")[0].strip()

def add_single_lead(handle: str, name: str, business: str, category: str, notes: str = ""):
    handle = clean_handle(handle)
    if not handle:
        print("Invalid handle!")
        return

    file_exists = LEADS_FILE.exists()
    with open(LEADS_FILE, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(["instagram_handle", "name", "business_name", "category", "notes"])
        writer.writerow([handle, name.strip(), business.strip(), category.strip(), notes.strip()])
    print(f"Added @{handle} to leads.csv!")

def bulk_paste_leads():
    print("\n--- BULK ADD LEADS ---")
    print("Enter leads in format: handle,name,business_name,category")
    print("Example: ca_rahul,Rahul,Rahul & Co CA,CA")
    print("Or just enter one instagram handle per line. (Type 'DONE' or press Enter on empty line to finish)\n")
    
    rows = []
    while True:
        try:
            line = input("> ").strip()
            if not line or line.upper() == "DONE":
                break
            parts = [p.strip() for p in line.split(",")]
            handle = clean_handle(parts[0])
            if not handle:
                continue
            name = parts[1] if len(parts) > 1 else ""
            biz = parts[2] if len(parts) > 2 else handle
            cat = parts[3] if len(parts) > 3 else "Company"
            rows.append([handle, name, biz, cat, ""])
        except (EOFError, KeyboardInterrupt):
            break

    if rows:
        file_exists = LEADS_FILE.exists()
        with open(LEADS_FILE, "a", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            if not file_exists:
                writer.writerow(["instagram_handle", "name", "business_name", "category", "notes"])
            writer.writerows(rows)
        print(f"\nSuccessfully added {len(rows)} leads to {LEADS_FILE.name}!")
    else:
        print("No leads added.")

def scan_google_maps_folder():
    """Scans parent directory for google maps leads CSV files."""
    parent_dir = Path(__file__).parent.parent / "lead-finder-bot"
    if not parent_dir.exists():
        print(f"Directory {parent_dir} not found.")
        return

    csv_files = list(parent_dir.glob("google_maps_leads_*.csv"))
    if not csv_files:
        print(f"No Google Maps lead CSVs found in {parent_dir}")
        return

    print(f"\nFound {len(csv_files)} Google Maps leads file(s):")
    for idx, f in enumerate(csv_files, 1):
        print(f" [{idx}] {f.name}")

    try:
        choice = input("\nSelect file number to inspect: ").strip()
        selected_file = csv_files[int(choice) - 1]
    except Exception:
        print("Invalid selection.")
        return

    print(f"\nReading {selected_file.name}...")
    imported_count = 0
    with open(selected_file, "r", encoding="utf-8", errors="ignore") as f:
        reader = csv.DictReader(f)
        with open(LEADS_FILE, "a", newline="", encoding="utf-8") as out:
            writer = csv.writer(out)
            for row in reader:
                name = row.get("Title") or row.get("name") or ""
                category = row.get("Category") or row.get("category") or "Company"
                website = row.get("Website") or row.get("website") or ""
                
                # Check if category contains CA, tax, accounting
                inferred_cat = "Company"
                if any(w in category.lower() for w in ["chartered accountant", "ca", "tax", "accounting", "auditor"]):
                    inferred_cat = "CA"
                elif any(w in category.lower() for w in ["clinic", "hospital", "dentist", "salon", "spa"]):
                    inferred_cat = "LocalService"

                # If there's an instagram link in website or social field:
                handle = ""
                if "instagram.com" in website.lower():
                    handle = clean_handle(website)
                
                if handle:
                    writer.writerow([handle, name, name, inferred_cat, f"Imported from {selected_file.name}"])
                    imported_count += 1

    print(f"Imported {imported_count} leads that had Instagram profiles!")

def show_summary():
    if not LEADS_FILE.exists():
        print("No leads.csv file found yet.")
        return
    with open(LEADS_FILE, "r", encoding="utf-8") as f:
        reader = list(csv.DictReader(f))
        print(f"\nTotal leads in leads.csv: {len(reader)}")
        categories = {}
        for r in reader:
            cat = r.get("category", "General")
            categories[cat] = categories.get(cat, 0) + 1
        for cat, count in categories.items():
            print(f"  • {cat}: {count} leads")

if __name__ == "__main__":
    print("=" * 55)
    print("     INSTAGRAM OUTREACH LEAD IMPORT & MANAGER")
    print("=" * 55)
    print("1. Bulk paste Instagram handles / leads")
    print("2. Import from lead-finder-bot Google Maps CSV")
    print("3. View lead summary in leads.csv")
    print("4. Exit")
    
    choice = input("\nSelect an option [1-4]: ").strip()
    if choice == "1":
        bulk_paste_leads()
    elif choice == "2":
        scan_google_maps_folder()
    elif choice == "3":
        show_summary()
    else:
        print("Exiting.")
