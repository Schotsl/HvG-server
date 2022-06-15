import { Action, Listener } from "./types.ts";

class Manager {
  listeners: Listener[] = [];

  addClient(client: WebSocket) {
    const listener = { client };

    this.listeners.push(listener);

    client.onmessage = (event) => {
      const data = event.data;

      if (data.includes("action")) {
        const body = JSON.parse(data) as Action;
        const action = body.action;

        switch (action) {
          case "hosting":
            this.recieveHosting(listener, body);
            break;
          case "subscribing":
            this.recieveSubscribing(listener, body);
            break;
        }

        return;
      }

      this.recievePatch(listener, event.data);
    };
  }

  sendPatch(client: WebSocket, data: string) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }

  sendSucces(client: WebSocket, success = true) {
    if (client.readyState === WebSocket.OPEN) {
      const data = { success };
      const body = JSON.stringify(data);

      client.send(body);
    }
  }

  recievePatch(listener: Listener, data: string) {
    const other = listener.other;

    if (other) {
      this.sendPatch(other, data);
    }
  }

  recieveHosting(listener: Listener, data: Action) {
    const { code } = data;

    // Should probably validate the short code and check for duplicates
    listener.code = code;
  }

  recieveSubscribing(listener: Listener, data: Action) {
    const { code } = data;

    const other = this.listeners.find((listener) => listener.code === code);

    // If no one is hosting a game with this code
    if (!other) {
      // Send a message to the client that the code is invalid
      this.sendSucces(listener.client, false);

      // Abort the function
      return;
    }

    // Bind the hosting party to the subscriber
    listener.other = other.client;

    // Bind the subscriber party to the hoster and store the code for reconnecting
    other.code = code;
    other.other = listener.client;

    // Notify the clients of their successful connection
    this.sendSucces(other.client, true);
    this.sendSucces(listener.client, true);
  }
}

const manager = new Manager();

export default manager;
