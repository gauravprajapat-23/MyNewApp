import { Router, Request, Response } from 'express';
import { pool } from '../server';

const router = Router();

// Create or get user by phone
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { phone, fullName, email, isAgent = false } = req.body;

    if (!phone || !fullName) {
      return res.status(400).json({
        success: false,
        error: 'Phone and fullName are required',
      });
    }

    // Check if user exists
    const existingUser = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);

    if (existingUser.rows.length > 0) {
      return res.json({
        success: true,
        message: 'User login successful',
        data: existingUser.rows[0],
      });
    }

    // Create new user
    const result = await pool.query(
      'INSERT INTO users (phone, full_name, email, is_agent) VALUES ($1, $2, $3, $4) RETURNING *',
      [phone, fullName, email || null, isAgent]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
    });
  }
});

// Get user by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
    });
  }
});

// Update user
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { full_name, email, is_agent } = req.body;

    const result = await pool.query(
      'UPDATE users SET full_name = COALESCE($1, full_name), email = COALESCE($2, email), is_agent = COALESCE($3, is_agent), updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [full_name, email, is_agent, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
    });
  }
});

export default router;
