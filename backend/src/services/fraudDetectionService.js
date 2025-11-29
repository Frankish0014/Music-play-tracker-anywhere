import pool from '../database/connection.js';
import { getDeviceReputation, updateDeviceReputation } from './deviceService.js';

export async function detectFraud(playEvent) {
  const flags = [];
  let severity = 'low';

  // Check device reputation
  if (playEvent.device_id) {
    const device = await getDeviceReputation(playEvent.device_id);
    
    if (device.reputation_score < 30) {
      flags.push({
        type: 'low_reputation',
        severity: 'high',
        description: `Device reputation score is ${device.reputation_score}`,
      });
      severity = 'high';
    }
  }

  // Check for impossible geographic movement
  if (playEvent.location_lat && playEvent.location_lng && playEvent.device_id) {
    const recentPlays = await pool.query(
      `SELECT location_lat, location_lng, timestamp
       FROM play_events
       WHERE device_id = $1
         AND timestamp > $2 - INTERVAL '1 hour'
         AND location_lat IS NOT NULL
       ORDER BY timestamp DESC
       LIMIT 1`,
      [playEvent.device_id, playEvent.timestamp]
    );

    if (recentPlays.rows.length > 0) {
      const prevPlay = recentPlays.rows[0];
      const distance = calculateDistance(
        prevPlay.location_lat,
        prevPlay.location_lng,
        playEvent.location_lat,
        playEvent.location_lng
      );
      const timeDiff = (new Date(playEvent.timestamp) - new Date(prevPlay.timestamp)) / 1000 / 60; // minutes

      // If moved more than 100km in less than 10 minutes, flag it
      if (distance > 100 && timeDiff < 10) {
        flags.push({
          type: 'impossible_movement',
          severity: 'high',
          description: `Device moved ${distance.toFixed(2)}km in ${timeDiff.toFixed(2)} minutes`,
        });
        severity = 'high';
      }
    }
  }

  // Check for excessive plays from same device
  const playCount = await pool.query(
    `SELECT COUNT(*) as count
     FROM play_events
     WHERE device_id = $1
       AND timestamp > $2 - INTERVAL '1 hour'`,
    [playEvent.device_id, playEvent.timestamp]
  );

  if (playCount.rows[0].count > 500) {
    flags.push({
      type: 'excessive_plays',
      severity: 'medium',
      description: `Device reported ${playCount.rows[0].count} plays in the last hour`,
    });
    if (severity === 'low') severity = 'medium';
  }

  // Check for same song repeated too many times
  const sameSongCount = await pool.query(
    `SELECT COUNT(*) as count
     FROM play_events
     WHERE device_id = $1 AND song_id = $2
       AND timestamp > $3 - INTERVAL '24 hours'`,
    [playEvent.device_id, playEvent.song_id, playEvent.timestamp]
  );

  if (sameSongCount.rows[0].count > 200) {
    flags.push({
      type: 'song_spam',
      severity: 'medium',
      description: `Same song played ${sameSongCount.rows[0].count} times in 24 hours`,
    });
    if (severity === 'low') severity = 'medium';
  }

  // Check confidence score
  if (playEvent.confidence_score && playEvent.confidence_score < 60) {
    flags.push({
      type: 'low_confidence',
      severity: 'low',
      description: `Low confidence score: ${playEvent.confidence_score}`,
    });
  }

  // If fraud detected, record flags and update device reputation
  if (flags.length > 0) {
    for (const flag of flags) {
      await pool.query(
        `INSERT INTO fraud_flags (device_id, event_id, flag_type, severity, description)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          playEvent.device_id,
          playEvent.event_id,
          flag.type,
          flag.severity,
          flag.description,
        ]
      );
    }

    // Reduce device reputation
    if (playEvent.device_id) {
      const device = await getDeviceReputation(playEvent.device_id);
      const newScore = Math.max(0, device.reputation_score - (flags.length * 5));
      await updateDeviceReputation(playEvent.device_id, newScore);
    }
  }

  return {
    flagged: flags.length > 0,
    flags,
    severity,
  };
}

// Haversine formula for distance calculation
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

