interface Position {
  x: number;
  y: number;
  uuid: string;
}

class Manager {
  clients: WebSocket[] = [];

  addClient(client: WebSocket) {
    this.clients.push(client);
    client.onmessage = (event) => this.parseUpdate(event.data);
  }

  parseUpdate(data: string) {
    this.clients.forEach((client) => { 
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }
}

const manager = new Manager();

export default manager;
