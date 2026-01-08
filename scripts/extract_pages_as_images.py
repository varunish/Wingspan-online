#!/usr/bin/env python3
"""
Extract bird cards by rendering entire PDF pages as images.
Each page = one complete card with layout.
"""

from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError:
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "PyMuPDF"])
    import fitz

def extract_bird_cards_from_pages():
    """Render each PDF page as a complete card image."""
    pdf_path = Path("D:/wingspan-online/Wingspan Assets/BirdCards - Update Pack Cards.pdf")
    output_dir = Path("D:/wingspan-online/client/public/assets/birds/fronts")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print("="*70)
    print("EXTRACTING BIRD CARDS - Rendering complete pages")
    print("="*70)
    
    doc = fitz.open(str(pdf_path))
    card_id = 1
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        
        # Render page as image at high resolution
        # zoom = 2 means 2x resolution (higher quality)
        zoom = 2
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat, alpha=False)
        
        # Save as JPEG
        output_path = output_dir / f"bird-{card_id}.jpg"
        pix.save(str(output_path))
        
        print(f"Page {page_num + 1}: Rendered bird-{card_id}.jpg ({pix.width}x{pix.height}px)")
        
        card_id += 1
    
    doc.close()
    
    total = card_id - 1
    print(f"\n Extracted {total} bird cards")
    return total

def extract_bonus_cards_from_pages():
    """Render each bonus card PDF page as image."""
    pdf_path = Path("D:/wingspan-online/Wingspan Assets/Wingspan_BonusCards - Update Pack Cards.pdf")
    output_dir = Path("D:/wingspan-online/client/public/assets/bonus")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print("\n" + "="*70)
    print("EXTRACTING BONUS CARDS - Rendering complete pages")
    print("="*70)
    
    doc = fitz.open(str(pdf_path))
    card_id = 1
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        
        # Render page as image at high resolution
        zoom = 2
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat, alpha=False)
        
        # Save as JPEG
        output_path = output_dir / f"bonus-{card_id}.jpg"
        pix.save(str(output_path))
        
        print(f"Page {page_num + 1}: Rendered bonus-{card_id}.jpg ({pix.width}x{pix.height}px)")
        
        card_id += 1
    
    doc.close()
    
    total = card_id - 1
    print(f"\n Extracted {total} bonus cards")
    return total

def main():
    print("WINGSPAN PAGE-TO-IMAGE EXTRACTOR")
    print("Rendering entire PDF pages as card images\n")
    
    # Extract bird cards
    bird_count = extract_bird_cards_from_pages()
    
    # Extract bonus cards
    bonus_count = extract_bonus_cards_from_pages()
    
    print("\n" + "="*70)
    print("EXTRACTION COMPLETE!")
    print("="*70)
    print(f"\n Extracted:")
    print(f"  {bird_count} bird cards -> client/public/assets/birds/fronts/")
    print(f"  {bonus_count} bonus cards -> client/public/assets/bonus/")
    print(f"\n Each page rendered as a complete card with layout!")

if __name__ == "__main__":
    main()
