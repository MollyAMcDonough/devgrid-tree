import { Server } from 'socket.io';
import express from 'express';
import http from 'http';

const app = express();
app.use(express.json());

// Create an HTTP server and attach both Express and Socket.IO to it
const server = http.createServer(app);

// Use CORS_ORIGIN env var in production, fallback to * for local/dev
const allowedOrigin = process.env.CORS_ORIGIN || '*';

const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ['GET', 'POST'],
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

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Socket.IO and emit endpoint running on port ${PORT}`);
});
