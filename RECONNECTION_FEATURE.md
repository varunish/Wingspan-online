# Reconnection Feature Documentation

## Overview
Players can now reconnect to ongoing games if they refresh their browser or accidentally close the tab. The game preserves their state and allows them to rejoin seamlessly.

## How It Works

### Automatic Reconnection
1. **Session Storage**: When a player joins or creates a lobby, their player name and lobby ID are stored in `localStorage`
2. **On Refresh**: When the page reloads, the app automatically detects the saved session
3. **Reconnect Attempt**: The app attempts to reconnect to the saved game using the stored credentials
4. **State Restoration**: If successful, the player is placed back into the game at the current state

### Manual Reconnection
If a player clears their browser data or uses a different device, they can manually reconnect:
1. **Join Lobby**: Use the "Join Lobby" button on the main screen
2. **Enter Same Details**: Use the exact same player name and lobby code as before
3. **Rejoin**: The system will recognize them and restore their position in the game

### Leave Game Feature
Players can manually leave a game using the "Leave Game" button:
- Located in the top-right corner during gameplay
- Clears session data from localStorage
- Notifies other players of the departure
- Player can rejoin later using manual reconnection

## Technical Implementation

### Client-Side (App.jsx)
- **Session Storage**: `localStorage` stores `wingspan_lobbyId` and `wingspan_playerName`
- **Reconnection UI**: Shows a "Reconnecting..." screen during automatic reconnection
- **Event Handlers**: Listens for `reconnectSuccess` and `reconnectError` events

### Server-Side (socket.js)
- **`reconnectToGame` Event**: Handles reconnection requests
  - Validates game and player existence
  - Updates player's socket ID
  - Restores player to game state
  - Notifies all players of reconnection

### Game State Preservation
- **Player Data**: All player state (birds, eggs, food, cards) is preserved
- **Game Progress**: Current round, turn order, and game phase are maintained
- **Action Cubes**: Player's remaining actions are preserved

## Benefits

### For Players
✅ No loss of progress on accidental disconnection
✅ Can close and return to games without penalty
✅ Multi-device play (if using same credentials)
✅ Transparent reconnection process

### For Game Integrity
✅ No duplicate players
✅ No ghost players
✅ Turn order maintained
✅ All game state preserved

## Error Handling

### Reconnection Fails If:
- **Game Not Found**: Lobby ID doesn't exist or game ended
- **Player Not Found**: Player name doesn't match any player in the game
- **Invalid Session**: Corrupted localStorage data

### Fallback Behavior:
- Session data is cleared
- Player returns to lobby screen
- Can join a new game or create one

## Security Considerations

### Session Validation
- Player name must exactly match original name
- Lobby ID must be valid and active
- Only updates socket ID, doesn't create new player slots

### Duplicate Prevention
- Same player cannot connect twice with different socket IDs
- Reconnection updates existing player, doesn't create duplicate

## User Experience Flow

### Scenario 1: Browser Refresh
```
1. Player refreshes browser
2. "Reconnecting to game..." screen appears (2-3 seconds)
3. Player is restored to game at current state
4. Game continues normally
```

### Scenario 2: Manual Leave and Rejoin
```
1. Player clicks "Leave Game" button
2. Confirmation dialog: "Are you sure you want to leave?"
3. Player confirms → Returned to lobby screen
4. Player notes lobby code and their player name
5. Later: Uses "Join Lobby" with same credentials
6. Successfully rejoins the game
```

### Scenario 3: Connection Lost
```
1. Player loses internet connection
2. Socket disconnects
3. Game logs: "[Player Name] disconnected"
4. Other players continue playing
5. Player reconnects → Automatically restored
6. Game logs: "[Player Name] reconnected"
7. Player can continue their turn or wait for their next turn
```

## Testing Checklist

### Automatic Reconnection
- [ ] Create game → Refresh browser → Should rejoin automatically
- [ ] Join game → Refresh browser → Should rejoin automatically
- [ ] Reconnection shows loading screen
- [ ] All game state is preserved after reconnection

### Manual Reconnection
- [ ] Leave game → Rejoin with same name/code → Success
- [ ] Try to rejoin with wrong name → Error
- [ ] Try to rejoin non-existent lobby → Error

### Multi-Player Scenarios
- [ ] Player 1 disconnects → Player 2 sees disconnect message
- [ ] Player 1 reconnects → Player 2 sees reconnect message
- [ ] Disconnected player's state preserved during their absence

### Edge Cases
- [ ] Game ends while player disconnected → Reconnection fails gracefully
- [ ] Multiple players disconnect and reconnect in sequence
- [ ] Player tries to reconnect to finished game → Clear error message

## Future Enhancements

### Potential Improvements
1. **Timeout System**: Auto-remove players who don't reconnect within X minutes
2. **Guest Mode**: Allow spectators to watch ongoing games
3. **Session Expiry**: Add expiration time to localStorage data
4. **Reconnection History**: Track disconnection/reconnection frequency
5. **Pause Game**: Allow host to pause while waiting for reconnection
6. **AI Replacement**: Temporarily replace disconnected player with AI

## Code Files Modified

### New Features
- `server/lobby/Lobby.js`: Added `reconnectPlayer()` and `disconnectPlayer()` methods
- `server/socket.js`: Added `reconnectToGame` event handler
- `client/src/App.jsx`: Added automatic reconnection logic and UI
- `client/src/components/LobbyScreen.jsx`: Added localStorage saving on join/create
- `client/src/game/GameView.jsx`: Added "Leave Game" button

### Integration Points
- Socket.IO events: `reconnectToGame`, `reconnectSuccess`, `reconnectError`
- localStorage keys: `wingspan_lobbyId`, `wingspan_playerName`
- Game state serialization: Already supports full state restoration

## Conclusion

This reconnection feature significantly improves the user experience by allowing seamless recovery from disconnections. It's especially valuable for:
- Long games (Wingspan can take 60-90 minutes)
- Mobile players (connection may be unstable)
- Accidental tab closures
- Browser crashes or updates

The implementation is robust, secure, and transparent to players while maintaining game integrity.
