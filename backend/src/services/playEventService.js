import pool from '../database/connection.js';
import { detectFraud } from './fraudDetectionService.js';

export async function createPlayEvent(data) {
  const {
    song_id,
    venue_id,
    device_id,
    timestamp = new Date(),
    source,
    confidence_score,
    duration_played,
    location_lat,
    location_lng,
    metadata,
    user_id,
  } = data;

  // Verify song exists
  const songCheck = await pool.query('SELECT song_id FROM songs WHERE song_id = $1', [song_id]);
  if (songCheck.rows.length === 0) {
    throw new Error('Song not found');
  }

  // Insert play event
  const result = await pool.query(
    `INSERT INTO play_events (
      song_id, venue_id, device_id, timestamp, source,
      confidence_score, duration_played, location_lat, location_lng, metadata
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *`,
    [
      song_id,
      venue_id || null,
      device_id || null,
      timestamp,
      source,
      confidence_score || null,
      duration_played || null,
      location_lat || null,
      location_lng || null,
      metadata ? JSON.stringify(metadata) : null,
    ]
  );

  const playEvent = result.rows[0];

  // Fraud detection (async, don't block)
  detectFraud(playEvent).catch(console.error);

  return playEvent;
}

export async function processBatchPlays({ device_id, plays, user_id }) {
  const processed = [];
  const skipped = [];
  const fraudFlags = [];

  for (const play of plays) {
    try {
      // Basic validation
      if (!play.song_id || !play.timestamp) {
        skipped.push({ play, reason: 'Missing required fields' });
        continue;
      }

      // Check for duplicates (same song, same device, within 30 seconds)
      const duplicateCheck = await pool.query(
        `SELECT event_id FROM play_events
         WHERE device_id = $1 AND song_id = $2
         AND timestamp BETWEEN $3 - INTERVAL '30 seconds' AND $3 + INTERVAL '30 seconds'
         LIMIT 1`,
        [device_id, play.song_id, play.timestamp]
      );

      if (duplicateCheck.rows.length > 0) {
        skipped.push({ play, reason: 'Duplicate play detected' });
        continue;
      }

      // Create play event
      const playEvent = await createPlayEvent({
        song_id: play.song_id,
        venue_id: play.venue_id,
        device_id,
        timestamp: play.timestamp,
        source: play.source || 'background_listen',
        confidence_score: play.confidence,
        location_lat: play.location?.lat,
        location_lng: play.location?.lng,
        metadata: play.metadata || {},
        user_id,
      });

      processed.push(playEvent);

      // Check for fraud (synchronous for batch)
      const fraudCheck = await detectFraud(playEvent);
      if (fraudCheck.flagged) {
        fraudFlags.push({
          event_id: playEvent.event_id,
          flags: fraudCheck.flags,
        });
      }
    } catch (error) {
      console.error('Error processing play:', error);
      skipped.push({ play, reason: error.message });
    }
  }

  return { processed, skipped, fraudFlags };
}

export async function getPlayStats(songId, startDate, endDate) {
  const result = await pool.query(
    `SELECT 
      COUNT(*) as total_plays,
      COUNT(DISTINCT venue_id) as unique_venues,
      COUNT(DISTINCT device_id) as unique_devices,
      AVG(confidence_score) as avg_confidence
    FROM play_events
    WHERE song_id = $1
      AND timestamp BETWEEN $2 AND $3`,
    [songId, startDate, endDate]
  );

  return result.rows[0];
}

