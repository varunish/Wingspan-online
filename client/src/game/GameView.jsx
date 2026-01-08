import React from "react";
import { BoardView } from "./BoardView.jsx";
import { PlayerBoard } from "./PlayerBoard.jsx";
import { ActionPanel } from "./ActionPanel.jsx";
import { TutorialOverlay } from "../tutorial/TutorialOverlay.jsx";

export function GameView({ state }) {
  // Defensive guards
  if (!state || !Array.isArray(state.players)) {
    return <div>Invalid game state</div>;
  }

  const activePlayerId = state.turn?.activePlayerId;
  const activePlayer = state.players.find(
    p => p.id === activePlayerId
  );

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
