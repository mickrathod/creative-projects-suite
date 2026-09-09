import os
import sys
import unittest

# Ensure src is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.pdf_parser import PDFParser
from src.organizer import FolderOrganizer
from tests.create_sample_docs import generate_sample_documents


class TestOrganizer(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.test_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "test_env"))
        cls.source_dir = os.path.join(cls.test_dir, "incoming")
        cls.target_dir = os.path.join(cls.test_dir, "organized")
        generate_sample_documents(cls.source_dir)

    def test_01_pdf_parser_metadata(self):
        """Test that PDFParser correctly extracts vendor, doc_type, and dates from generated sample PDFs."""
        home_depot_pdf = os.path.join(self.source_dir, "scan_00481_final(2).pdf")
        meta = PDFParser.parse(home_depot_pdf)
        self.assertEqual(meta["doc_type"], "Invoice")
        self.assertEqual(meta["vendor"], "HomeDepot")
        self.assertEqual(meta["date"], "2026-03-01")
        self.assertEqual(meta["ref_number"], "HD-90821")
        self.assertIn("HomeDepot", meta["proposed_filename"])

        uber_pdf = os.path.join(self.source_dir, "receipt_download_temp.pdf")
        uber_meta = PDFParser.parse(uber_pdf)
        self.assertEqual(uber_meta["doc_type"], "Receipt")
        self.assertEqual(uber_meta["vendor"], "Uber")
        self.assertEqual(uber_meta["date"], "2026-02-28")

        chase_pdf = os.path.join(self.source_dir, "stmt_feb2026_print.pdf")
        chase_meta = PDFParser.parse(chase_pdf)
        self.assertEqual(chase_meta["doc_type"], "Statement")
        self.assertEqual(chase_meta["vendor"], "Chase")

    def test_02_dry_run_plan(self):
        """Test that scan_files produces a valid plan and dry run does not alter files."""
        organizer = FolderOrganizer(self.source_dir, self.target_dir, strategy="by_category")
        plan = organizer.scan_files()
        self.assertEqual(len(plan), 8)

        # Confirm dry-run execution
        results = organizer.execute_plan(plan, dry_run=True)
        self.assertEqual(results["total"], 8)
        self.assertEqual(results["processed"], 8)
        # Verify files remain in source_dir untouched
        self.assertEqual(len(os.listdir(self.source_dir)), 8)

    def test_03_execute_and_undo(self):
        """Test actual organization, file movement, folder creation, and 1-click rollback."""
        organizer = FolderOrganizer(self.source_dir, self.target_dir, strategy="by_category")
        plan = organizer.scan_files()
        results = organizer.execute_plan(plan, dry_run=False)

        self.assertEqual(results["processed"], 8)
        self.assertEqual(len(results["errors"]), 0)
        # Source directory should now be empty (except perhaps empty subfolders or none)
        self.assertEqual(len(os.listdir(self.source_dir)), 0)

        # Target directory should contain structured subdirectories: Invoices, Receipts, Bank_Statements, etc.
        target_subdirs = os.listdir(self.target_dir)
        self.assertIn("Invoices", target_subdirs)
        self.assertIn("Receipts", target_subdirs)
        self.assertIn("Spreadsheets", target_subdirs)

        # Now test Undo Rollback
        undo_res = organizer.undo_last_batch()
        self.assertTrue(undo_res["success"])
        self.assertEqual(undo_res["reverted"], 8)

        # Verify all 8 files are back in source_dir!
        self.assertEqual(len(os.listdir(self.source_dir)), 8)


if __name__ == "__main__":
    unittest.main()
