'use strict';

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'MotoTaxiSecretKey2026VeryLongSecretKeyForJWTGeneration';

/**
 * HTTP middleware — attaches decoded JWT payload to req.user.
 * Usage: app.use(authMiddleware.httpAuth)  or  router.use(authMiddleware.httpAuth)
 */
function httpAuth(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const token = authHeader.slice(7); // strip "Bearer "

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Socket.io middleware — attaches decoded JWT payload to socket.user.
 * Clients must pass the token via:
 *   socket = io(url, { auth: { token: '<jwt>' } })
 * OR via handshake query:
 *   socket = io(url, { query: { token: '<jwt>' } })
 */
function socketAuth(socket, next) {
  // Try auth object first (preferred), then query param, then Authorization header
  const token =
    (socket.handshake.auth && socket.handshake.auth.token) ||
    (socket.handshake.query && socket.handshake.query.token) ||
    (() => {
      const header = socket.handshake.headers['authorization'] || '';
      return header.startsWith('Bearer ') ? header.slice(7) : null;
    })();

  if (!token) {
    return next(new Error('Authentication error: no token provided'));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.user = decoded; // { id, role, ... }
    next();
  } catch (err) {
    return next(new Error('Authentication error: invalid or expired token'));
  }
}

module.exports = { httpAuth, socketAuth };
