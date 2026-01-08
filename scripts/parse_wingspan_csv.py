#!/usr/bin/env python3
"""
Parse wingspan_game.csv and match with our extracted bird cards.
Update birds.json with accurate data from CSV.
"""

import csv
import json
from pathlib import Path

def parse_wingspan_csv():
    """Parse the CSV file and understand its structure."""
    csv_path = Path("D:/wingspan-online/Wingspan Assets/wingspan_game.csv")
    
    print("="*70)
    print("PARSING WINGSPAN CSV")
    print("="*70)
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        # Get column names
        columns = reader.fieldnames
        print(f"\nColumns found ({len(columns)}):")
        for i, col in enumerate(columns, 1):
            print(f"  {i}. {col}")
        
        # Read all rows
        birds_data = list(reader)
        print(f"\nTotal birds in CSV: {len(birds_data)}")
        
        # Show first bird as example
        if birds_data:
            print(f"\nExample bird (first row):")
            first_bird = birds_data[0]
            for key, value in first_bird.items():
                if value:  # Only show non-empty values
                    print(f"  {key}: {value}")
        
        return columns, birds_data

def main():
    columns, birds_data = parse_wingspan_csv()
    
    # Save sample for review
    sample_file = Path("wingspan_csv_sample.json")
    with open(sample_file, 'w', encoding='utf-8') as f:
        json.dump({
            'columns': columns,
            'sample_birds': birds_data[:5]  # First 5 birds
        }, f, indent=2, ensure_ascii=False)
    
    print(f"\n Saved sample to: {sample_file}")
    print("\nReview the structure, then we'll match with our cards")

if __name__ == "__main__":
    main()
