export function GameHeader({ round, activePlayerId, players }) {
  const active = players.find(p => p.id === activePlayerId);

  return (
    <div style={{ background: "#222", color: "#fff", padding: 8 }}>
      Round {round?.round ?? "?"} / {round?.maxRounds ?? "?"}
      {" — "}
      Current Turn: {active ? active.name : "Waiting"}
    </div>
  );
}
