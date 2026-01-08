import { useState } from "react";

export function JoinLobby({ onJoin }) {
  const [lobbyId, setLobbyId] = useState("");

  return (
    <div>
      <h2>Join Lobby</h2>
      <input
        placeholder="Enter lobby code"
        value={lobbyId}
        onChange={e => setLobbyId(e.target.value)}
      />
      <button
        onClick={() => lobbyId && onJoin(lobbyId)}
      >
        Join
      </button>
    </div>
  );
}
