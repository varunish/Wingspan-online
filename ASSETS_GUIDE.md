# Wingspan Official Assets Guide

## 🎨 How to Use Official Game Assets

Currently, we're using CSS-based visuals. To use official Wingspan assets, you have several options:

### Option 1: Purchase Digital Edition Assets (Recommended)
1. **Steam Workshop** - If you own Wingspan on Steam, you can access some assets
2. **Official Digital Version** - The digital version includes high-quality assets
3. Contact **Stonemaier Games** for licensing inquiries: https://stonemaiergames.com/

### Option 2: Use Community Resources
1. **BoardGameGeek** - Community members sometimes share scanned components (check licensing!)
2. **Fan-made resources** - Some fans create free assets (always respect copyright)
3. **Wingspan Wiki** - May have reference images

### Option 3: Create Original Assets Inspired by Game
- Hire an artist to create similar-style assets
- Use the game's color palette and style as inspiration
- Ensure you're not copying copyrighted elements directly

## 📦 Asset Structure (Ready for Real Assets)

### Current File Structure:
```
client/public/assets/
├── food/
│   ├── invertebrate.svg (or .png)
│   ├── seed.svg
│   ├── fish.svg
│   ├── fruit.svg
│   └── rodent.svg
├── eggs/
│   └── egg.svg
├── dice/
│   ├── invertebrate.svg
│   ├── seed.svg
│   ├── fish.svg
│   ├── fruit.svg
│   └── rodent.svg
├── board/
│   ├── player-mat-forest.jpg
│   ├── player-mat-grassland.jpg
│   ├── player-mat-wetlands.jpg
│   ├── action-cube.png
│   └── background.jpg
└── cards/
    ├── bird-back.jpg
    └── birds/
        ├── bird-1.jpg (Mallard)
        ├── bird-2.jpg (Red-tailed Hawk)
        └── ...
```

## 🔄 How to Replace CSS with Real Assets

### Step 1: Add Images to `client/public/assets/`

### Step 2: Update Components to Use Images Instead of CSS

For example, in `FoodToken.jsx`:
```javascript
// Current (CSS-based):
<div style={{ backgroundColor: color }}>{icon}</div>

// Replace with:
<img src={`/assets/food/${type}.png`} alt={type} />
```

### Step 3: Update `BirdCard.jsx` to Use Bird Images
```javascript
<img 
  src={`/assets/cards/birds/bird-${bird.id}.jpg`} 
  alt={bird.name}
  style={{ width: "100%", height: "auto" }}
/>
```

## 🎯 Priority Assets to Replace

1. **Player Mat Background** - The actual board image for each habitat
2. **Bird Cards** - High-quality bird card images
3. **Food Tokens** - Official food token images
4. **Dice** - Actual dice faces
5. **Egg Tokens** - Official egg tokens
6. **Action Cubes** - Colored cube images

## 📝 Copyright Notice

**Wingspan** is © Stonemaier Games. All game assets, artwork, and design are owned by Stonemaier Games.

This implementation is for educational/personal use. For commercial use or distribution:
- Contact Stonemaier Games for licensing
- Use only original or licensed assets
- Respect all intellectual property rights

## 🔗 Useful Links

- **Stonemaier Games**: https://stonemaiergames.com/
- **Wingspan Official Site**: https://stonemaiergames.com/games/wingspan/
- **Digital Version**: https://store.steampowered.com/app/1054490/Wingspan/
- **Licensing Inquiries**: service@stonemaiergames.com

## 🛠️ Technical Implementation

Once you have the assets, update these files:

1. `client/src/components/FoodToken.jsx` - Replace CSS circles with images
2. `client/src/components/EggToken.jsx` - Use actual egg token image
3. `client/src/components/DiceToken.jsx` - Use dice face images
4. `client/src/components/BirdCard.jsx` - Use real bird card scans/images
5. `client/src/game/HabitatRow.jsx` - Use player mat images as background
6. `client/src/components/ActionCube.jsx` - Use cube images

### Example Code Update:

```javascript
// In FoodToken.jsx
export function FoodToken({ type, size = 32 }) {
  return (
    <img
      src={`/assets/food/${type}.png`}
      alt={type}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
      }}
    />
  );
}
```

## 🎨 Asset Requirements

- **Format**: PNG with transparency (for tokens) or JPG (for backgrounds)
- **Resolution**: 
  - Food tokens: 128x128px minimum
  - Bird cards: 400x600px minimum
  - Player mat: 1920x400px minimum
- **Quality**: 300 DPI for print quality, 150 DPI minimum for web

This guide will help you integrate official assets once you have access to them!
