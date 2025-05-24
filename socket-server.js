import { Server } from 'socket.io';
import express from 'express';
import http from 'http';

const app = express();
app.use(express.json());

// Create an HTTP server and attach both Express and Socket.IO to it
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // For dev only! Restrict in production.
  },
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// HTTP endpoint to emit events from your API routes
app.post('/emit', (req, res) => {
  const { event, data } = req.body;
  io.emit(event, data);
  res.sendStatus(200);
});

server.listen(4000, () => {
  console.log('Socket.IO and emit endpoint running on port 4000');
});
