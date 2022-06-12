interface Position {
  x: number;
  y: number;
  uuid: string;
}

class Manager {
  clients: WebSocket[] = [];
  positions: Position[] = [];

  addClient(client: WebSocket) {
    this.clients.push(client);
    client.onmessage = (event) => this.parseUpdate(event.data);
  }

  parseUpdate(data: string) {
    const position: Position = JSON.parse(data);

    // Push or replace the position in the positions array based on uuid
    const index = this.positions.findIndex((p) => p.uuid === position.uuid);

    if (index === -1) {
      this.positions.push(position);
    } else {
      this.positions[index] = position;
    }

    this.sendPositions();
  }

  sendPositions() {
    const body = JSON.stringify(this.positions);

    this.clients.forEach((client) => { 
      if (client.readyState === WebSocket.OPEN) {
        client.send(body);
      }
    });
  }
}

const manager = new Manager();

export default manager;
