'use strict';

/**
 * connectedDrivers: Map<driverId (string), socketId (string)>
 * Exported so that the REST routes can read currently-online drivers.
 */
const connectedDrivers = new Map();

/**
 * initSocket(io)
 * Registers all Socket.io event handlers on the given io server instance.
 */
function initSocket(io) {
  io.on('connection', (socket) => {
    const user = socket.user; // set by authMiddleware.socketAuth
    console.log(`[Socket] Connected — id=${socket.id} userId=${user.id} role=${user.role}`);

    // ── Join role-based rooms ─────────────────────────────────────────────────
    switch (user.role) {
      case 'DRIVER':
        socket.join(`driver:${user.id}`);
        connectedDrivers.set(String(user.id), socket.id);
        console.log(`[Socket] Driver ${user.id} joined room driver:${user.id}`);
        break;

      case 'CUSTOMER':
        socket.join(`customer:${user.id}`);
        console.log(`[Socket] Customer ${user.id} joined room customer:${user.id}`);
        break;

      case 'ADMIN':
        socket.join('admin');
        console.log(`[Socket] Admin ${user.id} joined room admin`);
        break;

      default:
        console.warn(`[Socket] Unknown role "${user.role}" for user ${user.id}`);
    }

    // ── 1. driver:updateLocation ──────────────────────────────────────────────
    // Payload: { driverId, lat, lng, rideId? }
    socket.on('driver:updateLocation', (payload) => {
      const { driverId, lat, lng, rideId } = payload;
      const locationData = { driverId, lat, lng, timestamp: new Date() };

      // Broadcast to ride room if an active ride is in progress
      if (rideId) {
        io.to(`ride:${rideId}`).emit('driver:locationUpdated', locationData);
      }

      // Always notify admin
      io.to('admin').emit('driver:locationUpdated', locationData);
    });

    // ── 2. driver:online ──────────────────────────────────────────────────────
    // Payload: { driverId }
    socket.on('driver:online', (payload) => {
      const { driverId } = payload;
      connectedDrivers.set(String(driverId), socket.id);
      io.to('admin').emit('driver:onlineStatus', { driverId, online: true, timestamp: new Date() });
      console.log(`[Socket] Driver ${driverId} is now ONLINE`);
    });

    // ── 3. driver:offline ─────────────────────────────────────────────────────
    // Payload: { driverId }
    socket.on('driver:offline', (payload) => {
      const { driverId } = payload;
      connectedDrivers.delete(String(driverId));
      io.to('admin').emit('driver:offlineStatus', { driverId, online: false, timestamp: new Date() });
      console.log(`[Socket] Driver ${driverId} is now OFFLINE`);
    });

    // ── 4. ride:newRequest ────────────────────────────────────────────────────
    // Payload: { rideId, customerId, driverId, originAddress, destAddress, price }
    // Sent by the backend (Spring Boot via REST) or the customer client.
    socket.on('ride:newRequest', (payload) => {
      const { rideId, customerId, driverId, originAddress, destAddress, price } = payload;
      console.log(`[Socket] ride:newRequest — rideId=${rideId} → driver=${driverId}`);

      io.to(`driver:${driverId}`).emit('ride:incomingRequest', {
        rideId,
        customerId,
        driverId,
        originAddress,
        destAddress,
        price,
        requestedAt: new Date(),
      });
    });

    // ── 5. ride:accepted ──────────────────────────────────────────────────────
    // Payload: { rideId, driverId, customerId }
    socket.on('ride:accepted', (payload) => {
      const { rideId, driverId, customerId } = payload;

      // Let both driver and customer join the shared ride room
      socket.join(`ride:${rideId}`);

      io.to(`customer:${customerId}`).emit('ride:driverAccepted', {
        rideId,
        driverId,
        customerId,
        acceptedAt: new Date(),
      });

      console.log(`[Socket] ride:accepted — rideId=${rideId} driver=${driverId} customer=${customerId}`);
    });

    // ── 6. ride:rejected ──────────────────────────────────────────────────────
    // Payload: { rideId, driverId, customerId }
    socket.on('ride:rejected', (payload) => {
      const { rideId, driverId, customerId } = payload;

      io.to(`customer:${customerId}`).emit('ride:driverRejected', {
        rideId,
        driverId,
        customerId,
        rejectedAt: new Date(),
      });

      console.log(`[Socket] ride:rejected — rideId=${rideId} driver=${driverId} customer=${customerId}`);
    });

    // ── 7. ride:started ───────────────────────────────────────────────────────
    // Payload: { rideId, customerId }
    socket.on('ride:started', (payload) => {
      const { rideId, customerId } = payload;

      // Ensure the customer socket is in the ride room
      const customerSocketId = [...io.sockets.sockets.values()]
        .find((s) => s.user && String(s.user.id) === String(customerId))?.id;

      if (customerSocketId) {
        io.sockets.sockets.get(customerSocketId)?.join(`ride:${rideId}`);
      }

      io.to(`ride:${rideId}`).emit('ride:inProgress', {
        rideId,
        startedAt: new Date(),
      });

      console.log(`[Socket] ride:started — rideId=${rideId}`);
    });

    // ── 8. ride:completed ─────────────────────────────────────────────────────
    // Payload: { rideId, customerId }
    socket.on('ride:completed', (payload) => {
      const { rideId, customerId } = payload;

      io.to(`ride:${rideId}`).emit('ride:done', {
        rideId,
        customerId,
        completedAt: new Date(),
      });

      console.log(`[Socket] ride:completed — rideId=${rideId}`);
    });

    // ── 9. customer:sos ───────────────────────────────────────────────────────
    // Payload: { customerId, lat, lng, rideId? }
    socket.on('customer:sos', (payload) => {
      const { customerId, lat, lng, rideId } = payload;

      const alert = {
        type: 'SOS',
        customerId,
        lat,
        lng,
        rideId: rideId || null,
        alertedAt: new Date(),
      };

      io.to('admin').emit('sos:alert', alert);
      console.warn(`[Socket] ⚠️  SOS from customer ${customerId} at (${lat}, ${lng})`);
    });

    // ── 10. disconnect ────────────────────────────────────────────────────────
    socket.on('disconnect', (reason) => {
      console.log(`[Socket] Disconnected — id=${socket.id} userId=${user.id} reason=${reason}`);

      // Remove driver from online map if applicable
      if (user.role === 'DRIVER') {
        connectedDrivers.delete(String(user.id));
        io.to('admin').emit('driver:offlineStatus', {
          driverId: user.id,
          online: false,
          timestamp: new Date(),
        });
      }
    });
  });
}

/**
 * Returns the current connectedDrivers Map.
 * Used by REST routes to expose a /api/connected-drivers endpoint.
 */
function getConnectedDrivers() {
  return connectedDrivers;
}

module.exports = { initSocket, getConnectedDrivers };
