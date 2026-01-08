# Wingspan Asset Integration Guide

## 📦 Integrating Official Game Assets

Since you have permission from the publisher, here's how to integrate the official Wingspan assets into your online implementation.

---

## 1. Asset Acquisition & Organization

### **Where to Get Official Assets:**

1. **From Publisher/Designer:**
   - Contact Stonemaier Games directly
   - Request high-resolution digital assets
   - Get licensing documentation

2. **From Digital Version:**
   - If you own the Steam version, assets may be extractable
   - Check game installation folder
   - Respect terms of use

3. **Scan Physical Components:**
   - Use high-quality scanner (300+ DPI)
   - Photograph with good lighting
   - Process images for web use

### **Recommended Asset Structure:**

```
client/public/assets/
├── birds/
│   ├── american-robin.jpg
│   ├── blue-jay.jpg
│   ├── mallard.jpg
│   └── ... (all bird cards)
├── food/
│   ├── invertebrate.png
│   ├── seed.png
│   ├── fish.png
│   ├── fruit.png
│   └── rodent.png
├── eggs/
│   └── egg.png
├── dice/
│   ├── d1-invertebrate.png
│   ├── d2-seed.png
│   └── ... (dice faces)
├── board/
│   ├── player-mat.jpg
│   ├── player-mat-forest.jpg
│   ├── player-mat-grassland.jpg
│   ├── player-mat-wetlands.jpg
│   └── scoring-mat.jpg
├── bonus-cards/
│   ├── bonus-1.jpg
│   └── ... (all bonus cards)
├── ui/
│   ├── background.jpg
│   ├── logo.png
│   └── action-cube.png
└── audio/ (optional)
    ├── place-bird.mp3
    ├── gain-food.mp3
    └── ...
```

---

## 2. Image Processing Requirements

### **Optimal Specifications:**

| Asset Type | Resolution | Format | File Size |
|------------|-----------|--------|-----------|
| Bird Cards | 400×600px | JPG/WebP | <100KB |
| Food Tokens | 128×128px | PNG | <20KB |
| Egg Tokens | 96×96px | PNG | <15KB |
| Dice Faces | 128×128px | PNG | <25KB |
| Player Mat | 1920×400px | JPG/WebP | <200KB |
| Background | 1920×1080px | JPG/WebP | <300KB |

### **Processing Steps:**

```bash
# Install ImageMagick for batch processing
brew install imagemagick  # macOS
sudo apt install imagemagick  # Linux

# Resize all bird cards to 400x600
for file in birds/*.jpg; do
  convert "$file" -resize 400x600 -quality 85 "processed/$file"
done

# Create thumbnails for compact view
for file in birds/*.jpg; do
  convert "$file" -resize 200x300 -quality 85 "thumbnails/$file"
done

# Optimize PNG files
for file in food/*.png; do
  pngquant --quality=80-90 "$file" --output "optimized/$file"
done
```

---

## 3. Code Integration

### **Step 1: Update BirdCard Component**

```javascript
// client/src/components/BirdCard.jsx

export function BirdCard({ bird, onClick, selected, compact = false }) {
  const imagePath = `/assets/birds/${bird.id}.jpg`;

  return (
    <div
      onClick={onClick}
      style={{
        width: compact ? 200 : 400,
        height: compact ? 300 : 600,
        cursor: onClick ? "pointer" : "default",
        border: selected ? "4px solid #FFD700" : "2px solid #333",
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
        boxShadow: selected
          ? "0 8px 16px rgba(255,215,0,0.6)"
          : "0 4px 8px rgba(0,0,0,0.3)"
      }}
    >
      {/* Use actual bird card image */}
      <img
        src={imagePath}
        alt={bird.name}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover"
        }}
        onError={(e) => {
          // Fallback if image not found
          e.target.style.display = "none";
          e.target.parentElement.innerHTML = `
            <div style="
              width: 100%;
              height: 100%;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              text-align: center;
              padding: 20px;
            ">
              ${bird.name}
            </div>
          `;
        }}
      />

      {/* Overlay for egg count if needed */}
      {bird.eggs > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "#fff",
            padding: "4px 12px",
            borderRadius: 16,
            fontSize: compact ? "0.9em" : "1.1em",
            fontWeight: "bold"
          }}
        >
          🥚 {bird.eggs}
        </div>
      )}
    </div>
  );
}
```

### **Step 2: Update FoodToken Component**

```javascript
// client/src/components/FoodToken.jsx

export function FoodToken({ type, size = 32 }) {
  const imagePath = `/assets/food/${type}.png`;

  return (
    <img
      src={imagePath}
      alt={type}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        objectFit: "cover"
      }}
      onError={(e) => {
        // Fallback to emoji if image not found
        e.target.style.display = "none";
        const emoji = {
          invertebrate: "🐛",
          seed: "🌾",
          fish: "🐟",
          fruit: "🍒",
          rodent: "🐭"
        }[type];
        e.target.parentElement.innerHTML = emoji;
      }}
    />
  );
}
```

### **Step 3: Update HabitatRow with Background Image**

```javascript
// client/src/game/HabitatRow.jsx

export function HabitatRow({ habitat, birds, ... }) {
  const backgroundImage = `/assets/board/player-mat-${habitat}.jpg`;

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative"
      }}
    >
      {/* Overlay for better card visibility */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255,255,255,0.85)"
        }}
      />

      {/* Content on top of overlay */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Your existing habitat row content */}
      </div>
    </div>
  );
}
```

---

## 4. Loading & Caching Strategy

### **Preload Critical Assets**

```javascript
// client/src/utils/assetPreloader.js

export async function preloadAssets() {
  const criticalAssets = [
    // Food tokens (always visible)
    "/assets/food/invertebrate.png",
    "/assets/food/seed.png",
    "/assets/food/fish.png",
    "/assets/food/fruit.png",
    "/assets/food/rodent.png",
    
    // Dice
    ...Array.from({ length: 5 }, (_, i) => `/assets/dice/d${i+1}.png`),
    
    // UI elements
    "/assets/ui/background.jpg",
    "/assets/ui/logo.png"
  ];

  const promises = criticalAssets.map(src => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = src;
    });
  });

  return Promise.all(promises);
}

// In App.jsx
useEffect(() => {
  preloadAssets().then(() => {
    setAssetsLoaded(true);
  });
}, []);
```

### **Lazy Load Bird Cards**

```javascript
// Only load bird cards as needed
export function LazyBirdCard({ bird, ...props }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <BirdCard
      bird={bird}
      {...props}
      onImageLoad={() => setLoaded(true)}
    />
  );
}
```

---

## 5. Performance Optimization

### **Use WebP Format:**

```javascript
// Detect WebP support
const supportsWebP = document.createElement('canvas')
  .toDataURL('image/webp')
  .indexOf('data:image/webp') === 0;

const getImagePath = (path) => {
  if (supportsWebP) {
    return path.replace(/\.(jpg|png)$/, '.webp');
  }
  return path;
};
```

### **Implement Progressive Loading:**

```javascript
export function ProgressiveImage({ src, placeholder, alt }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <img
        src={placeholder}
        alt={alt}
        style={{
          display: loaded ? "none" : "block",
          filter: "blur(10px)"
        }}
      />
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        style={{
          display: loaded ? "block" : "none"
        }}
      />
    </>
  );
}
```

---

## 6. Asset Manifest

Create a manifest file for easy management:

```javascript
// client/src/assets/manifest.js

export const ASSET_MANIFEST = {
  birds: {
    "bird-1": { name: "Mallard", file: "mallard.jpg" },
    "bird-2": { name: "Red-tailed Hawk", file: "red-tailed-hawk.jpg" },
    // ... all birds
  },
  food: {
    invertebrate: "invertebrate.png",
    seed: "seed.png",
    fish: "fish.png",
    fruit: "fruit.png",
    rodent: "rodent.png"
  },
  ui: {
    background: "background.jpg",
    logo: "logo.png",
    actionCube: "action-cube.png"
  }
};

export function getAssetPath(category, id) {
  return `/assets/${category}/${ASSET_MANIFEST[category][id]}`;
}
```

---

## 7. Legal Considerations

### **Include Proper Attribution:**

```javascript
// Add to footer or about section
<div>
  Wingspan © Stonemaier Games
  <br />
  Used with permission
  <br />
  Art by Beth Sobel, Natalia Rojas, Ana Maria Martinez Jaramillo
</div>
```

### **License Documentation:**

Create a `LICENSE_ASSETS.md` file documenting:
- Permission received from Stonemaier Games
- Scope of use (non-commercial, educational, etc.)
- Attribution requirements
- Contact information

---

## 8. Testing Checklist

- [ ] All bird cards load correctly
- [ ] Food/egg tokens display properly
- [ ] Dice faces render clearly
- [ ] Board backgrounds fit correctly
- [ ] Images load on mobile devices
- [ ] Fallbacks work when images missing
- [ ] Performance is acceptable (< 3s load time)
- [ ] Images cached properly
- [ ] Retina displays supported

---

**You're now ready to integrate official Wingspan assets!** 🎨

This will make your implementation look professional and match the physical game experience. The key is proper organization, optimization, and graceful fallbacks.
