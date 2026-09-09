import os
import sys
import io

if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors


def generate_sample_documents(output_dir: str):
    """Generates a batch of realistic sample invoices, receipts, and files with messy names."""
    os.makedirs(output_dir, exist_ok=True)
    styles = getSampleStyleSheet()

    # Document 1: Home Depot Invoice with messy name
    p1 = os.path.join(output_dir, "scan_00481_final(2).pdf")
    doc1 = SimpleDocTemplate(p1, pagesize=letter)
    story1 = [
        Paragraph("<b>THE HOME DEPOT</b> - Pro Contractor Supply", styles['Heading1']),
        Paragraph("<b>Tax Invoice</b>", styles['Heading2']),
        Spacer(1, 10),
        Paragraph("<b>Invoice Number:</b> HD-90821", styles['Normal']),
        Paragraph("<b>Date:</b> March 1, 2026", styles['Normal']),
        Paragraph("<b>Bill To:</b> Apex Construction LLC", styles['Normal']),
        Spacer(1, 15),
        Table([
            ["Item", "Qty", "Rate", "Total"],
            ["Drywall Panels 1/2 in", "20", "$14.50", "$290.00"],
            ["Joint Compound 4.5 gal", "4", "$18.25", "$73.00"],
            ["Screws 5lb Box", "2", "$19.99", "$39.98"],
            ["<b>Total Amount Due:</b>", "", "", "<b>$402.98</b>"]
        ], colWidths=[200, 50, 70, 80]),
        Spacer(1, 20),
        Paragraph("Payment Due in 30 Days. Thank you for your business!", styles['Italic'])
    ]
    doc1.build(story1)

    # Document 2: Uber Trip Receipt
    p2 = os.path.join(output_dir, "receipt_download_temp.pdf")
    doc2 = SimpleDocTemplate(p2, pagesize=letter)
    story2 = [
        Paragraph("<b>Uber Technologies Inc.</b>", styles['Heading1']),
        Paragraph("<b>Ride Receipt & Payment Confirmation</b>", styles['Heading2']),
        Spacer(1, 10),
        Paragraph("<b>Order:</b> UB-772910", styles['Normal']),
        Paragraph("<b>Date:</b> 2026-02-28", styles['Normal']),
        Paragraph("<b>Trip:</b> Airport Terminal 2 to Downtown Hotel", styles['Normal']),
        Spacer(1, 15),
        Paragraph("<b>Total Paid:</b> $42.50 via Visa ending in 4092", styles['Heading3'])
    ]
    doc2.build(story2)

    # Document 3: Chase Bank Statement
    p3 = os.path.join(output_dir, "stmt_feb2026_print.pdf")
    doc3 = SimpleDocTemplate(p3, pagesize=letter)
    story3 = [
        Paragraph("<b>JPMorgan Chase Bank, N.A.</b>", styles['Heading1']),
        Paragraph("<b>Commercial Checking Account Statement</b>", styles['Heading2']),
        Spacer(1, 10),
        Paragraph("<b>Statement Period:</b> February 01, 2026 to February 28, 2026", styles['Normal']),
        Paragraph("<b>Account Number:</b> CHASE-992144", styles['Normal']),
        Paragraph("<b>Closing Balance:</b> $12,450.80", styles['Heading3']),
    ]
    doc3.build(story3)

    # Document 4: Amazon Business Invoice
    p4 = os.path.join(output_dir, "Amazon_Order_82910_copy.pdf")
    doc4 = SimpleDocTemplate(p4, pagesize=letter)
    story4 = [
        Paragraph("<b>Amazon.com Services LLC</b>", styles['Heading1']),
        Paragraph("<b>Tax Invoice / Purchase Summary</b>", styles['Heading2']),
        Spacer(1, 10),
        Paragraph("<b>Invoice #:</b> AMZ-8831902", styles['Normal']),
        Paragraph("<b>Invoice Date:</b> 2026-02-14", styles['Normal']),
        Paragraph("<b>Items:</b> Ergonomic Office Chair & Monitor Arm", styles['Normal']),
        Spacer(1, 10),
        Paragraph("<b>Grand Total:</b> $319.49", styles['Heading3']),
    ]
    doc4.build(story4)

    # Document 5: Client NDA Contract
    p5 = os.path.join(output_dir, "Agreement_Draft_FINAL_v2.pdf")
    doc5 = SimpleDocTemplate(p5, pagesize=letter)
    story5 = [
        Paragraph("<b>MUTUAL NON-DISCLOSURE AGREEMENT</b>", styles['Heading1']),
        Paragraph("<b>Service Agreement & Terms</b>", styles['Heading3']),
        Spacer(1, 10),
        Paragraph("<b>Effective Date:</b> 2026-01-15", styles['Normal']),
        Paragraph("This Non-Disclosure Agreement ('Agreement') is entered into by and between Acme Corp and Consultant.", styles['Normal']),
        Spacer(1, 15),
        Paragraph("<b>Reference:</b> NDA-2026-004", styles['Normal']),
        Paragraph("Both parties agree to hold confidential information in strict confidence.", styles['Normal'])
    ]
    doc5.build(story5)

    # Document 6: Contractor Estimate
    p6 = os.path.join(output_dir, "est_roof_repair_quote.pdf")
    doc6 = SimpleDocTemplate(p6, pagesize=letter)
    story6 = [
        Paragraph("<b>Apex Roofing & Renovation Services</b>", styles['Heading1']),
        Paragraph("<b>Official Estimate & Quotation</b>", styles['Heading2']),
        Spacer(1, 10),
        Paragraph("<b>Estimate #:</b> EST-5520", styles['Normal']),
        Paragraph("<b>Date:</b> 2026-03-05", styles['Normal']),
        Paragraph("<b>Estimate Amount:</b> $2,850.00", styles['Heading3']),
        Paragraph("Valid for 30 days from issue date.", styles['Italic'])
    ]
    doc6.build(story6)

    # Create dummy non-PDF files as well to demonstrate multi-file sorting
    with open(os.path.join(output_dir, "expenses_january_2026.csv"), "w", encoding="utf-8") as f:
        f.write("Date,Vendor,Category,Amount\n2026-01-05,Amazon,Office,$45.00\n2026-01-12,Uber,Travel,$24.50\n")

    with open(os.path.join(output_dir, "meeting_notes_march.docx"), "w", encoding="utf-8") as f:
        f.write("Meeting notes for team strategy discussion.\n")

    print(f"[OK] Generated 8 realistic sample files in: {os.path.abspath(output_dir)}")


if __name__ == "__main__":
    target = os.path.join(os.path.dirname(__file__), "sample_inbox")
    generate_sample_documents(target)
