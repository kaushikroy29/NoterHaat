const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// Initialize app
const app = express();
const server = http.createServer(app);

// Socket.IO for Real-time chat & offers
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('NoterHaat API is running...');
});

// Mocking some API routes for frontend mock integration
app.get('/api/listings', (req, res) => {
  // Normally would fetch from MongoDB
  res.json({ message: 'Listings endpoint working' });
});

// Socket logic
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // When a user makes an offer on a note
  socket.on('send_offer', (data) => {
    // Save to DB here...
    io.emit('receive_offer', data);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
