export function OpponentSummary({ player }) {
  return (
    <div style={{ border: "1px solid #ccc", marginTop: 4, padding: 4 }}>
      {player.name} — Score: {player.score?.total ?? 0}
    </div>
  );
}
