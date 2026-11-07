'use strict';

const express = require('express');

const router = express.Router();

/**
 * GET /health
 * Simple liveness probe.
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'mototaxi-realtime',
    timestamp: new Date(),
  });
});

module.exports = router;
