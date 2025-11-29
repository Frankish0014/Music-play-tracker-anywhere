import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import pool from '../database/connection.js';

const router = express.Router();

// Get all songs
router.get('/', async (req, res, next) => {
  try {
    const { search, artist_id, genre, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT s.*, a.name as artist_name, a.artist_id
      FROM songs s
      LEFT JOIN artists a ON s.artist_id = a.artist_id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (search) {
      query += ` AND (s.title ILIKE $${paramIndex} OR a.name ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (artist_id) {
      query += ` AND s.artist_id = $${paramIndex++}`;
      params.push(artist_id);
    }

    if (genre) {
      query += ` AND s.genre = $${paramIndex++}`;
      params.push(genre);
    }

    query += ` ORDER BY s.title LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: { songs: result.rows },
    });
  } catch (error) {
    next(error);
  }
});

// Get song by ID
router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT s.*, a.name as artist_name, a.artist_id
       FROM songs s
       LEFT JOIN artists a ON s.artist_id = a.artist_id
       WHERE s.song_id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Song not found' },
      });
    }

    res.json({
      success: true,
      data: { song: result.rows[0] },
    });
  } catch (error) {
    next(error);
  }
});

// Create song (admin or artist)
router.post('/', authenticate, authorize('admin', 'artist'), async (req, res, next) => {
  try {
    const { song_id, title, artist_id, genre, duration, release_date, fingerprint, metadata } = req.body;

    // If artist, verify they own the artist_id
    if (req.user.role === 'artist') {
      const artistCheck = await pool.query(
        'SELECT artist_id FROM artists WHERE artist_id = $1 AND user_id = $2',
        [artist_id, req.user.user_id]
      );

      if (artistCheck.rows.length === 0) {
        return res.status(403).json({
          success: false,
          error: { message: 'Not authorized to create songs for this artist' },
        });
      }
    }

    const result = await pool.query(
      `INSERT INTO songs (song_id, title, artist_id, genre, duration, release_date, fingerprint, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [song_id, title, artist_id, genre, duration, release_date, fingerprint, metadata ? JSON.stringify(metadata) : null]
    );

    res.status(201).json({
      success: true,
      data: { song: result.rows[0] },
    });
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({
        success: false,
        error: { message: 'Song ID already exists' },
      });
    }
    next(error);
  }
});

export default router;

