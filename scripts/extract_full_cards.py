#!/usr/bin/env python3
"""
Re-extract bird cards, but this time keep the LARGEST images (full cards).
"""

import json
from pathlib import Path
import shutil

try:
    import fitz
except ImportError:
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "PyMuPDF"])
    import fitz

def extract_full_bird_cards():
    """Extract FULL bird card images (largest images per page)."""
    pdf_path = Path("D:/wingspan-online/Wingspan Assets/BirdCards - Update Pack Cards.pdf")
    output_dir = Path("D:/wingspan-online/client/public/assets/birds/fronts")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print("="*70)
    print("EXTRACTING FULL BIRD CARDS (keeping largest images)")
    print("="*70)
    
    doc = fitz.open(str(pdf_path))
    card_id = 1
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        image_list = page.get_images(full=True)
        
        if not image_list:
            continue
        
        # Extract ALL images from this page to find the largest
        page_images = []
        for img in image_list:
            xref = img[0]
            try:
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]
                
                # Only consider large images (>50KB)
                if len(image_bytes) > 50000:
                    page_images.append({
                        'bytes': image_bytes,
                        'ext': image_ext,
                        'size': len(image_bytes)
                    })
            except Exception as e:
                continue
        
        # Keep the LARGEST image (most likely the full card)
        if page_images:
            largest = max(page_images, key=lambda x: x['size'])
            
            # Save the full card image
            output_path = output_dir / f"bird-{card_id}.{largest['ext']}"
            with open(output_path, 'wb') as f:
                f.write(largest['bytes'])
            
            print(f"Page {page_num + 1}: Saved bird-{card_id}.{largest['ext']} ({largest['size']} bytes)")
            card_id += 1
    
    doc.close()
    
    total = card_id - 1
    print(f"\n Extracted {total} full bird card images")
    return total

def extract_full_bonus_cards():
    """Extract FULL bonus card images (largest images per page)."""
    pdf_path = Path("D:/wingspan-online/Wingspan Assets/Wingspan_BonusCards - Update Pack Cards.pdf")
    output_dir = Path("D:/wingspan-online/client/public/assets/bonus")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print("\n" + "="*70)
    print("EXTRACTING FULL BONUS CARDS (keeping largest images)")
    print("="*70)
    
    doc = fitz.open(str(pdf_path))
    card_id = 1
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        image_list = page.get_images(full=True)
        
        if not image_list:
            continue
        
        # Extract ALL images from this page
        page_images = []
        for img in image_list:
            xref = img[0]
            try:
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]
                
                # Keep large images (>200KB for bonus cards)
                if len(image_bytes) > 200000:
                    page_images.append({
                        'bytes': image_bytes,
                        'ext': image_ext,
                        'size': len(image_bytes)
                    })
            except Exception as e:
                continue
        
        # Keep the LARGEST image
        if page_images:
            largest = max(page_images, key=lambda x: x['size'])
            
            # Save the full bonus card image
            output_path = output_dir / f"bonus-{card_id}.{largest['ext']}"
            with open(output_path, 'wb') as f:
                f.write(largest['bytes'])
            
            print(f"Page {page_num + 1}: Saved bonus-{card_id}.{largest['ext']} ({largest['size']} bytes)")
            card_id += 1
    
    doc.close()
    
    total = card_id - 1
    print(f"\n Extracted {total} full bonus card images")
    return total

def main():
    print("WINGSPAN FULL CARD EXTRACTOR")
    print("Extracting LARGEST images (full cards with layout)\n")
    
    # Extract full bird cards
    bird_count = extract_full_bird_cards()
    
    # Extract full bonus cards
    bonus_count = extract_full_bonus_cards()
    
    print("\n" + "="*70)
    print("EXTRACTION COMPLETE!")
    print("="*70)
    print(f"\n Extracted:")
    print(f"  {bird_count} full bird cards -> client/public/assets/birds/fronts/")
    print(f"  {bonus_count} full bonus cards -> client/public/assets/bonus/")
    print(f"\n These should now show the complete card layout with all details!")

if __name__ == "__main__":
    main()
