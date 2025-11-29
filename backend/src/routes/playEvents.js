import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { createPlayEvent } from '../services/playEventService.js';

const router = express.Router();

// Create single play event
router.post('/', [
  authenticate,
  body('song_id').notEmpty(),
  body('timestamp').optional().isISO8601(),
  body('source').isIn(['background_listen', 'manual', 'dj_controller', 'radio', 'streaming']),
  body('confidence_score').optional().isFloat({ min: 0, max: 100 }),
  body('venue_id').optional().isUUID(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const playEvent = await createPlayEvent({
      ...req.body,
      user_id: req.user.user_id,
    });

    res.status(201).json({
      success: true,
      data: { playEvent },
    });
  } catch (error) {
    next(error);
  }
});

// Get play events (with filters)
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { song_id, venue_id, start_date, end_date, limit = 100, offset = 0 } = req.query;

    // Build query dynamically
    let query = 'SELECT * FROM play_events WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (song_id) {
      query += ` AND song_id = $${paramIndex++}`;
      params.push(song_id);
    }

    if (venue_id) {
      query += ` AND venue_id = $${paramIndex++}`;
      params.push(venue_id);
    }

    if (start_date) {
      query += ` AND timestamp >= $${paramIndex++}`;
      params.push(start_date);
    }

    if (end_date) {
      query += ` AND timestamp <= $${paramIndex++}`;
      params.push(end_date);
    }

    query += ` ORDER BY timestamp DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(parseInt(limit), parseInt(offset));

    const pool = (await import('../database/connection.js')).default;
    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: {
        plays: result.rows,
        count: result.rows.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

