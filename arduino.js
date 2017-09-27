'use strict'
var five = require("johnny-five"),
  board, photoresistor, forceresistor;
const WebSocket = require('ws');

board = new five.Board();

board.on("ready", function() {

  let phr = 0, fsr = 0, fsrHit = false;

  // Create a new `photoresistor` hardware instance.
  photoresistor = new five.Sensor({
    pin: "A0",
    freq: 10
  });

  forceresistor = new five.Sensor({
    pin: "A1",
    freq: 10
  });

  const wss = new WebSocket.Server({ port: 8080 });

  let socket
  wss.on('connection', function connection(ws) {
    socket = ws
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
    });

    ws.send(JSON.stringify({ message: 'hello' }));
  });

  // "data" get the current reading from the photoresistor
  photoresistor.on("data", function() {
    phr = this.value
    if(socket && socket.readyState === socket.OPEN) {
      socket.send(JSON.stringify({ event: 'sensor', phr, fsr }));
    }
  });

  forceresistor.on("data", function() {
    // console.log(this.value)
    fsr = this.value
    if(socket && socket.readyState === socket.OPEN) {
      fsr = this.value
      socket.send(JSON.stringify({ event: 'sensor', phr, fsr }));
    }
  });
});


