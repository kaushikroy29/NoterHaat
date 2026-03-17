require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();


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

// Routes
const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');
const adminRoutes = require('./routes/admin');
const wantedRoutes = require('./routes/wanted');
const usersRoutes = require('./routes/users');
const messagesRoutes = require('./routes/messages');
const offersRoutes = require('./routes/offers');

// Basic Route
app.get('/', (req, res) => {
  res.send('NoterHaat API is running...');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wanted', wantedRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/offers', offersRoutes);
app.use('/api/gifts', require('./routes/gifts'));

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
