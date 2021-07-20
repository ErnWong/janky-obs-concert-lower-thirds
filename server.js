#!/usr/bin/env node

const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const _ = require('lodash');

class State {
  constructor(id, html, {persist = false, duration = 0, auto_next = false} = {}) {
    this.id = id;
    this.html = html;
    this.persist = persist;
    this.duration = duration;
    this.auto_next = auto_next;
  }
}

const STATES = [
  null,
  new State('welcome', 'Welcome', { persist: true }),
  new State('starting-soon', 'We will be starting soon', { persist: true }),
  new State('1-bach-prelude-fugue', 'Bach<br>Prelude and Fugure in B♭ Minor, WTC I, BWV 867', { duration: 6 }),
  new State('2-haydn-sonata', 'Haydn<br>Sonata in E♭ Major, Hob. XVI:52', { auto_next: true }),
  new State('2.1-allegro', 'I. Allegro (Moderato)', { duration: 6 }),
  new State('2.2-adagio', 'II. Adagio', { duration: 5 }),
  new State('2.3-finale', 'III. Finale: Presto', { duration: 5 }),
  new State('3-gaoping-distant-voices', 'Gao Ping<br>Distant Voices (1999)', { auto_next: true }),
  new State('3.1-nostalgia', 'I. Nostalgia', { duration: 4 }),
  new State('3.2-lovesong-of-kangding-town', 'II. Lovesong of Kangding Town', { duration: 2.7 }),
  new State('3.3-blue-flower', 'III. Blue Flower', { duration: 7 }),
  new State('intermission', 'Intermission', { persist: true }),
  new State('4-beethoven-sonata', 'Beethoven<br>Sonata in A♭ Major, Op. 110', { auto_next: true }),
  new State('4.1-moderato-cantabile-molto-espressivo', 'I. Moderato cantabile molto expressivo', { duration: 7 }),
  new State('4.2-allegro-molto', 'II. Allegro molto', { duration: 2 }),
  new State('4.3-adagio-ma-non-troppo', 'III. Adagio ma non troppo - Allegro ma non troppo', { duration: 12 }),
  new State('5-chopin-ballade', 'Chopin<br>Ballade in F Minor, Op. 52', { duration: 11 }),
  new State('end', 'Thanks for watching', { persist: true }),
];

let state = 0;
let clients = [];

function sendState(ws) {
  debugger;
  const payload = JSON.stringify({ STATES, state });
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
