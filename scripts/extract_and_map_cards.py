#!/usr/bin/env python3
"""
Extract card images AND text from Wingspan PDFs.
Map them together to create accurate JSON data files.
"""

import json
import re
from pathlib import Path
import shutil

try:
    import fitz  # PyMuPDF
except ImportError:
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "PyMuPDF"])
    import fitz

def extract_bird_cards():
    """Extract bird card images and text together."""
    pdf_path = Path("D:/wingspan-online/Wingspan Assets/BirdCards - Update Pack Cards.pdf")
    output_dir = Path("D:/wingspan-online/temp_extracted/birds")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print("="*70)
    print("EXTRACTING BIRD CARDS")
    print("="*70)
    
    doc = fitz.open(str(pdf_path))
    birds = []
    card_id = 1
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        
        # Extract text from this page
        page_text = page.get_text()
        
        # Extract images from this page
        image_list = page.get_images(full=True)
        
        print(f"\nPage {page_num + 1}:")
        print(f"  Text (first 300 chars): {page_text[:300].strip()}")
        print(f"  Images found: {len(image_list)}")
        
        # Extract large images (actual bird cards, not icons)
        for img_index, img in enumerate(image_list):
            xref = img[0]
            
            try:
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]
                
                # Only save large images (>50KB = likely actual cards)
                if len(image_bytes) > 50000:
                    image_filename = f"{card_id}.{image_ext}"
                    image_path = output_dir / image_filename
                    
                    with open(image_path, "wb") as f:
                        f.write(image_bytes)
                    
                    print(f"  Saved: {image_filename} ({len(image_bytes)} bytes)")
                    
                    # Store metadata
                    birds.append({
                        'id': card_id,
                        'image_file': image_filename,
                        'page': page_num + 1,
                        'page_text': page_text.strip(),
                        'image_size': len(image_bytes)
                    })
                    
                    card_id += 1
                    
            except Exception as e:
                print(f"  Error extracting image {img_index + 1}: {e}")
    
    doc.close()
    
    # Save metadata
    metadata_file = output_dir / "_metadata.json"
    with open(metadata_file, 'w', encoding='utf-8') as f:
        json.dump(birds, f, indent=2, ensure_ascii=False)
    
    print(f"\n Total bird cards extracted: {len(birds)}")
    print(f" Metadata saved to: {metadata_file}")
    
    return birds

def extract_bonus_cards():
    """Extract bonus card images and text together."""
    pdf_path = Path("D:/wingspan-online/Wingspan Assets/Wingspan_BonusCards - Update Pack Cards.pdf")
    output_dir = Path("D:/wingspan-online/temp_extracted/bonus")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print("\n" + "="*70)
    print("EXTRACTING BONUS CARDS")
    print("="*70)
    
    doc = fitz.open(str(pdf_path))
    bonus_cards = []
    card_id = 1
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        
        # Extract text from this page
        page_text = page.get_text()
        
        # Extract images from this page
        image_list = page.get_images(full=True)
        
        print(f"\nPage {page_num + 1}:")
        print(f"  Text: {page_text.strip()[:200]}")
        print(f"  Images found: {len(image_list)}")
        
        # Extract large images (actual bonus cards)
        for img_index, img in enumerate(image_list):
            xref = img[0]
            
            try:
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]
                
                # Only save large images
                if len(image_bytes) > 50000:
                    image_filename = f"{card_id}.{image_ext}"
                    image_path = output_dir / image_filename
                    
                    with open(image_path, "wb") as f:
                        f.write(image_bytes)
                    
                    print(f"  Saved: {image_filename} ({len(image_bytes)} bytes)")
                    
                    # Store metadata
                    bonus_cards.append({
                        'id': card_id,
                        'image_file': image_filename,
                        'page': page_num + 1,
                        'page_text': page_text.strip(),
                        'image_size': len(image_bytes)
                    })
                    
                    card_id += 1
                    
            except Exception as e:
                print(f"  Error extracting image {img_index + 1}: {e}")
    
    doc.close()
    
    # Save metadata
    metadata_file = output_dir / "_metadata.json"
    with open(metadata_file, 'w', encoding='utf-8') as f:
        json.dump(bonus_cards, f, indent=2, ensure_ascii=False)
    
    print(f"\n Total bonus cards extracted: {len(bonus_cards)}")
    print(f" Metadata saved to: {metadata_file}")
    
    return bonus_cards

def main():
    print("WINGSPAN CARD EXTRACTOR & MAPPER")
    print("Extracting images and text together for proper mapping\n")
    
    # Extract bird cards with metadata
    bird_cards = extract_bird_cards()
    
    # Extract bonus cards with metadata
    bonus_cards = extract_bonus_cards()
    
    print("\n" + "="*70)
    print("EXTRACTION COMPLETE")
    print("="*70)
    print(f"\nExtracted:")
    print(f"  {len(bird_cards)} bird cards -> temp_extracted/birds/")
    print(f"  {len(bonus_cards)} bonus cards -> temp_extracted/bonus/")
    print(f"\nMetadata files created with page text for each card")
    print(f"\nNext: Review temp_extracted/*/_metadata.json to parse bird data")

if __name__ == "__main__":
    main()
