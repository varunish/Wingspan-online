#!/usr/bin/env python3
"""
Re-parse bird card text data correctly and update birds.json.
Fix the points and other data that was incorrectly parsed.
"""

import json
import re
from pathlib import Path

def parse_bird_card_correctly(text):
    """
    Parse bird card text with correct logic.
    Format:
    Line 1: Bird Name
    Line 2: Scientific Name  
    Lines 3-N: Flavor text
    Then: wingspan (e.g., "203cm")
    Then: points (single digit number after wingspan)
    Then: power text (optional)
    """
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    
    # Bird name is first line
    name = lines[0] if lines else "Unknown"
    
    # Find wingspan (pattern: number followed by "cm")
    wingspan_match = re.search(r'(\d+)cm', text)
    wingspan = int(wingspan_match.group(1)) if wingspan_match else 50
    
    # Find points: it's the standalone number AFTER wingspan but BEFORE power keywords
    # Look for a line that's just a number (1-9)
    points = 3  # default
    for i, line in enumerate(lines):
        if line.isdigit() and 1 <= int(line) <= 10:
            # Make sure it's not the wingspan number
            if f"{line}cm" not in text:
                points = int(line)
                break
    
    # Determine power type
    power = None
    if 'WHEN ACTIVATED:' in text:
        power_text = text.split('WHEN ACTIVATED:')[1]
        power_text = re.split(r'BirdCards_|Wingspan_', power_text)[0].strip()
        power = {
            'type': 'WHEN_ACTIVATED',
            'effect': power_text
        }
    elif 'when played:' in text.lower():
        power_text = re.split(r'when played:', text, flags=re.IGNORECASE)[1]
        power_text = re.split(r'BirdCards_|Wingspan_', power_text)[0].strip()
        power = {
            'type': 'WHEN_PLAYED',
            'effect': power_text
        }
    elif 'ONCE BETWEEN TURNS:' in text:
        power_text = text.split('ONCE BETWEEN TURNS:')[1]
        power_text = re.split(r'BirdCards_|Wingspan_', power_text)[0].strip()
        power = {
            'type': 'ONCE_BETWEEN_TURNS',
            'effect': power_text
        }
    
    return {
        'name': name,
        'wingspan': wingspan,
        'points': points,
        'power': power
    }

def fix_birds_json():
    """Update birds.json with correctly parsed data."""
    
    # Load metadata
    metadata_file = Path("temp_extracted/birds/_metadata.json")
    with open(metadata_file, 'r', encoding='utf-8') as f:
        metadata = json.load(f)
    
    # Load current birds.json
    birds_json_file = Path("data/birds.json")
    with open(birds_json_file, 'r', encoding='utf-8') as f:
        birds = json.load(f)
    
    print("="*70)
    print("FIXING BIRD DATA")
    print("="*70)
    
    # Track unique pages (each page = one bird)
    seen_pages = set()
    bird_index = 0
    
    for item in metadata:
        page = item['page']
        
        # Skip duplicates (same page)
        if page in seen_pages or page == 22:  # Skip page 22 (invalid)
            continue
        seen_pages.add(page)
        
        # Parse the text correctly
        parsed = parse_bird_card_correctly(item['page_text'])
        
        # Update the corresponding bird in birds.json
        if bird_index < len(birds):
            old_points = birds[bird_index]['points']
            old_wingspan = birds[bird_index]['wingspan']
            
            birds[bird_index]['points'] = parsed['points']
            birds[bird_index]['wingspan'] = parsed['wingspan']
            
            if parsed['power']:
                birds[bird_index]['power'] = parsed['power']
            
            # Show what changed
            changes = []
            if old_points != parsed['points']:
                changes.append(f"points: {old_points} -> {parsed['points']}")
            if old_wingspan != parsed['wingspan']:
                changes.append(f"wingspan: {old_wingspan} -> {parsed['wingspan']}")
            
            if changes:
                print(f"{bird_index + 1}. {parsed['name']}: {', '.join(changes)}")
            else:
                print(f"{bird_index + 1}. {parsed['name']}: OK")
        
        bird_index += 1
    
    # Save updated birds.json
    with open(birds_json_file, 'w', encoding='utf-8') as f:
        json.dump(birds, f, indent=2, ensure_ascii=False)
    
    print(f"\n Updated {bird_index} birds in birds.json")
    print(" Saved to: data/birds.json")

if __name__ == "__main__":
    fix_birds_json()
