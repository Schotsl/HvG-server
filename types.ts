export interface Listener {
  code?: string;
  other?: WebSocket;
  client: WebSocket;
}

export enum Type {
  Clue = 0,
  Laser = 1,
  Hosting = 2,
  Position = 3,
  Subscribe = 4,
  Restoring = 5,
}

export interface Update {
  type: Type;
  code: string;
}
