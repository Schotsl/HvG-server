export interface Listener {
  code?: string;
  other?: WebSocket;
  client: WebSocket;
}

export interface Patch {
  q: number; // x_speed
  w: number; // y_speed;
  e: number; // x_pos;
  f: number; // y_pos;
}

export interface Action {
  code: string;
  type: Type;
}

export enum Type
{
    Clue = 0,
    Laser = 1,
    Hosting = 2,
    Position = 3,
    Subscribe = 4,
}
