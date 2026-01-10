import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { Game } from "./engine/Game.js";
import { GainFood } from "./engine/Actions/GainFood.js";
import { LayEggs } from "./engine/Actions/LayEggs.js";
import { DrawCards } from "./engine/Actions/DrawCards.js";
import { PlayBird } from "./engine/Actions/PlayBird.js";
import { ExchangeResource } from "./engine/Actions/ExchangeResource.js";
import { ConvertFood } from "./engine/Actions/ConvertFood.js";
import { ScoringEngine } from "./engine/ScoringEngine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/dist")));

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// SPA fallback - serve index.html for all other routes (Express 5.x compatible)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const io = new Server(httpServer, {
  cors: { origin: "*" }
});

const lobbies = new Map();
const games = new Map();

io.on("connection", socket => {
  socket.on("createLobby", ({ playerName }) => {
    const lobbyId = Math.random().toString(36).slice(2, 8);
    lobbies.set(lobbyId, {
      id: lobbyId,
      players: [{ id: socket.id, name: playerName }]
    });
    socket.join(lobbyId);
    io.to(lobbyId).emit("lobbyUpdate", lobbies.get(lobbyId));
  });

  socket.on("joinLobby", ({ lobbyId, playerName }) => {
    // Case-insensitive lobby lookup
    const normalizedLobbyId = lobbyId.toLowerCase();
    const lobby = lobbies.get(normalizedLobbyId);
    if (!lobby) return;

    lobby.players.push({ id: socket.id, name: playerName });
    socket.join(normalizedLobbyId);
    io.to(normalizedLobbyId).emit("lobbyUpdate", lobby);
  });

  socket.on("reconnectToGame", ({ lobbyId, playerName }) => {
    // Case-insensitive lobby lookup
    const normalizedLobbyId = lobbyId.toLowerCase();
    const game = games.get(normalizedLobbyId);
    
    if (!game) {
      socket.emit("reconnectError", { error: "Game not found" });
      return;
    }

    // Find the player by name
    const player = game.players.find(p => p.name === playerName);
    if (!player) {
      socket.emit("reconnectError", { error: "Player not found in game" });
      return;
    }

    // Update the player's socket ID
    const oldSocketId = player.id;
    player.id = socket.id;

    // Join the game room
    socket.join(normalizedLobbyId);

    // Notify the player they've reconnected
    socket.emit("reconnectSuccess", { 
      message: `Reconnected as ${playerName}`,
      state: game.serialize()
    });

    // Notify other players
    game.logs.push(`${playerName} reconnected`);
    io.to(normalizedLobbyId).emit("stateUpdate", game.serialize());
  });

  socket.on("startGame", ({ lobbyId }) => {
    // Case-insensitive lobby lookup
    const normalizedLobbyId = lobbyId.toLowerCase();
    const lobby = lobbies.get(normalizedLobbyId);
    if (!lobby) return;

    const game = new Game();
    lobby.players.forEach(p => game.addPlayer(p.name, p.id));

    game.dealSetup();
    games.set(game.id, game);

    // Move all lobby players into the game room BEFORE emitting
    lobby.players.forEach(p => {
      const s = io.sockets.sockets.get(p.id);
      if (s) s.join(game.id);
    });

    // Emit to both lobbyId (for players still listening) and game.id (for safety)
    const gameState = game.serialize();
    io.to(normalizedLobbyId).emit("gameStarted", { state: gameState });
    io.to(game.id).emit("gameStarted", { state: gameState });
    
    lobbies.delete(normalizedLobbyId);
  });

  socket.on("confirmSetup", ({ gameId, keptBirdIds, bonusCardId }) => {
    const game = games.get(gameId);
    if (!game) return;
    
    const player = game.getPlayer(socket.id);
    if (!player) return;

    if (game.phase !== "SETUP") return;

    const availableBirds =
      (player.setup?.birds || []).filter(b => b && b.id) || [];
    const kept = availableBirds.filter(b =>
      (keptBirdIds || []).includes(b.id)
    );

    // Validate selection and food cost
    const foodCount = Object.values(player.food || {}).reduce(
      (a, b) => a + b,
      0
    );
    if (kept.length > foodCount) return;

    // Discard food: 1 food per bird kept
    let toDiscard = kept.length;
    for (const k of Object.keys(player.food)) {
      while (player.food[k] > 0 && toDiscard > 0) {
        player.food[k]--;
        toDiscard--;
      }
    }

    player.hand = kept;
    
    // Handle bonus card selection
    if (bonusCardId && player.setup.bonusCards) {
      const selectedBonus = player.setup.bonusCards.find(b => b.id === bonusCardId);
      if (selectedBonus) {
        player.bonusCard = selectedBonus;
      }
    }
    
    player.setup.confirmed = true;
    game.logs.push(`${player.name} confirmed setup (kept ${kept.length} birds)`);

    const allConfirmed = game.players.every(p => p.setup.confirmed);
    
    if (allConfirmed) {
      game.phase = "PLAY";
      game.startRound();
      game.logs.push("All players confirmed setup. Game starting!");

      // Ensure all players are in the game room for updates
      game.players.forEach(p => {
        const s = io.sockets.sockets.get(p.id);
        if (s) s.join(game.id);
      });
    } else {
      const remaining = game.players.filter(p => !p.setup.confirmed).length;
      game.logs.push(`Waiting for ${remaining} more player(s) to confirm setup`);
    }

    // Always emit state update so all players see the progress
    io.to(game.id).emit("stateUpdate", game.serialize());
  });

  const ensurePlayable = game =>
    game && game.phase === "PLAY" && game.turnManager.activePlayer;

  function postActionAdvance(game) {
    // If everyone is out of cubes, advance round or end game
    const allOut = game.players.every(p => p.actionCubes === 0);
    if (allOut) {
      // Score the round goal
      game.endRound();
      
      if (game.round.round >= game.round.maxRounds) {
        game.phase = "END";
        game.finalScores = ScoringEngine.scoreGame(game.players);
        game.logs.push("Game Over! Final scores calculated.");
        return;
      }
      
      // Check if any player needs to discard cards (more than 5 in hand)
      const needsDiscard = game.players.some(p => p.hand && p.hand.length > 5);
      if (needsDiscard) {
        game.phase = "DISCARD";
        game.players.forEach(p => {
          p.discardConfirmed = false;
        });
        game.logs.push("End of round: Players must discard down to 5 cards");
        return;
      }
      
      game.round.round += 1;
      game.startRound();
      return;
    }

    game.turnManager.advance();
  }

  socket.on("gainFood", ({ gameId, habitat, foodTypes }) => {
    const game = games.get(gameId);
    if (!ensurePlayable(game)) {
      socket.emit("actionError", { error: "Game is not in playable state" });
      return;
    }
    const player = game.getPlayer(socket.id);
    if (!player) {
      socket.emit("actionError", { error: "Player not found" });
      return;
    }

    if (player.actionCubes <= 0) {
      socket.emit("actionError", { error: "No action cubes remaining" });
      return;
    }
    player.actionCubes -= 1;

    let powerActivations = [];
    try {
      powerActivations = GainFood(game, player, habitat, foodTypes) || [];
    } catch (e) {
      player.actionCubes += 1;
      socket.emit("actionError", { error: e.message });
      return;
    }

    postActionAdvance(game);
    io.to(game.id).emit("stateUpdate", game.serialize());
    
    // Emit power activations to all players in the game
    if (powerActivations.length > 0) {
      powerActivations.forEach(activation => {
        io.to(game.id).emit("powerActivated", activation);
      });
    }
    
    socket.emit("actionSuccess", { message: "Gained food successfully!" });
  });

  socket.on("layEggs", ({ gameId, habitat, birdIds }) => {
    const game = games.get(gameId);
    if (!ensurePlayable(game)) {
      socket.emit("actionError", { error: "Game is not in playable state" });
      return;
    }
    const player = game.getPlayer(socket.id);
    if (!player) {
      socket.emit("actionError", { error: "Player not found" });
      return;
    }

    if (player.actionCubes <= 0) {
      socket.emit("actionError", { error: "No action cubes remaining" });
      return;
    }
    player.actionCubes -= 1;

    let powerActivations = [];
    try {
      powerActivations = LayEggs(game, player, habitat, birdIds) || [];
    } catch (e) {
      player.actionCubes += 1;
      socket.emit("actionError", { error: e.message });
      return;
    }

    postActionAdvance(game);
    io.to(game.id).emit("stateUpdate", game.serialize());
    
    // Emit power activations to all players in the game
    if (powerActivations.length > 0) {
      powerActivations.forEach(activation => {
        io.to(game.id).emit("powerActivated", activation);
      });
    }
    
    socket.emit("actionSuccess", { message: `Laid ${birdIds.length} eggs successfully!` });
  });

  socket.on("drawCards", ({ gameId, habitat, count, fromTray }) => {
    const game = games.get(gameId);
    if (!ensurePlayable(game)) {
      socket.emit("actionError", { error: "Game is not in playable state" });
      return;
    }
    const player = game.getPlayer(socket.id);
    if (!player) {
      socket.emit("actionError", { error: "Player not found" });
      return;
    }

    if (player.actionCubes <= 0) {
      socket.emit("actionError", { error: "No action cubes remaining" });
      return;
    }
    player.actionCubes -= 1;

    let powerActivations = [];
    try {
      powerActivations = DrawCards(game, player, habitat, count, fromTray || []) || [];
    } catch (e) {
      player.actionCubes += 1;
      socket.emit("actionError", { error: e.message });
      return;
    }

    postActionAdvance(game);
    io.to(game.id).emit("stateUpdate", game.serialize());
    
    // Emit power activations to all players in the game
    if (powerActivations.length > 0) {
      powerActivations.forEach(activation => {
        io.to(game.id).emit("powerActivated", activation);
      });
    }
    
    socket.emit("actionSuccess", { message: `Drew ${count} cards successfully!` });
  });

  socket.on("playBird", ({ gameId, birdId, habitat, wildFoodChoices = [] }) => {
    const game = games.get(gameId);
    if (!ensurePlayable(game)) {
      socket.emit("actionError", { error: "Game is not in playable state" });
      return;
    }
    const player = game.getPlayer(socket.id);
    if (!player) {
      socket.emit("actionError", { error: "Player not found" });
      return;
    }

    if (player.actionCubes <= 0) {
      socket.emit("actionError", { error: "No action cubes remaining" });
      return;
    }
    player.actionCubes -= 1;

    try {
      PlayBird(game, player, birdId, habitat, wildFoodChoices);
    } catch (e) {
      player.actionCubes += 1;
      socket.emit("actionError", { error: e.message });
      return;
    }

    postActionAdvance(game);
    io.to(game.id).emit("stateUpdate", game.serialize());
    const bird = player.habitats[habitat][player.habitats[habitat].length - 1];
    socket.emit("actionSuccess", { message: `Played ${bird?.name || "bird"} successfully!` });
  });

  // Resource exchange handler
  socket.on("exchangeResource", ({ gameId, exchangeType, params }) => {
    const game = games.get(gameId);
    if (!ensurePlayable(game)) {
      socket.emit("actionError", { error: "Game is not in playable state" });
      return;
    }
    const player = game.getPlayer(socket.id);
    if (!player) {
      socket.emit("actionError", { error: "Player not found" });
      return;
    }

    try {
      ExchangeResource(game, player, exchangeType, params);
    } catch (e) {
      socket.emit("actionError", { error: e.message });
      return;
    }

    io.to(game.id).emit("stateUpdate", game.serialize());
    socket.emit("actionSuccess", { message: "Exchange completed successfully!" });
  });

  // Food conversion (2:1 ratio)
  socket.on("convertFood", ({ gameId, giveFoods, getFood }) => {
    const game = games.get(gameId);
    if (!ensurePlayable(game)) {
      socket.emit("actionError", { error: "Game is not in playable state" });
      return;
    }
    const player = game.getPlayer(socket.id);
    if (!player) {
      socket.emit("actionError", { error: "Player not found" });
      return;
    }

    try {
      ConvertFood(game, player, giveFoods, getFood);
    } catch (e) {
      socket.emit("actionError", { error: e.message });
      return;
    }

    io.to(game.id).emit("stateUpdate", game.serialize());
    socket.emit("actionSuccess", { message: "Food conversion successful!" });
  });

  // End-of-round discard handler
  socket.on("discardCards", ({ gameId, cardIds }) => {
    const game = games.get(gameId);
    if (!game) {
      socket.emit("actionError", { error: "Game not found" });
      return;
    }

    if (game.phase !== "DISCARD") {
      socket.emit("actionError", { error: "Not in discard phase" });
      return;
    }

    const player = game.getPlayer(socket.id);
    if (!player) {
      socket.emit("actionError", { error: "Player not found" });
      return;
    }

    // Validate discard
    if (!Array.isArray(cardIds)) {
      socket.emit("actionError", { error: "Invalid card selection" });
      return;
    }

    const cardsToDiscard = cardIds.length;
    const finalHandSize = player.hand.length - cardsToDiscard;

    if (finalHandSize > 5) {
      socket.emit("actionError", { error: `Must discard to 5 cards. Currently would have ${finalHandSize} cards.` });
      return;
    }

    if (finalHandSize < 5 && player.hand.length > 5) {
      socket.emit("actionError", { error: "Cannot discard more than necessary" });
      return;
    }

    // Perform discard
    player.hand = player.hand.filter(card => !cardIds.includes(card.id));
    player.discardConfirmed = true;
    game.logs.push(`${player.name} discarded ${cardsToDiscard} card(s)`);

    // Check if all players have confirmed discard
    const allConfirmed = game.players.every(p => 
      p.hand.length <= 5 || p.discardConfirmed
    );

    if (allConfirmed) {
      // All players have discarded, start next round
      game.phase = "PLAY";
      game.round.round += 1;
      game.startRound();
      game.logs.push(`Round ${game.round.round} started`);
    }

    io.to(game.id).emit("stateUpdate", game.serialize());
    socket.emit("actionSuccess", { message: "Discarded cards successfully!" });
  });

  // Handle player disconnect
  socket.on("disconnect", () => {
    // Find any active games this player is in
    for (const [gameId, game] of games.entries()) {
      const player = game.players.find(p => p.id === socket.id);
      if (player) {
        game.logs.push(`${player.name} disconnected`);
        io.to(gameId).emit("stateUpdate", game.serialize());
      }
    }
  });

  // Handle manual leave
  socket.on("leaveGame", () => {
    // Remove session data (client will do this too)
    // Just notify the game if player is in one
    for (const [gameId, game] of games.entries()) {
      const player = game.players.find(p => p.id === socket.id);
      if (player) {
        game.logs.push(`${player.name} left the game`);
        io.to(gameId).emit("stateUpdate", game.serialize());
      }
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Wingspan server running on port ${PORT}`);
});
