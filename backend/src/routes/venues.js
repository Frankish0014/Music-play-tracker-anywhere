import express from 'express';
import { authenticate } from '../middleware/auth.js';
import pool from '../database/connection.js';

const router = express.Router();

// Get all venues
router.get('/', async (req, res, next) => {
  try {
    const { search, type, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM venues WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (search) {
      query += ` AND name ILIKE $${paramIndex++}`;
      params.push(`%${search}%`);
    }

    if (type) {
      query += ` AND type = $${paramIndex++}`;
      params.push(type);
    }

    query += ` ORDER BY name LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: { venues: result.rows },
    });
  } catch (error) {
    next(error);
  }
});

// Get venue by ID
router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM venues WHERE venue_id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Venue not found' },
      });
    }

    res.json({
      success: true,
      data: { venue: result.rows[0] },
    });
  } catch (error) {
    next(error);
  }
});

// Create venue
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { name, type, location_lat, location_lng, address } = req.body;

    const result = await pool.query(
      `INSERT INTO venues (user_id, name, type, location_lat, location_lng, address)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.user_id, name, type, location_lat, location_lng, address]
    );

    res.status(201).json({
      success: true,
      data: { venue: result.rows[0] },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

