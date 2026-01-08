export function LobbyView({ lobby, isHost, onStart }) {
  return (
    <div style={{ padding: 24 }}>
      <h2>Lobby</h2>

      <p>
        <strong>Lobby Code:</strong> {lobby.id}
      </p>

      <ul>
        {lobby.players.map(p => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>

      {isHost ? (
        <button onClick={onStart}>
          Start Game
        </button>
      ) : (
        <p>Waiting for host to start…</p>
      )}
    </div>
  );
}
