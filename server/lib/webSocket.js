const WebSocket = require("ws");

const broadcast = path => {
  let subscriptions = global.subscriptions.get(path);

  if (subscriptions === undefined) {
    return;
  }

  for (let ws of subscriptions) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(path);
    }
  }
};

const connect = (ws, req) => {
  ws.isAlive = true;
  ws.subscriptions = new Set();

  ws.on("pong", () => (ws.isAlive = true));

  ws.on("message", message => {
    const [method, path, ...rest] = message.split(" ");

    if (path === undefined || rest.length > 0) {
      return console.error(`Octopus WS: Received invalid message: ${message}`);
    }

    if (method === "GO") {
      let subscriptions = global.subscriptions.get(path);

      if (subscriptions !== undefined) {
        subscriptions.add(ws);
      } else {
        global.subscriptions.set(path, new Set([ws]));
      }

      ws.subscriptions.add(path);
    } else if (method === "NO") {
      let subscriptions = global.subscriptions.get(path);

      if (subscriptions !== undefined) {
        subscriptions.delete(ws);
      }

      ws.subscriptions.delete(path);
    } else if (method === "TP") {
      broadcast(path);
    } else {
      return console.error(`Octopus WS: Received invalid message: ${message}`);
    }
  });

  ws.on("close", () => {
    ws.subscriptions.forEach(path => {
      let subscriptions = global.subscriptions.get(path);

      if (subscriptions !== undefined) {
        subscriptions.delete(ws);
      }
    });
  });
};

module.exports = {
  connect,
  broadcast,
};
