import json
import csv
from pathlib import Path

def load_csv_birds():
    """Load birds from CSV."""
    birds = []
    csv_file = Path("Wingspan Assets/wingspan_game.csv")
    
    with open(csv_file, encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            birds.append(row)
    return birds

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
        count = bird_csv.get(csv_col, '').strip()
        if count and count.isdigit() and int(count) > 0:
            for _ in range(int(count)):
                food_cost.append(game_name)
    
    # Check for wild food
    wild_count = bird_csv.get('Wild (food)', '').strip()
    if wild_count and wild_count.isdigit() and int(wild_count) > 0:
        for _ in range(int(wild_count)):
            food_cost.append('wild')
    
    return food_cost

# Load CSV
csv_birds = load_csv_birds()

# Find birds with 0 food cost
zero_food_birds = []
for bird in csv_birds:
    total_cost = bird.get('Total food cost', '').strip()
    if total_cost == '0':
        zero_food_birds.append(bird['Common name'])

print(f"Found {len(zero_food_birds)} birds with 0 food cost:")
for name in zero_food_birds[:10]:  # Show first 10
    print(f"  - {name}")

# Load our birds.json
birds_json_file = Path("data/birds.json")
with open(birds_json_file, 'r', encoding='utf-8') as f:
    our_birds = json.load(f)

# Fix Turkey Vulture and Black Vulture specifically
fixed = []
for bird in our_birds:
    if bird['name'] in ['Turkey Vulture', 'Black Vulture']:
        bird['foodCost'] = []
        fixed.append(bird['name'])
        print(f"\nFixed {bird['name']}: foodCost = []")

# Save
with open(birds_json_file, 'w', encoding='utf-8') as f:
    json.dump(our_birds, f, indent=2, ensure_ascii=False)

print(f"\n✅ Fixed {len(fixed)} birds in data/birds.json")
