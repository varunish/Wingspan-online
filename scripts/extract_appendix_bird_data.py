#!/usr/bin/env python3
"""
Extract comprehensive bird data from the Appendix PDF.
Match with our extracted cards and update birds.json accurately.
"""

import json
import re
from pathlib import Path

try:
    import fitz
except ImportError:
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "PyMuPDF"])
    import fitz

def extract_appendix_text():
    """Extract all text from Appendix PDF."""
    pdf_path = Path("D:/wingspan-online/Wingspan Assets/WS_Appendix_r17.pdf")
    
    print("Extracting text from Appendix...")
    doc = fitz.open(str(pdf_path))
    
    full_text = []
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text()
        full_text.append(text)
    
    doc.close()
    
    # Save for manual review
    output_file = Path("wingspan_appendix_full_text.txt")
    with open(output_file, 'w', encoding='utf-8') as f:
        for i, text in enumerate(full_text):
            f.write(f"\n{'='*70}\n")
            f.write(f"PAGE {i + 1}\n")
            f.write(f"{'='*70}\n")
            f.write(text)
    
    print(f"Saved full appendix text to: {output_file}")
    return full_text

def extract_card_metadata():
    """Get metadata from our extracted cards to match with appendix."""
    metadata_file = Path("temp_extracted/birds/_metadata.json")
    
    if metadata_file.exists():
        with open(metadata_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    return None

def main():
    print("="*70)
    print("WINGSPAN APPENDIX DATA EXTRACTOR")
    print("="*70)
    
    # Extract appendix text
    appendix_text = extract_appendix_text()
    
    # Get our card metadata
    card_metadata = extract_card_metadata()
    
    print(f"\nExtracted {len(appendix_text)} pages from Appendix")
    print("\nPlease review 'wingspan_appendix_full_text.txt'")
    print("to understand the data structure.\n")
    
    print("Next steps:")
    print("1. Review the appendix text file")
    print("2. Identify the bird data format")
    print("3. Create parser to match birds with data")
    print("4. Update birds.json with accurate information")

if __name__ == "__main__":
    main()
