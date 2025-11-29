import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import pool from '../database/connection.js';

const router = express.Router();

// Get current user profile
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT user_id, email, role, name, phone, verified, created_at FROM users WHERE user_id = $1',
      [req.user.user_id]
    );

    res.json({
      success: true,
      data: { user: result.rows[0] },
    });
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/me', authenticate, async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET name = COALESCE($1, name),
           phone = COALESCE($2, phone)
       WHERE user_id = $3
       RETURNING user_id, email, role, name, phone, verified`,
      [name, phone, req.user.user_id]
    );

    res.json({
      success: true,
      data: { user: result.rows[0] },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

