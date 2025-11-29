import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import pool from '../database/connection.js';

const router = express.Router();

// Get all artists
router.get('/', async (req, res, next) => {
  try {
    const { search, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM artists WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (search) {
      query += ` AND (name ILIKE $${paramIndex} OR genre ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY name LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: { artists: result.rows },
    });
  } catch (error) {
    next(error);
  }
});

// Get artist by ID
router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM artists WHERE artist_id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Artist not found' },
      });
    }

    res.json({
      success: true,
      data: { artist: result.rows[0] },
    });
  } catch (error) {
    next(error);
  }
});

// Update artist (own profile or admin)
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { name, bio, genre, profile_image_url } = req.body;

    // Check if user owns this artist profile or is admin
    const artistCheck = await pool.query(
      'SELECT user_id FROM artists WHERE artist_id = $1',
      [req.params.id]
    );

    if (artistCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Artist not found' },
      });
    }

    if (artistCheck.rows[0].user_id !== req.user.user_id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Not authorized' },
      });
    }

    const result = await pool.query(
      `UPDATE artists 
       SET name = COALESCE($1, name),
           bio = COALESCE($2, bio),
           genre = COALESCE($3, genre),
           profile_image_url = COALESCE($4, profile_image_url)
       WHERE artist_id = $5
       RETURNING *`,
      [name, bio, genre, profile_image_url, req.params.id]
    );

    res.json({
      success: true,
      data: { artist: result.rows[0] },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

