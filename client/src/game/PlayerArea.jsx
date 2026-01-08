import { OpponentSummary } from "./OpponentSummary.jsx";

export function PlayerArea({ me, opponents, active }) {
  if (!me) {
    return (
      <div style={{ padding: 16 }}>
        <h2>Identifying player…</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>
        You: {me.name} {active ? "(Your turn)" : "(Waiting)"}
      </h2>

      <div style={{ marginTop: 12 }}>
        <strong>Opponents</strong>
        {opponents.map(p => (
          <OpponentSummary key={p.id} player={p} />
        ))}
      </div>
    </div>
  );
}
