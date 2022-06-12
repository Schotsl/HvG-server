class Manager {
  clients: WebSocket[] = [];

  constructor() {
    setInterval(() => {
      this.clients.forEach((client) => {
        const body = JSON.stringify({
          x: Math.random(),
          y: Math.random(),
        });

        if (client.readyState === WebSocket.OPEN) {
          client.send(body);
        }
      });
    }, 1000);
  }

  addClient(client: WebSocket) {
    this.clients.push(client);
  }
}

const manager = new Manager();

export default manager;
