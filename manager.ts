import { Listener, Type, Update } from "./types.ts";

class Manager {
  listeners: Listener[] = [];

  addClient(client: WebSocket) {
    const listener = { client };

    this.listeners.push(listener);

    client.onmessage = (event) => {
      const data = event.data;
      const body = JSON.parse(data) as Update;
      const type = body.type;

      switch (type) {
        case Type.Hosting:
          this.receiveHosting(listener, body);
          break;
        case Type.Subscribe:
        case Type.Restoring:
          this.receiveSubscribing(listener, body);
          break;
        default:
          this.receiveRelay(listener, event.data);
          break;
      }
    };
  }

  sendData(client: WebSocket, data: string) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }

  sendSuccess(client: WebSocket, type: Type, success = true) {
    const data = { success, type };
    const body = JSON.stringify(data);

    this.sendData(client, body);
  }

  receiveRelay(listener: Listener, data: string) {
    const other = listener.other;

    if (other) {
      this.sendData(other, data);
    }
  }

  receiveHosting(listener: Listener, data: Update) {
    const { code } = data;

    // Should probably validate the short code and check for duplicates
    listener.code = code;
  }

  receiveSubscribing(listener: Listener, data: Update) {
    const { code } = data;

    const other = this.listeners.find((listener) => listener.code === code);

    // If no one is hosting a game with this code
    if (!other) {
      // Send a message to the client that the code is invalid
      this.sendSuccess(listener.client, Type.Subscribe, false);

      // Abort the function
      return;
    }

    // Bind the hosting party to the subscriber
    listener.other = other.client;

    // Bind the subscriber party to the hoster and store the code for reconnecting
    other.code = code;
    other.other = listener.client;

    // Notify the clients of their successful connection
    this.sendSuccess(other.client, Type.Hosting, true);
    this.sendSuccess(listener.client, Type.Subscribe, true);
  }
}

const manager = new Manager();

export default manager;
