import { useState } from "react";

export function NameEntry({ onCreate, onJoin }) {
  const [name, setName] = useState("");
  const [lobbyId, setLobbyId] = useState("");

  return (
    <div style={{ padding: 24 }}>
      <h1>Wingspan Online</h1>

      <div style={{ marginBottom: 12 }}>
        <input
          placeholder="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <button
          disabled={!name}
          onClick={() => onCreate(name)}
        >
          Create Lobby
        </button>
      </div>

      <hr />

      <div style={{ marginTop: 12 }}>
        <input
          placeholder="Lobby code"
          value={lobbyId}
          onChange={e => setLobbyId(e.target.value)}
        />
      </div>

      <div style={{ marginTop: 8 }}>
        <button
          disabled={!name || !lobbyId}
          onClick={() => onJoin(name, lobbyId)}
        >
          Join Lobby
        </button>
      </div>
    </div>
  );
}
