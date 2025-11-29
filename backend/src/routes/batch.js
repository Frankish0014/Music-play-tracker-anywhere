import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { processBatchPlays } from '../services/playEventService.js';
import { registerOrUpdateDevice } from '../services/deviceService.js';

const router = express.Router();

// Batch play events upload (for always-on background detection)
router.post('/plays', [
  authenticate,
  body('device_id').notEmpty(),
  body('plays').isArray({ min: 1 }),
  body('plays.*.song_id').notEmpty(),
  body('plays.*.timestamp').isISO8601(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { device_id, phone_model, os_version, app_version, plays } = req.body;

    // Register or update device
    await registerOrUpdateDevice({
      device_id,
      user_id: req.user.user_id,
      phone_model,
      os_version,
      app_version,
    });

    // Process batch of plays
    const result = await processBatchPlays({
      device_id,
      plays,
      user_id: req.user.user_id,
    });

    res.json({
      success: true,
      data: {
        plays_recorded: result.processed,
        plays_skipped: result.skipped,
        fraud_flags: result.fraudFlags,
        next_sync: 3600, // Suggest sync in 1 hour
        song_database_version: '2025.01.15.v1', // TODO: Implement versioning
        new_songs_available: 0, // TODO: Calculate new songs
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

