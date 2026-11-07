'use strict';

require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const { initSocket, getConnectedDrivers } = require('./socket/socketHandler');
const authMiddleware = require('./middleware/authMiddleware');
const indexRouter = require('./routes/index');
const healthRouter = require('./routes/healthRoute');

const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:4200';

// ─── Express app ────────────────────────────────────────────────────────────
const app = express();

app.use(cors({
  origin: CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── HTTP server ─────────────────────────────────────────────────────────────
const server = http.createServer(app);

// ─── Socket.io ───────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// Attach JWT auth middleware to Socket.io
io.use(authMiddleware.socketAuth);

// Initialise all socket event handlers
initSocket(io);

// ─── Routes ──────────────────────────────────────────────────────────────────
// Pass the io instance and drivers map into the router factory
app.use('/', healthRouter);
app.use('/', indexRouter(io, getConnectedDrivers));

// ─── Global error handler ────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// ─── Start ───────────────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`[MotoTaxi] Real-time server running on port ${PORT}`);
  console.log(`[MotoTaxi] CORS origin: ${CORS_ORIGIN}`);
  console.log(`[MotoTaxi] Spring Boot API: ${process.env.SPRING_API_URL}`);
});

module.exports = { app, server, io };
