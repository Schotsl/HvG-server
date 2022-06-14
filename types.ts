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
  action: string;
}
