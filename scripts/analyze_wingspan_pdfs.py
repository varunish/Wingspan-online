#!/usr/bin/env python3
"""
Carefully analyze Wingspan PDFs to extract and map card data.
Step 1: Extract text from Appendix to understand structure.
"""

import json
from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError:
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "PyMuPDF"])
    import fitz

def analyze_appendix():
    """Extract and analyze the Appendix to understand bird data structure."""
    pdf_path = Path("D:/wingspan-online/Wingspan Assets/WS_Appendix_r17.pdf")
    
    print("="*70)
    print("ANALYZING WINGSPAN APPENDIX")
    print("="*70)
    
    if not pdf_path.exists():
        print(f"ERROR: {pdf_path} not found!")
        return
    
    doc = fitz.open(str(pdf_path))
    print(f"\nTotal pages: {len(doc)}")
    
    # Sample first few pages to understand structure
    output_file = Path("wingspan_appendix_sample.txt")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        for page_num in range(min(5, len(doc))):  # First 5 pages
            page = doc[page_num]
            text = page.get_text()
            
            f.write(f"\n{'='*70}\n")
            f.write(f"PAGE {page_num + 1}\n")
            f.write(f"{'='*70}\n")
            f.write(text)
            
            # Also print to console for immediate review
            print(f"\n--- PAGE {page_num + 1} (first 800 chars) ---")
            print(text[:800])
            print("...\n")
    
    doc.close()
    
    print(f"\nFull text saved to: {output_file}")
    print("\nPlease review the structure to understand how bird data is organized.")

def analyze_bird_cards_pdf():
    """Analyze the BirdCards PDF structure."""
    pdf_path = Path("D:/wingspan-online/Wingspan Assets/BirdCards - Update Pack Cards.pdf")
    
    print("\n" + "="*70)
    print("ANALYZING BIRD CARDS PDF")
    print("="*70)
    
    if not pdf_path.exists():
        print(f"ERROR: {pdf_path} not found!")
        return
    
    doc = fitz.open(str(pdf_path))
    print(f"\nTotal pages: {len(doc)}")
    
    # Check first page
    page = doc[0]
    text = page.get_text()
    
    print("\n--- PAGE 1 SAMPLE ---")
    print(text[:1000])
    
    # Count images per page
    print("\n--- IMAGE COUNT PER PAGE ---")
    for page_num in range(min(5, len(doc))):
        page = doc[page_num]
        images = page.get_images(full=True)
        print(f"Page {page_num + 1}: {len(images)} images")
    
    doc.close()

def analyze_bonus_cards_pdf():
    """Analyze the Bonus Cards PDF structure."""
    pdf_path = Path("D:/wingspan-online/Wingspan Assets/Wingspan_BonusCards - Update Pack Cards.pdf")
    
    print("\n" + "="*70)
    print("ANALYZING BONUS CARDS PDF")
    print("="*70)
    
    if not pdf_path.exists():
        print(f"ERROR: {pdf_path} not found!")
        return
    
    doc = fitz.open(str(pdf_path))
    print(f"\nTotal pages: {len(doc)}")
    
    # Extract all text
    output_file = Path("wingspan_bonus_cards_text.txt")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text()
            
            f.write(f"\n{'='*70}\n")
            f.write(f"PAGE {page_num + 1}\n")
            f.write(f"{'='*70}\n")
            f.write(text)
    
    print(f"Bonus cards text saved to: {output_file}")
    
    doc.close()

def main():
    print("WINGSPAN PDF ANALYZER")
    print("This script will help us understand the PDF structure")
    print("before extracting and mapping data.\n")
    
    # Analyze Appendix (comprehensive bird list)
    analyze_appendix()
    
    # Analyze Bird Cards PDF
    analyze_bird_cards_pdf()
    
    # Analyze Bonus Cards PDF
    analyze_bonus_cards_pdf()
    
    print("\n" + "="*70)
    print("ANALYSIS COMPLETE")
    print("="*70)
    print("\nNext steps:")
    print("1. Review wingspan_appendix_sample.txt")
    print("2. Review wingspan_bonus_cards_text.txt")
    print("3. Understand the data structure")
    print("4. Build parser based on actual structure")

if __name__ == "__main__":
    main()
