'use strict'
var five = require("johnny-five"),
  board, potentiometer, forceresistor;
const WebSocket = require('ws');


board = new five.Board();

board.on("ready", function() {
  let pot = 0, fsr = 0, fsrHit = false;


  forceresistor = new five.Sensor({
    pin: "A1",
    freq: 10
  });

  potentiometer = new five.Sensor({
    pin: "A0",
    freq: 250
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

  // // "data" get the current reading from the photoresistor
  potentiometer.on("data", function() {
    pot = Math.max(this.value, 1);
    if(socket && socket.readyState === socket.OPEN) {
      socket.send(JSON.stringify({ event: 'sensor', pot, fsr }));
    }
  });

  forceresistor.on("data", function() {
    fsr = this.value
    if(socket && socket.readyState === socket.OPEN) {
      fsr = this.value
      socket.send(JSON.stringify({ event: 'sensor', pot, fsr }));
    }
  });
});


