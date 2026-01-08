import { SetupScreen } from "./SetupScreen.jsx";
import { PlayScreen } from "./PlayScreen.jsx";
import { GameOverScreen } from "./GameOverScreen.jsx";

export function GameShell({ state, myPlayerId }) {
  if (!state) return <div>Loading…</div>;

  if (state.phase === "SETUP") {
    return <SetupScreen state={state} myPlayerId={myPlayerId} />;
  }

  if (state.phase === "PLAY") {
    return <PlayScreen state={state} myPlayerId={myPlayerId} />;
  }

  if (state.phase === "END") {
    return <GameOverScreen finalScores={state.finalScores} players={state.players} />;
  }

  return <div>Unknown game phase</div>;
}
