'use strict';

const express = require('express');

/**
 * indexRouter(io, getConnectedDrivers)
 *
 * Factory function that returns a configured Express Router.
 * Receives the Socket.io server instance and a getter for the
 * connected-drivers Map so that REST endpoints can emit events
 * and read real-time state.
 *
 * @param {import('socket.io').Server} io
 * @param {() => Map<string, string>} getConnectedDrivers
 * @returns {express.Router}
 */
function indexRouter(io, getConnectedDrivers) {
  const router = express.Router();

  // ── GET /health (alias — primary definition is in healthRoute.js) ──────────
  router.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'mototaxi-realtime',
      timestamp: new Date(),
    });
  });

  // ── GET /api/connected-drivers ─────────────────────────────────────────────
  // Returns an array of driver IDs that currently have an active socket.
  router.get('/api/connected-drivers', (req, res) => {
    const driversMap = getConnectedDrivers();
    const drivers = [];

    driversMap.forEach((socketId, driverId) => {
      drivers.push({ driverId, socketId });
    });

    res.status(200).json({
      count: drivers.length,
      drivers,
      timestamp: new Date(),
    });
  });

  // ── POST /api/notify/ride-request ──────────────────────────────────────────
  // Called by Spring Boot (port 8080) to push a ride request notification to
  // a specific driver through Socket.io.
  //
  // Body: {
  //   driverId        : string | number,
  //   rideId          : string | number,
  //   customerId      : string | number,
  //   originAddress   : string,
  //   destAddress     : string,
  //   estimatedPrice  : number
  // }
  router.post('/api/notify/ride-request', (req, res) => {
    const {
      driverId,
      rideId,
      customerId,
      originAddress,
      destAddress,
      estimatedPrice,
    } = req.body;

    // Basic validation
    if (!driverId || !rideId || !customerId) {
      return res.status(400).json({
        error: 'Missing required fields: driverId, rideId, customerId',
      });
    }

    const targetRoom = `driver:${driverId}`;
    const payload = {
      rideId,
      customerId,
      driverId,
      originAddress: originAddress || '',
      destAddress: destAddress || '',
      price: estimatedPrice || 0,
      requestedAt: new Date(),
    };

    // Emit the event to the driver's dedicated room
    io.to(targetRoom).emit('ride:incomingRequest', payload);

    console.log(`[REST] Notified driver ${driverId} of ride request ${rideId}`);

    return res.status(200).json({
      success: true,
      message: `Notification sent to driver ${driverId}`,
      rideId,
    });
  });

  return router;
}

module.exports = indexRouter;
