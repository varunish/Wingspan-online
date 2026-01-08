#!/usr/bin/env python3
"""
Parse extracted metadata and generate proper birds.json and bonus_cards.json.
Maps images to correct data based on extracted text.
"""

import json
import re
from pathlib import Path
import shutil

def parse_bird_text(text):
    """Parse bird card text to extract properties."""
    lines = text.strip().split('\n')
    
    # First line is usually the bird name
    name = lines[0].strip() if lines else "Unknown Bird"
    
    # Extract wingspan (e.g., "38cm")
    wingspan_match = re.search(r'(\d+)cm', text)
    wingspan = int(wingspan_match.group(1)) if wingspan_match else 50
    
    # Extract points (number before WHEN or when played or ONCE)
    points_match = re.search(r'(\d+)\s*(?:WHEN|when|ONCE)', text)
    points = int(points_match.group(1)) if points_match else 3
    
    # Determine power type and effect
    power = None
    if 'WHEN ACTIVATED:' in text:
        power_type = 'WHEN_ACTIVATED'
        power_text = text.split('WHEN ACTIVATED:')[1].strip() if 'WHEN ACTIVATED:' in text else ''
        power_text = power_text.split('BirdCards_')[0].strip()
        power = {'type': power_type, 'effect': power_text}
    elif 'when played:' in text or 'WHEN PLAYED:' in text:
        power_type = 'WHEN_PLAYED'
        power_text = re.split(r'when played:|WHEN PLAYED:', text, flags=re.IGNORECASE)[1].strip()
        power_text = power_text.split('BirdCards_')[0].strip()
        power = {'type': power_type, 'effect': power_text}
    elif 'ONCE BETWEEN TURNS:' in text:
        power_type = 'ONCE_BETWEEN_TURNS'
        power_text = text.split('ONCE BETWEEN TURNS:')[1].strip()
        power_text = power_text.split('BirdCards_')[0].strip()
        power = {'type': power_type, 'effect': power_text}
    
    return {
        'name': name,
        'wingspan': wingspan,
        'points': points,
        'power': power
    }

def generate_birds_json():
    """Generate birds.json from extracted metadata."""
    metadata_file = Path("temp_extracted/birds/_metadata.json")
    
    if not metadata_file.exists():
        print(f"ERROR: {metadata_file} not found!")
        return
    
    with open(metadata_file, 'r', encoding='utf-8') as f:
        metadata = json.load(f)
    
    print("="*70)
    print("GENERATING birds.json")
    print("="*70)
    
    birds = []
    seen_pages = set()
    bird_id = 1
    
    for item in metadata:
        page = item['page']
        
        # Skip duplicate images from same page (keep only one bird per page)
        if page in seen_pages:
            continue
        seen_pages.add(page)
        
        # Parse bird text
        parsed = parse_bird_text(item['page_text'])
        
        # Create bird object
        bird = {
            'id': f"bird-{bird_id}",
            'name': parsed['name'],
            'habitats': ['forest'],  # Default, will need manual adjustment
            'foodCost': ['invertebrate'],  # Default, will need manual adjustment
            'points': parsed['points'],
            'nestType': 'platform',  # Default
            'eggCapacity': 4,  # Default
            'wingspan': parsed['wingspan']
        }
        
        if parsed['power']:
            bird['power'] = parsed['power']
        
        birds.append(bird)
        
        print(f"{bird_id}. {parsed['name']} - {parsed['points']} points")
        
        bird_id += 1
    
    # Save birds.json
    output_file = Path("data/birds.json")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(birds, f, indent=2, ensure_ascii=False)
    
    print(f"\n Generated {len(birds)} birds")
    print(f" Saved to: {output_file}")
    
    return birds

def parse_bonus_text(text):
    """Parse bonus card text."""
    lines = [l.strip() for l in text.strip().split('\n') if l.strip()]
    
    # First line is usually the card name
    name = lines[0] if lines else "Unknown Bonus"
    
    # Rest is description
    description = ' '.join(lines[1:])
    
    return {
        'name': name.title(),
        'description': description
    }

def generate_bonus_cards_json():
    """Generate bonus_cards.json from extracted metadata."""
    metadata_file = Path("temp_extracted/bonus/_metadata.json")
    
    if not metadata_file.exists():
        print(f"\nERROR: {metadata_file} not found!")
        return
    
    with open(metadata_file, 'r', encoding='utf-8') as f:
        metadata = json.load(f)
    
    print("\n" + "="*70)
    print("GENERATING bonus_cards.json")
    print("="*70)
    
    bonus_cards = []
    seen_pages = set()
    card_id = 1
    
    for item in metadata:
        page = item['page']
        image_size = item['image_size']
        
        # Skip duplicate images from same page
        if page in seen_pages:
            continue
        
        # Skip small icons (only keep large card images > 300KB)
        if image_size < 300000:
            continue
        
        seen_pages.add(page)
        
        # Parse bonus card text
        parsed = parse_bonus_text(item['page_text'])
        
        # Create bonus card object
        card = {
            'id': f"bonus-{card_id}",
            'name': parsed['name'],
            'description': parsed['description']
        }
        
        bonus_cards.append(card)
        
        print(f"{card_id}. {parsed['name']}")
        
        card_id += 1
    
    # Save bonus_cards.json
    output_file = Path("data/bonus_cards.json")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(bonus_cards, f, indent=2, ensure_ascii=False)
    
    print(f"\n Generated {len(bonus_cards)} bonus cards")
    print(f" Saved to: {output_file}")
    
    return bonus_cards

def copy_images_to_assets():
    """Copy the extracted images to the proper assets folder."""
    print("\n" + "="*70)
    print("COPYING IMAGES TO ASSETS FOLDER")
    print("="*70)
    
    # Copy bird images
    birds_src = Path("temp_extracted/birds")
    birds_dest = Path("client/public/assets/birds/fronts")
    birds_dest.mkdir(parents=True, exist_ok=True)
    
    # Copy only the images we're using (skip duplicates from same page)
    with open("temp_extracted/birds/_metadata.json", 'r', encoding='utf-8') as f:
        bird_metadata = json.load(f)
    
    seen_pages = set()
    bird_id = 1
    for item in bird_metadata:
        page = item['page']
        if page in seen_pages:
            continue
        seen_pages.add(page)
        
        src_file = birds_src / item['image_file']
        ext = Path(item['image_file']).suffix
        dest_file = birds_dest / f"bird-{bird_id}{ext}"
        
        if src_file.exists():
            shutil.copy2(src_file, dest_file)
            print(f" Copied: {item['image_file']} -> bird-{bird_id}{ext}")
        
        bird_id += 1
    
    # Copy bonus card images
    bonus_src = Path("temp_extracted/bonus")
    bonus_dest = Path("client/public/assets/bonus")
    bonus_dest.mkdir(parents=True, exist_ok=True)
    
    with open("temp_extracted/bonus/_metadata.json", 'r', encoding='utf-8') as f:
        bonus_metadata = json.load(f)
    
    seen_pages = set()
    bonus_id = 1
    for item in bonus_metadata:
        page = item['page']
        image_size = item['image_size']
        
        if page in seen_pages or image_size < 300000:
            continue
        seen_pages.add(page)
        
        src_file = bonus_src / item['image_file']
        ext = Path(item['image_file']).suffix
        dest_file = bonus_dest / f"bonus-{bonus_id}{ext}"
        
        if src_file.exists():
            shutil.copy2(src_file, dest_file)
            print(f" Copied: {item['image_file']} -> bonus-{bonus_id}{ext}")
        
        bonus_id += 1

def main():
    print("WINGSPAN JSON GENERATOR")
    print("Generating birds.json and bonus_cards.json from metadata\n")
    
    # Generate birds.json
    birds = generate_birds_json()
    
    # Generate bonus_cards.json
    bonus_cards = generate_bonus_cards_json()
    
    # Copy images to assets folder
    copy_images_to_assets()
    
    print("\n" + "="*70)
    print("GENERATION COMPLETE!")
    print("="*70)
    print(f"\n Generated:")
    print(f"  data/birds.json ({len(birds)} birds)")
    print(f"  data/bonus_cards.json ({len(bonus_cards)} cards)")
    print(f"  client/public/assets/birds/fronts/ (images)")
    print(f"  client/public/assets/bonus/ (images)")
    print(f"\n NOTE: Some fields like 'habitat' and 'foodCost' are set to defaults.")
    print(f" These would need manual adjustment or image recognition to be accurate.")

if __name__ == "__main__":
    main()
