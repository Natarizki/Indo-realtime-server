// server.js
const WebSocket = require('ws');

// Use platform port if provided
const port = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port });

let scene = { nodes: [] };
let chat = [];

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'scene_snapshot', scene }));
  ws.send(JSON.stringify({ type: 'chat_snapshot', chat }));

  ws.on('message', (raw) => {
    let msg; try { msg = JSON.parse(raw); } catch { return; }
    if (msg.type === 'scene_update') {
      scene = msg.scene;
      broadcast({ type: 'scene_update', scene });
    }
    if (msg.type === 'chat') {
      const entry = { user: msg.user || 'guest', text: msg.text, ts: Date.now() };
      chat.push(entry);
      broadcast({ type: 'chat', entry });
    }
  });
});

function broadcast(msg) {
  const data = JSON.stringify(msg);
  wss.clients.forEach(c => { if (c.readyState === 1) c.send(data); });
}

console.log('Server running, port:', port);