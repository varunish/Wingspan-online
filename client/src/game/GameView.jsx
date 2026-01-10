import React, { useEffect, useRef } from "react";
import { BoardView } from "./BoardView.jsx";
import { PlayerBoard } from "./PlayerBoard.jsx";
import { ActionPanel } from "./ActionPanel.jsx";
import { TutorialOverlay } from "../tutorial/TutorialOverlay.jsx";
import { playDingSound } from "../utils/sound.js";
import { socket } from "../network/socket.js";

export function GameView({ state, myPlayerId }) {
  // Defensive guards
  if (!state || !Array.isArray(state.players)) {
    return <div>Invalid game state</div>;
  }

  const activePlayerId = state.turn?.activePlayerId;
  const activePlayer = state.players.find(
    p => p.id === activePlayerId
  );
  
  // Track previous active player to detect turn changes
  const prevActivePlayerIdRef = useRef(null);
  
  // Play ding sound when it becomes this player's turn
  useEffect(() => {
    if (activePlayerId && myPlayerId && activePlayerId === myPlayerId) {
      // Only play sound if the turn actually changed (not on initial render)
      if (prevActivePlayerIdRef.current !== null && prevActivePlayerIdRef.current !== activePlayerId) {
        playDingSound();
      }
    }
    prevActivePlayerIdRef.current = activePlayerId;
  }, [activePlayerId, myPlayerId]);

  const handleLeaveGame = () => {
    if (confirm("Are you sure you want to leave the game? You can reconnect later using the same lobby code.")) {
      socket.emit("leaveGame");
      localStorage.removeItem("wingspan_lobbyId");
      localStorage.removeItem("wingspan_playerName");
      window.location.reload();
    }
  };

  return (
    <div className="game">
      {/* ---- LEAVE BUTTON ---- */}
      <button
        onClick={handleLeaveGame}
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          padding: "8px 16px",
          background: "#ff4444",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          transition: "all 0.2s"
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "#cc0000";
          e.target.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "#ff4444";
          e.target.style.transform = "scale(1)";
        }}
      >
        🚪 Leave Game
      </button>

      {/* ---- TURN BANNER ---- */}
      <div className="turn-banner">
        {activePlayer
          ? `Current turn: ${activePlayer.name}`
          : "Waiting for players…"}
      </div>

      {/* ---- TUTORIAL ---- */}
      <TutorialOverlay hints={state.tutorialHints} />

      {/* ---- BOARD ---- */}
      <div className="board-section">
        <BoardView />
      </div>

      {/* ---- PLAYERS ---- */}
      <div className="players-section">
        {state.players.map(player => (
          <PlayerBoard
            key={player.id}
            player={player}
            active={player.id === activePlayerId}
            gameId={state.id}
          />
        ))}
      </div>

      {/* ---- ACTIONS ---- */}
      <ActionPanel state={state} />
    </div>
  );
}
