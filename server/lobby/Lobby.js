import { uid } from "../utils/uid.js";

export class Lobby {
  constructor(hostSocketId, hostName) {
    this.id = uid();
    this.players = [{
      id: hostSocketId,
      name: hostName,
      connected: true
    }];
    this.started = false;
  }

  addPlayer(socketId, name) {
    if (this.started) throw new Error("Game already started");
    this.players.push({ id: socketId, name, connected: true });
  }

  reconnectPlayer(socketId, playerName) {
    const player = this.players.find(p => p.name === playerName);
    if (!player) return false;
    
    player.id = socketId;
    player.connected = true;
    return true;
  }

  disconnectPlayer(socketId) {
    const player = this.players.find(p => p.id === socketId);
    if (player) {
      player.connected = false;
    }
  }
}
