import { Listener } from './types.ts';

class Manager {
  listeners: Listener[] = [];

  addClient(client: WebSocket) {
    const uuid = crypto.randomUUID();
    const listener = {
      uuid,
      client,
    };

    this.listeners.push(listener);

    client.onmessage = (event) => this.recievePatch(listener, event.data);
  }

  sendIdentity(listener: Listener) {
    const body = JSON.stringify({
      uuid: listener.uuid,
    });

    listener.client.send(body);
  }

  sendPatch(listeners: Listener[], data: string) {
    listeners.forEach((listener) => {
      if (listener.client.readyState === WebSocket.OPEN) {
        listener.client.send(data)
      }
    });
  }

  recievePatch(listener: Listener, data: string) {
    const uuid = listener.uuid;
    const others = this.listeners.filter((listener) => listener.uuid !== uuid);

    this.sendPatch(others, data);
  }
}

const manager = new Manager();

export default manager;
