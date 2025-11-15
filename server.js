// server.js — WebSocket chat server
const http = require('http');
const express = require('express');
const { Server } = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new Server({ server });

app.get('/', (_req, res) => res.send('WS chat server is running'));

wss.on('connection', socket => {
  socket.on('message', msg => {
    for (const client of wss.clients) {
      if (client.readyState === client.OPEN) client.send(msg.toString());
    }
  });
});

const PORT = process.env.PORT || 8181;
server.listen(PORT, () => console.log(`Listening on ${PORT}`));