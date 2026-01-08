import { GameHeader } from "./GameHeader.jsx";
import { PlayerBoard } from "./PlayerBoard.jsx";
import { ActionPanel } from "./ActionPanel.jsx";
import { SharedBoard } from "./SharedBoard.jsx";
import { RoundGoalScorer } from "./RoundGoalScorer.jsx";

export function PlayScreen({ state, myPlayerId }) {
  const me = state.players.find(p => p.id === myPlayerId);
  const opponents = state.players.filter(p => p.id !== myPlayerId);

  return (
    <div>
      <GameHeader
        round={state.round}
        activePlayerId={state.turn?.activePlayerId}
        players={state.players}
      />
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
        <div>
          {/* Round Goal Scoring Tracker & Shared Board - Side by Side */}
          <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: 12, marginBottom: 16 }}>
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
        <ActionPanel state={state} myPlayerId={myPlayerId} />
      </div>
    </div>
  );
}
