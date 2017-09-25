const http = require('http');
const socketio = require('socket.io');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

let currentNumber = 0;

const onRequest = (req, res) => {
  fs.readFile(`${__dirname}/../client/index.html`, (err, data) => {
    if (err) {
      throw err;
    }
    // console.log(data);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(data);
    res.end();
  });
};

const app = http.createServer(onRequest);
app.listen(PORT);

const io = socketio(app); // pass server to socket io

io.on('connection', (socket) => {
  socket.join('room1');

  socket.on('updateNumber', (data) => {
    currentNumber += data;
    console.log(currentNumber);
    io.sockets.in('room1').emit('updated', currentNumber);
  });

  socket.on('disconnect', () => {
    socket.leave('room1'); // remove user from room
  });
});

console.log(`Listening on port ${PORT}`);
