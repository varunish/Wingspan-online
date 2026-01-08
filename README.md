# 🦅 Wingspan Online

A full-featured online multiplayer implementation of the award-winning board game **Wingspan** by Stonemaier Games.

![Wingspan](https://img.shields.io/badge/Players-2--5-blue)
![Duration](https://img.shields.io/badge/Duration-60--90%20min-green)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow)

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Game Rules](#game-rules)
- [Contributing](#contributing)
- [License](#license)

---

## 🎮 About

Wingspan Online is a faithful digital implementation of the popular bird-collection, engine-building board game. Players compete to attract the best birds to their wildlife preserves through strategic card play, resource management, and engine building over 4 rounds.

This implementation features:
- Real-time multiplayer gameplay
- Server-authoritative game state
- Professional UI matching the physical game aesthetic
- Complete rule implementation including bird powers, round goals, and scoring

---

## ✨ Features

### Core Gameplay
- ✅ **Complete rule implementation** - All official Wingspan mechanics
- ✅ **4 habitat actions** - Gain Food, Lay Eggs, Draw Cards, Play Bird
- ✅ **Bird powers** - When Activated, When Played, and other power types
- ✅ **Round goals** - Competitive scoring each round with action cube placement
- ✅ **Bonus cards** - End-game scoring objectives
- ✅ **Resource management** - Food conversion (2:1), habitat exchanges
- ✅ **Egg costs** - Strategic placement in habitat columns

### Multiplayer
- ✅ **2-5 players** - Full player count support
- ✅ **Real-time synchronization** - Socket.IO powered
- ✅ **Lobby system** - Create or join games with 6-digit codes
- ✅ **Turn-based gameplay** - Server validates all actions

### UI/UX
- ✅ **Professional lobby** - Modern gradient design with player avatars
- ✅ **Setup phase** - Visual bird and bonus card selection
- ✅ **Game board** - Habitat rows matching official player mat
- ✅ **Round goal tracker** - Visual scoring board with action cubes
- ✅ **Hand management** - Full bird cards displayed
- ✅ **Error feedback** - Toast notifications for invalid actions
- ✅ **Tooltips** - Helpful information on hover

---

## 📦 Prerequisites

Before running Wingspan Online, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (for cloning the repository)

Check your versions:
```bash
node --version  # Should be v18+
npm --version   # Should be 8+
```

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/wingspan-online.git
cd wingspan-online
```

### 2. Install Dependencies

#### Server Dependencies
```bash
npm install
```

#### Client Dependencies
```bash
cd client
npm install
cd ..
```

---

## 🎯 Running Locally

### Quick Start (Both Server & Client)

#### Option 1: Run Both in Separate Terminals

**Terminal 1 - Start the Server:**
```bash
node server/index.js
```
Server will start on `http://localhost:3000`

**Terminal 2 - Start the Client:**
```bash
cd client
npm run dev
```
Client will start on `http://localhost:5173` (or next available port)

#### Option 2: Using npm Scripts (if configured)

```bash
# Start server
npm run server

# In a new terminal, start client
npm run client
```

### 3. Access the Game

1. Open your browser and navigate to: `http://localhost:5173`
2. Enter your name
3. Create a lobby or join with a 6-digit code
4. Share the lobby code with friends
5. Host starts the game when ready
6. Enjoy playing Wingspan!

---

## 📁 Project Structure

```
wingspan-online/
├── client/                      # React frontend (Vite)
│   ├── public/
│   │   └── assets/             # Game assets (birds, food, board)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ActionCube.jsx
│   │   │   ├── BirdCard.jsx
│   │   │   ├── DiceToken.jsx
│   │   │   ├── EggToken.jsx
│   │   │   ├── FoodToken.jsx
│   │   │   ├── LobbyScreen.jsx
│   │   │   └── Toast.jsx
│   │   ├── game/               # Game screens
│   │   │   ├── ActionPanel.jsx
│   │   │   ├── GameOverScreen.jsx
│   │   │   ├── GameShell.jsx
│   │   │   ├── HabitatRow.jsx
│   │   │   ├── PlayerBoard.jsx
│   │   │   ├── PlayScreen.jsx
│   │   │   ├── RoundGoalScorer.jsx
│   │   │   ├── SetupScreen.jsx
│   │   │   └── SharedBoard.jsx
│   │   ├── hooks/              # Custom React hooks
│   │   │   └── useToast.js
│   │   ├── network/            # Socket.IO client
│   │   │   └── socket.js
│   │   ├── utils/              # Utility functions
│   │   │   └── actionValidation.js
│   │   └── App.jsx             # Main app component
│   └── package.json
│
├── server/                      # Node.js backend
│   ├── engine/                 # Game engine
│   │   ├── Actions/            # Game actions
│   │   │   ├── ConvertFood.js
│   │   │   ├── DrawCards.js
│   │   │   ├── ExchangeResource.js
│   │   │   ├── GainFood.js
│   │   │   ├── LayEggs.js
│   │   │   └── PlayBird.js
│   │   ├── Powers/             # Bird power system
│   │   │   ├── PowerEngine.js
│   │   │   └── WhenActivated.js
│   │   ├── validators/         # Action validators
│   │   │   ├── canDrawCards.js
│   │   │   ├── canGainFood.js
│   │   │   ├── canLayEggs.js
│   │   │   └── canPlayBird.js
│   │   ├── BonusDeck.js
│   │   ├── Deck.js
│   │   ├── DiceTray.js
│   │   ├── Game.js
│   │   ├── Player.js
│   │   ├── RoundGoalEngine.js
│   │   ├── ScoringEngine.js
│   │   └── TurnManager.js
│   ├── socket.js               # Socket.IO server logic
│   └── index.js                # Server entry point
│
├── data/                        # Game data
│   ├── birds.json              # 60+ bird cards
│   ├── bonus_cards.json        # Bonus scoring cards
│   ├── habitat_columns.json   # Habitat configuration
│   └── round_goals.json        # Round goal cards
│
├── ASSET_INTEGRATION_GUIDE.md  # Guide for adding official assets
├── FIXES_SUMMARY.md            # Development changelog
├── package.json                # Server dependencies
└── README.md                   # This file
```

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Socket.IO Client** - Real-time communication
- **CSS-in-JS** - Inline styling for components

### Backend
- **Node.js** - Server runtime
- **Socket.IO** - WebSocket communication
- **ES Modules** - Modern JavaScript

### Game Engine
- Server-authoritative state management
- Event-driven architecture
- Validation-first action processing
- Deterministic game logic

---

## 📖 Game Rules

### Setup Phase
1. Each player draws **5 bird cards**
2. Each player receives **5 food tokens** (1 of each type)
3. Choose which birds to keep (discard 1 food per bird kept)
4. Select 1 bonus card from 2 options

### Gameplay
- **4 rounds** with decreasing action cubes: 8 → 7 → 6 → 5
- **On your turn**, choose one of 4 actions:
  1. **Gain Food** (Forest) - Take food from birdfeeder
  2. **Lay Eggs** (Grassland) - Place eggs on your birds
  3. **Draw Cards** (Wetlands) - Draw from deck or face-up tray
  4. **Play Bird** - Pay food cost + egg cost to place a bird

### Bird Powers
- **When Activated** - Triggers when using that habitat's action
- **When Played** - Triggers immediately when bird is played
- Powers activate right-to-left in habitat rows

### Scoring
- Bird points printed on cards
- 1 point per egg
- 1 point per cached food
- 1 point per tucked card
- Bonus card points
- Round goal points

### End Game
After 4 rounds, highest total score wins!

---

## 🎨 Adding Official Assets

To use official Wingspan artwork (with permission), see [`ASSET_INTEGRATION_GUIDE.md`](./ASSET_INTEGRATION_GUIDE.md)

Quick summary:
1. Place assets in `client/public/assets/`
2. Follow the directory structure: `birds/`, `food/`, `board/`, etc.
3. Components automatically load images by path
4. Fallbacks to CSS visuals if images not found

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Mac/Linux

# Kill the process or change port in server/index.js
```

### Client won't connect to server
- Ensure server is running first
- Check `client/src/network/socket.js` has correct server URL
- Default: `http://localhost:3000`

### Game state not updating
- Check browser console for errors
- Verify server logs for validation errors
- Ensure all players are in the same lobby

---

## 🚧 Development Roadmap

### Phase 1: Core Mechanics ✅
- [x] Basic game loop
- [x] All 4 actions implemented
- [x] Turn and round management
- [x] Round goal scoring

### Phase 2: Bird Powers ✅
- [x] When Activated powers
- [x] Power activation chains
- [x] Cached food & tucked cards

### Phase 3: UI Polish ✅
- [x] Professional lobby
- [x] Visual bird cards
- [x] Round goal tracker
- [x] Error feedback system

### Phase 4: Official Assets (Current)
- [ ] Bird card images
- [ ] Food token graphics
- [ ] Board backgrounds
- [ ] Sound effects

### Phase 5: Advanced Features
- [ ] All bird power types
- [ ] Predator/hunting mechanics
- [ ] Game replays
- [ ] Spectator mode
- [ ] Mobile responsive design

### Phase 6: Expansions
- [ ] European Expansion
- [ ] Oceania Expansion
- [ ] Asia Expansion
- [ ] Solo mode (Automa)

---

## 📝 License

This is an unofficial fan-made implementation of Wingspan.

**Wingspan** © Stonemaier Games. All rights reserved.
- Game design by Elizabeth Hargrave
- Art by Beth Sobel, Natalia Rojas, and Ana Maria Martinez Jaramillo

This project is for educational and personal use only. All game assets, artwork, and design elements are property of Stonemaier Games.

For commercial use or distribution, please contact Stonemaier Games for licensing.

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Contact

For questions, suggestions, or issues:
- Open an issue on GitHub
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- **Stonemaier Games** - For creating the amazing board game Wingspan
- **Elizabeth Hargrave** - Game designer
- **Beth Sobel** - Lead artist
- The Wingspan community for support and feedback

---

## ⭐ Support

If you enjoy this project, please consider:
- ⭐ Starring the repository
- 🐦 Sharing it with other Wingspan fans
- 🛒 Buying the physical game from [Stonemaier Games](https://stonemaiergames.com/games/wingspan/)

---

**Happy birding!** 🦅🦜🦆
