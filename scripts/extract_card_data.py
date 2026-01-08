#!/usr/bin/env python3
"""
Extract card data and text from Wingspan PDFs.
Maps images to their actual bird data.
"""

import json
import re
from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError:
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "PyMuPDF"])
    import fitz

def extract_text_from_pdf(pdf_path):
    """Extract all text from PDF pages."""
    print(f"\nExtracting text from: {pdf_path}")
    doc = fitz.open(pdf_path)
    
    all_text = []
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text()
        all_text.append({
            'page': page_num + 1,
            'text': text
        })
    
    doc.close()
    return all_text

def extract_bird_cards_data():
    """Extract bird card data from BirdCards PDF."""
    pdf_path = "D:/wingspan-online/Wingspan Assets/BirdCards - Update Pack Cards.pdf"
    
    if not Path(pdf_path).exists():
        print(f"ERROR: PDF not found: {pdf_path}")
        return []
    
    pages_text = extract_text_from_pdf(pdf_path)
    
    print(f"\n{'='*60}")
    print("BIRD CARD TEXT EXTRACTION")
    print('='*60)
    
    birds = []
    for page_data in pages_text:
        page_num = page_data['page']
        text = page_data['text']
        
        print(f"\n--- Page {page_num} ---")
        print(text[:500] if len(text) > 500 else text)
        print("...")
        
        # Try to parse bird data from text
        # This is a simplified parser - might need adjustment
        lines = text.strip().split('\n')
        
        # Look for bird name patterns
        # Usually bird names are at the top
        
    return birds

def extract_bonus_cards_data():
    """Extract bonus card data from BonusCards PDF."""
    pdf_path = "D:/wingspan-online/Wingspan Assets/Wingspan_BonusCards - Update Pack Cards.pdf"
    
    if not Path(pdf_path).exists():
        print(f"ERROR: PDF not found: {pdf_path}")
        return []
    
    pages_text = extract_text_from_pdf(pdf_path)
    
    print(f"\n{'='*60}")
    print("BONUS CARD TEXT EXTRACTION")
    print('='*60)
    
    bonus_cards = []
    for page_data in pages_text:
        page_num = page_data['page']
        text = page_data['text']
        
        print(f"\n--- Page {page_num} ---")
        print(text)
        
    return bonus_cards

def extract_appendix_data():
    """Extract comprehensive bird list from Appendix."""
    pdf_path = "D:/wingspan-online/Wingspan Assets/WS_Appendix_r17.pdf"
    
    if not Path(pdf_path).exists():
        print(f"ERROR: PDF not found: {pdf_path}")
        return []
    
    print(f"\n{'='*60}")
    print("EXTRACTING FROM APPENDIX (Comprehensive Bird List)")
    print('='*60)
    
    pages_text = extract_text_from_pdf(pdf_path)
    
    # Save to file for manual review
    output_file = "D:/wingspan-online/extracted_appendix_text.txt"
    with open(output_file, 'w', encoding='utf-8') as f:
        for page_data in pages_text:
            f.write(f"\n{'='*60}\n")
            f.write(f"PAGE {page_data['page']}\n")
            f.write(f"{'='*60}\n")
            f.write(page_data['text'])
            f.write('\n')
    
    print(f"\nAppendix text saved to: {output_file}")
    print("Review this file to understand the data structure")
    
    return pages_text

def main():
    print("="*60)
    print("  Wingspan Card Data Extractor")
    print("="*60)
    
    # Extract from Appendix first (most comprehensive)
    appendix_data = extract_appendix_data()
    
    # Extract from Bird Cards PDF
    bird_data = extract_bird_cards_data()
    
    # Extract from Bonus Cards PDF
    bonus_data = extract_bonus_cards_data()
    
    print("\n" + "="*60)
    print("EXTRACTION COMPLETE")
    print("="*60)
    print("\nNext step: Review extracted_appendix_text.txt")
    print("This will help us understand how to parse the bird data")

if __name__ == "__main__":
    main()
