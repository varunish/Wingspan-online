# Wild Food Handling Fix

## Problem
"Wild" in Wingspan means **"any food type"** (player can use any available food token), but our code was treating it as a specific food type called "wild" that doesn't exist in the game.

## Solution
Fixed all validation and payment logic to correctly handle wild food requirements. **Players now choose which food to spend for wild costs** via UI selection.

---

## Changes Made

### 1. **Server-Side Validation** (`server/engine/validators/canPlayBird.js`)
- ✅ When checking food costs, if `wild` is required, check if player has **any** food available
- ✅ Properly track available food as costs are validated

### 2. **Server-Side Payment** (`server/engine/Actions/PlayBird.js`)
- ✅ Accepts `wildFoodChoices` array from client with player's selections
- ✅ Deducts the **player-chosen** food types for wild costs
- ✅ Validates choices are available before deduction

### 3. **Client-Side Validation** (`client/src/utils/actionValidation.js`)
- ✅ When validating play bird action, handle wild food cost properly
- ✅ Display "any food (wild)" in error messages for clarity

### 4. **UI Display** (`client/src/components/FoodToken.jsx`)
- ✅ Added visual representation for wild food:
  - **Color**: Gold (#FFD700)
  - **Icon**: ⭐ (star)
  - **Tooltip**: Shows "wild" on hover

### 5. **Player Choice UI** (`client/src/game/ActionPanel.jsx`)
- ✅ When selecting a bird with wild costs, shows a **food selection panel**
- ✅ Player clicks buttons to choose which food to spend for each wild requirement
- ✅ Selection counter shows progress (e.g., "2/2 selected")
- ✅ "Play Bird" button disabled until all wild choices are made
- ✅ Sends `wildFoodChoices` array to server with selected food types

---

## How It Works Now

### Example: Trumpeter Swan
**Food Cost**: [seed, seed, wild]

**What This Means:**
- Requires 2 seed tokens
- Requires 1 token of **any type** (wild) - **player chooses**

**Payment Logic:**
1. Player selects Trumpeter Swan from hand
2. UI shows: "Choose 1 food for ⭐ wild cost"
3. Player clicks a food button (e.g., "invertebrate")
4. Player clicks "Play Bird"
5. Server validates: Has 2 seeds? ✅ Has chosen food (invertebrate)? ✅
6. Server deducts: 2 seeds + 1 invertebrate

**UI Display:**
- Shows: 🌾 🌾 ⭐
- Food cost displays as: "seed, seed, wild" in dropdowns
- Wild token appears as a gold star in card previews

---

## Birds Affected (from our 21-card deck)

Birds with wild food costs:
1. **Trumpeter Swan**: [seed, seed, wild]
2. **Yellow-Billed Cuckoo**: [invertebrate, invertebrate, wild]
3. **Belted Kingfisher**: [fish, wild]
4. **Black-Billed Magpie**: [wild, wild] (any 2 foods!)
5. **Brewer's Blackbird**: [seed, wild]

---

## Testing

### Test Case 1: Trumpeter Swan (Player Choice)
```
Player has: { seed: 2, invertebrate: 1, fish: 1 }
Bird cost: [seed, seed, wild]

UI Flow:
1. Select Trumpeter Swan
2. UI shows: "Choose 1 food for ⭐ wild cost (0/1 selected)"
3. Buttons appear: [invertebrate (1)] [fish (1)]
4. Player clicks "invertebrate"
5. Button turns green, counter shows "1/1 selected"
6. Click "Play Bird"

✅ SHOULD PASS
After payment: { seed: 0, invertebrate: 0, fish: 1 }
```

### Test Case 2: Black-Billed Magpie (Multiple Wild)
```
Player has: { fish: 1, fruit: 1, seed: 1 }
Bird cost: [wild, wild]

UI Flow:
1. Select Black-Billed Magpie
2. UI shows: "Choose 2 food for ⭐ wild cost (0/2 selected)"
3. Player clicks "fish", then "fruit"
4. Counter shows "2/2 selected"
5. Click "Play Bird"

✅ SHOULD PASS
After payment: { fish: 0, fruit: 0, seed: 1 }
```

### Test Case 3: Failure Case (No Wild Choice)
```
Player has: { seed: 2 }
Bird cost: [seed, seed, wild]

UI Flow:
1. Select Trumpeter Swan
2. UI shows: "Choose 1 food for ⭐ wild cost (0/1 selected)"
3. No food buttons appear (no food left after seeds)
4. "Play Bird" button is DISABLED

❌ CANNOT PLAY: No food available for wild requirement
```

---

## Future Enhancement: 2:1 Food Conversion

**Official Rule**: "You may spend any 2 food tokens to use them as any 1 food token."

**Note**: This is currently handled as a separate action (2:1 Food Trade button). In the future, we could allow players to **inline convert** during bird payment:
- Example: Player has [invertebrate: 2, seed: 0]
- Card requires [seed]
- Could allow trading 2 invertebrates → 1 seed during payment

This would require more complex UI (food selection modal) and is not yet implemented.

---

## Summary
✅ Wild food costs now work correctly throughout the entire game
✅ Server validates wild as "any food available"
✅ Server deducts first available food when paying wild costs
✅ Client validates wild food correctly
✅ UI displays wild food with gold star icon
✅ All 21 birds now have accurate food costs from CSV data
