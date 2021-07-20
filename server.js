#!/usr/bin/env node

const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const _ = require('lodash');
require('toml-require').install();
const programme = require('./programme.toml');

let state = 0;
let clients = [];

function sendState(ws) {
  debugger;
  const payload = JSON.stringify({ programme: programme.items, state });
  if (ws.readyState === 1) {
    ws.send(payload);
  } else {
    console.log('Websocket not open yet not cleaned up');
  }
}

app.use('/js', express.static('./node_modules/reconnecting-websocket/dist'));
app.use('/', express.static('./static'));

app.ws('/ws', (ws) => {
  console.log('Web socket connected')
  clients.push(ws);
  sendState(ws);
  ws.on('message', (newState) => {
    state = +newState;
    for (ws of clients) {
      sendState(ws);
    }
  });
  ws.on('close', () => {
    console.log('Web socket closed')
    _.pull(clients, ws);
  });
  ws.on('error', (err) => {
    console.error(err);
  })
})

app.listen(8080);
console.log('Listening at 8080');
