#!/usr/bin/env python3
"""
Match our extracted birds with the CSV data and update birds.json accurately.
"""

import csv
import json
from pathlib import Path

def load_csv_birds():
    """Load all birds from CSV."""
    csv_path = Path("D:/wingspan-online/Wingspan Assets/wingspan_game.csv")
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        return list(reader)

def parse_habitats(bird_csv):
    """Extract habitats from CSV row."""
    habitats = []
    if bird_csv.get('Forest') == 'X':
        habitats.append('forest')
    if bird_csv.get('Grassland') == 'X':
        habitats.append('grassland')
    if bird_csv.get('Wetland') == 'X':
        habitats.append('wetland')
    return habitats if habitats else ['forest']  # default

def parse_food_cost(bird_csv):
    """Extract food cost from CSV row."""
    food_cost = []
    
    # Check each food type
    food_types = {
        'Invertebrate': 'invertebrate',
        'Seed': 'seed',
        'Fish': 'fish',
        'Fruit': 'fruit',
        'Rodent': 'rodent'
    }
    
    for csv_col, game_name in food_types.items():
        count = bird_csv.get(csv_col, '')
        if count and count.isdigit():
            for _ in range(int(count)):
                food_cost.append(game_name)
    
    # Check for wild food
    wild_count = bird_csv.get('Wild (food)', '')
    if wild_count and wild_count.isdigit():
        for _ in range(int(wild_count)):
            food_cost.append('wild')
    
    return food_cost if food_cost else ['invertebrate']  # default

def parse_nest_type(bird_csv):
    """Extract nest type from CSV."""
    nest = bird_csv.get('Nest type', '').lower().strip()
    
    # Map CSV values to game values
    nest_map = {
        'platform': 'platform',
        'bowl': 'bowl',
        'cavity': 'cavity',
        'ground': 'ground',
        'star': 'star',
        'wild': 'wild',
        '': 'platform'  # default
    }
    
    return nest_map.get(nest, 'platform')

def update_birds_json():
    """Match our birds with CSV and update birds.json."""
    
    # Load CSV data
    csv_birds = load_csv_birds()
    
    # Create a lookup by common name (case-insensitive)
    # Normalize apostrophes for matching
    def normalize_name(name):
        # Replace various apostrophe characters with standard apostrophe
        name = name.lower()
        name = name.replace(chr(8217), "'")  # right single quotation mark
        name = name.replace(chr(180), "'")   # acute accent
        name = name.replace(chr(65533), "'") # replacement character
        return name
    
    csv_lookup = {}
    for bird in csv_birds:
        name = bird.get('Common name', '').strip()
        if name:
            csv_lookup[normalize_name(name)] = bird
    
    # Load our current birds.json
    birds_json_file = Path("data/birds.json")
    with open(birds_json_file, 'r', encoding='utf-8') as f:
        our_birds = json.load(f)
    
    print("="*70)
    print("UPDATING BIRDS FROM CSV")
    print("="*70)
    
    updated_count = 0
    not_found = []
    
    for bird in our_birds:
        bird_name = normalize_name(bird['name'])
        
        # Try to find in CSV
        if bird_name in csv_lookup:
            csv_bird = csv_lookup[bird_name]
            
            # Update fields
            bird['habitats'] = parse_habitats(csv_bird)
            bird['foodCost'] = parse_food_cost(csv_bird)
            bird['nestType'] = parse_nest_type(csv_bird)
            
            # Update egg capacity
            egg_cap = csv_bird.get('Egg capacity', '')
            if egg_cap and egg_cap.isdigit():
                bird['eggCapacity'] = int(egg_cap)
            
            # Verify points and wingspan
            csv_points = csv_bird.get('Victory points', '')
            csv_wingspan = csv_bird.get('Wingspan', '')
            
            if csv_points and csv_points.isdigit():
                bird['points'] = int(csv_points)
            if csv_wingspan and csv_wingspan.isdigit():
                bird['wingspan'] = int(csv_wingspan)
            
            # Update power text if available
            power_text = csv_bird.get('Power text', '').strip()
            power_category = csv_bird.get('PowerCategory', '').strip()
            
            if power_text and power_category:
                # Map power category to our format
                power_type_map = {
                    'brown': 'WHEN_ACTIVATED',
                    'when played': 'WHEN_PLAYED',
                    'pink': 'ONCE_BETWEEN_TURNS',
                    'white': 'PASSIVE'
                }
                power_type = power_type_map.get(power_category.lower(), 'WHEN_ACTIVATED')
                
                bird['power'] = {
                    'type': power_type,
                    'effect': power_text
                }
            
            print(f" {bird['name']} - Updated!")
            print(f"    Habitat: {bird['habitats']}")
            print(f"    Food: {bird['foodCost']}")
            print(f"    Nest: {bird['nestType']}, Eggs: {bird['eggCapacity']}")
            print(f"    Points: {bird['points']}, Wingspan: {bird['wingspan']}cm")
            
            updated_count += 1
        else:
            not_found.append(bird['name'])
            print(f"  WARNING: '{bird['name']}' not found in CSV")
    
    # Save updated birds.json
    with open(birds_json_file, 'w', encoding='utf-8') as f:
        json.dump(our_birds, f, indent=2, ensure_ascii=False)
    
    print("\n" + "="*70)
    print(f"COMPLETE: Updated {updated_count}/{len(our_birds)} birds")
    if not_found:
        print(f"Not found in CSV: {', '.join(not_found)}")
    print("="*70)
    print(" Saved to: data/birds.json")

if __name__ == "__main__":
    update_birds_json()
