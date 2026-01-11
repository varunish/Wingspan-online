import React, { useEffect, useRef, useState } from "react";
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
  
  // Track window width for responsive design
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1400);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
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

  const isLargeScreen = windowWidth > 1024;
  const isMediumScreen = windowWidth > 768;

  return (
    <div style={{ padding: "8px", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <GameHeader
        round={state.round}
        activePlayerId={state.turn?.activePlayerId}
        players={state.players}
      />
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: isLargeScreen ? "1fr 400px" : "1fr",
        gap: 16,
        maxWidth: "1800px",
        margin: "0 auto"
      }}>
        <div style={{ minWidth: 0 }}>
          {/* Round Goal Scoring & Shared Board - Side by Side */}
          <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ flex: "1", minWidth: isMediumScreen ? "300px" : "200px" }}>
              <RoundGoalScorer
                roundGoals={state.roundGoals || []}
                players={state.players || []}
                currentRound={state.round?.round || 1}
              />
            </div>
            <div style={{ flex: "1", minWidth: isMediumScreen ? "300px" : "200px" }}>
              <SharedBoard 
                diceTray={state.diceTray} 
                logs={state.logs}
                round={state.round}
                birdTray={state.birdTray}
              />
            </div>
          </div>

          <PlayerBoard player={me} />
          {opponents.map(p => (
            <PlayerBoard key={p.id} player={p} compact />
          ))}
        </div>
        <div style={isLargeScreen ? 
          { position: "sticky", top: 8, maxHeight: "calc(100vh - 16px)", overflowY: "auto" } : 
          { marginTop: 16 }
        }>
          <ActionPanel state={state} myPlayerId={myPlayerId} />
        </div>
      </div>
    </div>
  );
}
