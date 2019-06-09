const broadcast = path => {
  let subscriptions = global.subscriptions.get(path);

  if (subscriptions === undefined) {
    return;
  }

  for (let ws of subscriptions) {
    ws.send(path);
  }
};

const connect = (ws, req) => {
  ws.isAlive = true;

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
    } else if (method === "NO") {
      let subscriptions = global.subscriptions.get(path);

      if (subscriptions !== undefined) {
        subscriptions.delete(ws);
      }
    } else if (method === "TP") {
      broadcast(path);
    } else {
      return console.error(`Octopus WS: Received invalid message: ${message}`);
    }
  });
};

module.exports = {
  connect,
  broadcast,
};
