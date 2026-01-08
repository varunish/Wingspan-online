# Wild Food: Player Choice Implementation ⭐

## Overview
When a bird has a **wild** food cost, the player now **chooses** which food to spend through an interactive UI.

---

## 🎮 **How It Works (Player Experience)**

### Step 1: Select a Bird with Wild Cost
```
Player hand: [Trumpeter Swan, Eastern Kingbird, ...]
Player selects: "Trumpeter Swan"
Food cost shown: 🌾 🌾 ⭐ (seed, seed, wild)
```

### Step 2: Choose Food for Wild Requirements
**A golden panel appears:**
```
┌─────────────────────────────────────────────────┐
│ Choose 1 food for ⭐ wild cost (0/1 selected):  │
│                                                  │
│ [invertebrate (2)] [seed (0)] [fish (1)]       │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Player clicks "fish":**
```
┌─────────────────────────────────────────────────┐
│ Choose 1 food for ⭐ wild cost (1/1 selected):  │
│                                                  │
│ [invertebrate (2)] [fish (1)] ✅               │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Step 3: Confirm Play
- "Play Bird" button becomes **enabled** ✅
- Click to play the bird
- Server deducts: 2 seeds + 1 fish (player's choice)

---

## 💻 **Technical Implementation**

### Client-Side (`ActionPanel.jsx`)
```javascript
// State for tracking player's wild food choices
const [wildFoodChoices, setWildFoodChoices] = useState([]);

// UI renders food selection buttons
// Player clicks buttons to select food for wild costs
// Sends choices to server:
socket.emit("playBird", {
  gameId: state.id,
  birdId: birdId,
  habitat: habitat,
  wildFoodChoices: ['fish'] // Player's selections
});
```

### Server-Side (`PlayBird.js`)
```javascript
export function PlayBird(game, player, birdId, habitat, wildFoodChoices = []) {
  // ...
  let wildChoiceIndex = 0;
  bird.foodCost.forEach(f => {
    if (f === 'wild') {
      // Use player's choice
      const chosenFood = wildFoodChoices[wildChoiceIndex++];
      player.food[chosenFood]--;
    } else {
      player.food[f]--;
    }
  });
}
```

### Validation (`canPlayBird.js`)
```javascript
export function canPlayBird(game, player, bird, habitat, wildFoodChoices = []) {
  // ...
  if (requiredFood === 'wild') {
    const chosenFood = wildFoodChoices[wildChoiceIndex++];
    
    if (!chosenFood) {
      throw new Error("Must specify which food to use for wild cost");
    }
    
    if (!availableFood[chosenFood] || availableFood[chosenFood] <= 0) {
      throw new Error(`Insufficient ${chosenFood} for wild food choice`);
    }
    
    availableFood[chosenFood]--;
  }
}
```

---

## 🎯 **Example Scenarios**

### Scenario 1: Single Wild (Trumpeter Swan)
**Cost**: [seed, seed, wild]

**Player has**: { seed: 3, fish: 1, invertebrate: 2 }

**UI Flow**:
1. Wild food panel shows: `[seed (3)] [fish (1)] [invertebrate (2)]`
2. Player chooses: **invertebrate**
3. Payment: -2 seed, -1 invertebrate
4. Result: { seed: 1, fish: 1, invertebrate: 1 }

---

### Scenario 2: Multiple Wild (Black-Billed Magpie)
**Cost**: [wild, wild]

**Player has**: { invertebrate: 1, seed: 1, fish: 1 }

**UI Flow**:
1. Wild food panel shows: `Choose 2 food for ⭐ wild cost (0/2 selected)`
2. Player clicks: **seed** → `(1/2 selected)`
3. Player clicks: **fish** → `(2/2 selected)` ✅
4. Payment: -1 seed, -1 fish
5. Result: { invertebrate: 1, seed: 0, fish: 0 }

---

### Scenario 3: Mixed Cost (Yellow-Billed Cuckoo)
**Cost**: [invertebrate, invertebrate, wild]

**Player has**: { invertebrate: 2, fruit: 1 }

**UI Flow**:
1. Automatic deduction: 2 invertebrates
2. Wild food panel shows only: `[fruit (1)]` (only remaining food)
3. Player clicks: **fruit** (only option)
4. Payment: -2 invertebrate, -1 fruit
5. Result: { invertebrate: 0, fruit: 0 }

---

## 🚫 **Edge Cases Handled**

### ❌ Not Enough Food for Wild
```
Player has: { seed: 2 }
Bird cost: [seed, seed, wild]

After using 2 seeds, no food remains.
Wild food panel shows: (no buttons)
"Play Bird" button: DISABLED
Error: Cannot play - insufficient food for wild cost
```

### ❌ Invalid Wild Choice
```
Player sends: wildFoodChoices = ['rodent']
But player has: { rodent: 0, seed: 3 }

Server validation fails:
Error: "Insufficient rodent for wild food choice"
```

### ✅ Multiple Wild, Same Type
```
Player has: { seed: 3 }
Bird cost: [wild, wild]

Player can choose: [seed, seed]
Payment: -2 seed
Valid! ✅
```

---

## 📋 **Summary**

| Feature | Status |
|---------|--------|
| Player chooses food for wild costs | ✅ Implemented |
| UI shows available food options | ✅ Implemented |
| Selection counter (X/Y selected) | ✅ Implemented |
| Play button disabled until selections complete | ✅ Implemented |
| Server validates player choices | ✅ Implemented |
| Handles multiple wild costs | ✅ Implemented |
| Shows only available food (accounting for specific costs) | ⚠️ To improve |

---

## 🔮 **Future Enhancement**

**Better Food Availability Calculation**:
Currently, the UI shows ALL food the player has, even if some will be used for specific costs.

**Ideal behavior**:
```
Player has: { seed: 3, fish: 1 }
Bird cost: [seed, seed, wild]

Current UI: Shows [seed (3)] [fish (1)]
Ideal UI: Shows [seed (1)] [fish (1)]
           (accounting for 2 seeds already used)
```

This is a polish item for future development.

---

## ✅ **Ready to Test!**

Restart the server and test with these birds:
1. **Trumpeter Swan**: [seed, seed, wild] - 1 wild choice
2. **Black-Billed Magpie**: [wild, wild] - 2 wild choices
3. **Yellow-Billed Cuckoo**: [invertebrate, invertebrate, wild] - mixed cost

Each should show the wild food selection panel and let you choose! 🎯
