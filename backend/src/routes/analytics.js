import express from 'express';
import { authenticate } from '../middleware/auth.js';
import pool from '../database/connection.js';

const router = express.Router();

// Get top songs
router.get('/top-songs', async (req, res, next) => {
  try {
    const { period = '7d', limit = 50 } = req.query;
    
    const periodMap = {
      '1d': "1 day",
      '7d': "7 days",
      '30d': "30 days",
      '90d': "90 days",
      'all': null,
    };

    const periodClause = periodMap[period] 
      ? `AND timestamp > NOW() - INTERVAL '${periodMap[period]}'`
      : '';

    const result = await pool.query(
      `SELECT 
        s.song_id,
        s.title,
        a.name as artist_name,
        COUNT(*) as play_count,
        COUNT(DISTINCT pe.venue_id) as unique_venues,
        AVG(pe.confidence_score) as avg_confidence
      FROM play_events pe
      JOIN songs s ON pe.song_id = s.song_id
      LEFT JOIN artists a ON s.artist_id = a.artist_id
      WHERE 1=1 ${periodClause}
      GROUP BY s.song_id, s.title, a.name
      ORDER BY play_count DESC
      LIMIT $1`,
      [parseInt(limit)]
    );

    res.json({
      success: true,
      data: { songs: result.rows },
    });
  } catch (error) {
    next(error);
  }
});

// Get top artists
router.get('/top-artists', async (req, res, next) => {
  try {
    const { period = '7d', limit = 50 } = req.query;
    
    const periodMap = {
      '1d': "1 day",
      '7d': "7 days",
      '30d': "30 days",
      '90d': "90 days",
      'all': null,
    };

    const periodClause = periodMap[period] 
      ? `AND pe.timestamp > NOW() - INTERVAL '${periodMap[period]}'`
      : '';

    const result = await pool.query(
      `SELECT 
        a.artist_id,
        a.name,
        COUNT(*) as total_plays,
        COUNT(DISTINCT pe.song_id) as unique_songs,
        COUNT(DISTINCT pe.venue_id) as unique_venues
      FROM play_events pe
      JOIN songs s ON pe.song_id = s.song_id
      JOIN artists a ON s.artist_id = a.artist_id
      WHERE 1=1 ${periodClause}
      GROUP BY a.artist_id, a.name
      ORDER BY total_plays DESC
      LIMIT $1`,
      [parseInt(limit)]
    );

    res.json({
      success: true,
      data: { artists: result.rows },
    });
  } catch (error) {
    next(error);
  }
});

// Get artist analytics
router.get('/artists/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { start_date, end_date } = req.query;

    // Verify artist ownership or admin
    const artistCheck = await pool.query(
      'SELECT user_id FROM artists WHERE artist_id = $1',
      [id]
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

    // Get play statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_plays,
        COUNT(DISTINCT pe.venue_id) as unique_venues,
        COUNT(DISTINCT pe.song_id) as songs_played,
        AVG(pe.confidence_score) as avg_confidence,
        DATE_TRUNC('day', pe.timestamp) as date,
        COUNT(*) as daily_plays
      FROM play_events pe
      JOIN songs s ON pe.song_id = s.song_id
      WHERE s.artist_id = $1
        ${start_date ? `AND pe.timestamp >= $2` : ''}
        ${end_date ? `AND pe.timestamp <= $3` : ''}
      GROUP BY DATE_TRUNC('day', pe.timestamp)
      ORDER BY date DESC
    `;

    const params = [id];
    if (start_date) params.push(start_date);
    if (end_date) params.push(end_date);

    const result = await pool.query(statsQuery, params);

    res.json({
      success: true,
      data: { analytics: result.rows },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

