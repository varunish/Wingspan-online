import React, { useEffect, useRef } from "react";
import { BoardView } from "./BoardView.jsx";
import { PlayerBoard } from "./PlayerBoard.jsx";
import { ActionPanel } from "./ActionPanel.jsx";
import { TutorialOverlay } from "../tutorial/TutorialOverlay.jsx";
import { playDingSound } from "../utils/sound.js";

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

  return (
    <div className="game">
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
