import os
import shutil
import json
from datetime import datetime
from typing import List, Dict, Any, Optional
from .pdf_parser import PDFParser

HISTORY_FILE = "organizer_history.json"

FILE_TYPE_CATEGORIES = {
    "Spreadsheets": [".xlsx", ".xls", ".csv", ".tsv"],
    "Images": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".bmp", ".ico"],
    "Documents": [".docx", ".doc", ".txt", ".rtf", ".odt"],
    "Presentations": [".pptx", ".ppt", ".key"],
    "Archives": [".zip", ".rar", ".7z", ".tar", ".gz"],
    "Media": [".mp4", ".mov", ".avi", ".mkv", ".mp3", ".wav", ".m4a"],
    "Code_Data": [".py", ".js", ".json", ".xml", ".html", ".css", ".sql"]
}


class FolderOrganizer:
    """Manages the scanning, categorization, renaming, moving, and undoing of files."""

    def __init__(self, source_dir: str, target_dir: Optional[str] = None, strategy: str = "by_category"):
        self.source_dir = os.path.abspath(source_dir)
        self.target_dir = os.path.abspath(target_dir if target_dir else source_dir)
        self.strategy = strategy  # 'by_category', 'by_date', 'by_vendor', 'flat_renamed'
        self.history_path = os.path.join(self.target_dir, HISTORY_FILE)

    def scan_files(self) -> List[Dict[str, Any]]:
        """Scans source folder and generates planned rename & move operations."""
        if not os.path.exists(self.source_dir):
            raise FileNotFoundError(f"Source directory '{self.source_dir}' does not exist.")

        plan: List[Dict[str, Any]] = []

        # Iterate only top-level files in source directory
        for item in os.listdir(self.source_dir):
            item_path = os.path.join(self.source_dir, item)
            # Skip subdirectories, hidden files, or the history file
            if os.path.isdir(item_path) or item.startswith(".") or item == HISTORY_FILE:
                continue

            name, ext = os.path.splitext(item)
            ext_lower = ext.lower()

            if ext_lower == ".pdf":
                # PDF Smart Parsing
                metadata = PDFParser.parse(item_path)
                doc_type = metadata["doc_type"]
                vendor = metadata["vendor"]
                date_str = metadata["date"]
                ref_number = metadata["ref_number"]
                amount = metadata["amount"]
                proposed_name = metadata["proposed_filename"]

                dest_subdir = self._determine_destination_subdir(
                    is_pdf=True,
                    doc_type=doc_type,
                    vendor=vendor,
                    date_str=date_str
                )

                plan.append({
                    "original_path": item_path,
                    "original_filename": item,
                    "extension": ext_lower,
                    "is_pdf": True,
                    "doc_type": doc_type,
                    "vendor": vendor,
                    "date": date_str,
                    "ref_number": ref_number,
                    "amount": amount,
                    "proposed_filename": proposed_name,
                    "destination_subdir": dest_subdir,
                    "target_dir": os.path.join(self.target_dir, dest_subdir) if dest_subdir else self.target_dir
                })
            else:
                # Non-PDF Categorization
                category = self._categorize_non_pdf(ext_lower)
                dest_subdir = category if self.strategy != "flat_renamed" else ""

                # Keep original name for non-PDFs or prepend date if available
                plan.append({
                    "original_path": item_path,
                    "original_filename": item,
                    "extension": ext_lower,
                    "is_pdf": False,
                    "doc_type": category,
                    "vendor": "N/A",
                    "date": datetime.fromtimestamp(os.path.getmtime(item_path)).strftime("%Y-%m-%d"),
                    "ref_number": "",
                    "amount": "",
                    "proposed_filename": item,  # Retain original name
                    "destination_subdir": dest_subdir,
                    "target_dir": os.path.join(self.target_dir, dest_subdir) if dest_subdir else self.target_dir
                })

        return plan

    def _determine_destination_subdir(self, is_pdf: bool, doc_type: str, vendor: str, date_str: str) -> str:
        """Determines the destination subdirectory path based on chosen strategy."""
        if self.strategy == "flat_renamed":
            return ""

        if self.strategy == "by_vendor":
            clean_vendor = vendor if vendor and vendor != "UnknownVendor" else "General"
            return os.path.join("Vendors", clean_vendor)

        if self.strategy == "by_date":
            try:
                dt = datetime.strptime(date_str, "%Y-%m-%d")
                year_str = dt.strftime("%Y")
                month_str = dt.strftime("%m - %B")
                return os.path.join(year_str, month_str)
            except Exception:
                return "Archive"

        # Default: 'by_category'
        if is_pdf:
            folder_map = {
                "Invoice": "Invoices",
                "Receipt": "Receipts",
                "Statement": "Bank_Statements",
                "Tax_Document": "Tax_Records",
                "Contract": "Contracts_Agreements",
                "Estimate": "Estimates_Quotes",
                "Resume": "Resumes_CVs",
                "Document": "General_Documents"
            }
            return folder_map.get(doc_type, "General_Documents")

        return "Other_Files"

    def _categorize_non_pdf(self, ext_lower: str) -> str:
        for cat, extensions in FILE_TYPE_CATEGORIES.items():
            if ext_lower in extensions:
                return cat
        return "Miscellaneous"

    def execute_plan(self, plan: List[Dict[str, Any]], dry_run: bool = False) -> Dict[str, Any]:
        """Executes the proposed plan. If dry_run=True, returns simulation results without changes."""
        results = {
            "total": len(plan),
            "processed": 0,
            "moved_files": [],
            "skipped": 0,
            "errors": []
        }

        if dry_run:
            for item in plan:
                target_filename = self._resolve_collision(item["target_dir"], item["proposed_filename"])
                target_path = os.path.join(item["target_dir"], target_filename)
                results["moved_files"].append({
                    "from": item["original_path"],
                    "to": target_path,
                    "doc_type": item["doc_type"],
                    "vendor": item["vendor"]
                })
            results["processed"] = len(results["moved_files"])
            return results

        batch_history: List[Dict[str, str]] = []

        for item in plan:
            try:
                dest_dir = item["target_dir"]
                os.makedirs(dest_dir, exist_ok=True)

                target_filename = self._resolve_collision(dest_dir, item["proposed_filename"], original_path=item["original_path"])
                target_path = os.path.join(dest_dir, target_filename)

                # Skip if file already has the exact target name and is in the exact destination
                if os.path.abspath(item["original_path"]) == os.path.abspath(target_path):
                    results["skipped"] += 1
                    continue

                shutil.move(item["original_path"], target_path)

                batch_history.append({
                    "original_path": item["original_path"],
                    "new_path": target_path,
                    "timestamp": datetime.now().isoformat()
                })

                results["moved_files"].append({
                    "from": item["original_path"],
                    "to": target_path,
                    "doc_type": item["doc_type"],
                    "vendor": item["vendor"]
                })
                results["processed"] += 1

            except Exception as e:
                results["errors"].append({
                    "file": item["original_path"],
                    "error": str(e)
                })

        # Save history for undo support
        if batch_history:
            self._save_history(batch_history)

        return results

    def _resolve_collision(self, target_dir: str, filename: str, original_path: Optional[str] = None) -> str:
        """Ensures we never overwrite an existing file by appending _1, _2 if needed."""
        target_path = os.path.join(target_dir, filename)

        # If it points to the exact same file on disk, no collision rename needed
        if original_path and os.path.exists(target_path) and os.path.samefile(original_path, target_path):
            return filename

        if not os.path.exists(target_path):
            return filename

        base, ext = os.path.splitext(filename)
        counter = 1
        while os.path.exists(os.path.join(target_dir, f"{base}_{counter}{ext}")):
            counter += 1
        return f"{base}_{counter}{ext}"

    def _save_history(self, batch: List[Dict[str, str]]):
        """Appends current batch to the history file."""
        history = []
        if os.path.exists(self.history_path):
            try:
                with open(self.history_path, "r", encoding="utf-8") as f:
                    history = json.load(f)
            except Exception:
                history = []

        history.append({
            "batch_id": datetime.now().strftime("%Y%m%d_%H%M%S"),
            "count": len(batch),
            "moves": batch
        })

        try:
            with open(self.history_path, "w", encoding="utf-8") as f:
                json.dump(history, f, indent=2)
        except Exception as e:
            print(f"Warning: Failed to save history: {e}")

    def undo_last_batch(self) -> Dict[str, Any]:
        """Rolls back the most recent organization batch."""
        if not os.path.exists(self.history_path):
            return {"success": False, "message": "No history found to undo."}

        try:
            with open(self.history_path, "r", encoding="utf-8") as f:
                history = json.load(f)
        except Exception as e:
            return {"success": False, "message": f"Could not read history: {e}"}

        if not history:
            return {"success": False, "message": "No operations recorded."}

        last_batch = history.pop()
        reverted = 0
        errors = []

        for move in reversed(last_batch.get("moves", [])):
            src = move["new_path"]
            dst = move["original_path"]
            try:
                if os.path.exists(src):
                    os.makedirs(os.path.dirname(dst), exist_ok=True)
                    shutil.move(src, dst)
                    reverted += 1
                else:
                    errors.append(f"File not found: {src}")
            except Exception as e:
                errors.append(f"Failed to revert {src}: {e}")

        # Update history file
        with open(self.history_path, "w", encoding="utf-8") as f:
            json.dump(history, f, indent=2)

        # Cleanup empty subdirectories if any
        self._cleanup_empty_dirs(self.target_dir)

        return {
            "success": True,
            "reverted": reverted,
            "errors": errors,
            "batch_id": last_batch.get("batch_id")
        }

    def _cleanup_empty_dirs(self, root_dir: str):
        """Recursively removes empty directories within root_dir."""
        for dirpath, dirnames, filenames in os.walk(root_dir, topdown=False):
            if dirpath != root_dir:
                try:
                    if not os.listdir(dirpath):
                        os.rmdir(dirpath)
                except Exception:
                    pass
