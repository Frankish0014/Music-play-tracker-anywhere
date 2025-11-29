import pool from '../database/connection.js';
import crypto from 'crypto';

export async function registerOrUpdateDevice({ device_id, user_id, phone_model, os_version, app_version, imei }) {
  // Generate device fingerprint
  const fingerprintData = `${device_id}-${phone_model}-${os_version}-${imei || ''}`;
  const fingerprintHash = crypto.createHash('sha256').update(fingerprintData).digest('hex');

  // Check if device exists
  const existing = await pool.query('SELECT device_id FROM devices WHERE device_id = $1', [device_id]);

  if (existing.rows.length > 0) {
    // Update device
    await pool.query(
      `UPDATE devices 
       SET user_id = $1, phone_model = $2, os_version = $3, app_version = $4,
           last_seen = CURRENT_TIMESTAMP
       WHERE device_id = $5`,
      [user_id, phone_model, os_version, app_version, device_id]
    );
  } else {
    // Register new device
    await pool.query(
      `INSERT INTO devices (device_id, user_id, phone_model, os_version, app_version, imei, fingerprint_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [device_id, user_id, phone_model, os_version, app_version, imei || null, fingerprintHash]
    );
  }
}

export async function getDeviceReputation(device_id) {
  const result = await pool.query(
    'SELECT reputation_score, is_verified FROM devices WHERE device_id = $1',
    [device_id]
  );

  if (result.rows.length === 0) {
    return { reputation_score: 50, is_verified: false }; // Default for new devices
  }

  return result.rows[0];
}

export async function updateDeviceReputation(device_id, score) {
  await pool.query(
    'UPDATE devices SET reputation_score = $1 WHERE device_id = $2',
    [Math.max(0, Math.min(100, score)), device_id]
  );
}

