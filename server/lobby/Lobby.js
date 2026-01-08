import { uid } from "../utils/uid.js";

export class Lobby {
  constructor(hostSocketId, hostName) {
    this.id = uid();
    this.players = [{
      id: hostSocketId,
      name: hostName
    }];
    this.started = false;
  }

  addPlayer(socketId, name) {
    if (this.started) throw new Error("Game already started");
    this.players.push({ id: socketId, name });
  }
}
