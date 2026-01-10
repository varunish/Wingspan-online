import React, { useEffect, useRef } from "react";
import { GameHeader } from "./GameHeader.jsx";
import { PlayerBoard } from "./PlayerBoard.jsx";
import { ActionPanel } from "./ActionPanel.jsx";
import { SharedBoard } from "./SharedBoard.jsx";
import { RoundGoalScorer } from "./RoundGoalScorer.jsx";
import { playDingSound } from "../utils/sound.js";

export function PlayScreen({ state, myPlayerId }) {
  const me = state.players.find(p => p.id === myPlayerId);
  const opponents = state.players.filter(p => p.id !== myPlayerId);
  
  // Track previous active player to detect turn changes
  const prevActivePlayerIdRef = useRef(null);
  const activePlayerId = state.turn?.activePlayerId;
  
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
    <div style={{ padding: "8px", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <GameHeader
        round={state.round}
        activePlayerId={state.turn?.activePlayerId}
        players={state.players}
      />
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 500px), 1fr))", 
        gap: 12,
        maxWidth: "1800px",
        margin: "0 auto"
      }}>
        <div style={{ minWidth: 0 }}>
          {/* Round Goal Scoring Tracker & Shared Board - Side by Side */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 350px), 1fr))", 
            gap: 12, 
            marginBottom: 16 
          }}>
            <RoundGoalScorer
              roundGoals={state.roundGoals || []}
              players={state.players || []}
              currentRound={state.round?.round || 1}
            />

            <SharedBoard 
              diceTray={state.diceTray} 
              logs={state.logs}
              round={state.round}
              birdTray={state.birdTray}
            />
          </div>

          <PlayerBoard player={me} />
          {opponents.map(p => (
            <PlayerBoard key={p.id} player={p} compact />
          ))}
        </div>
        <div style={{ position: "sticky", top: 8, maxHeight: "calc(100vh - 16px)", overflowY: "auto" }}>
          <ActionPanel state={state} myPlayerId={myPlayerId} />
        </div>
      </div>
    </div>
  );
}
