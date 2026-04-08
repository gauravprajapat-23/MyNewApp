import { Router, Request, Response } from 'express';
import { pool } from '../server';

const router = Router();

// Get user's favorites
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT a.*, f.created_at as favorited_at
       FROM favorites f
       JOIN agents a ON f.agent_id = a.id
       WHERE f.user_id = $1
       ORDER BY f.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch favorites',
    });
  }
});

// Add to favorites
router.post('/', async (req: Request, res: Response) => {
  try {
    const { user_id, agent_id } = req.body;

    if (!user_id || !agent_id) {
      return res.status(400).json({
        success: false,
        error: 'user_id and agent_id are required',
      });
    }

    // Check if already favorited
    const existing = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND agent_id = $2',
      [user_id, agent_id]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Already in favorites',
      });
    }

    const result = await pool.query(
      'INSERT INTO favorites (user_id, agent_id) VALUES ($1, $2) RETURNING *',
      [user_id, agent_id]
    );

    res.status(201).json({
      success: true,
      message: 'Added to favorites',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add favorite',
    });
  }
});

// Remove from favorites
router.delete('/:userId/:agentId', async (req: Request, res: Response) => {
  try {
    const { userId, agentId } = req.params;

    const result = await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND agent_id = $2 RETURNING *',
      [userId, agentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Favorite not found',
      });
    }

    res.json({
      success: true,
      message: 'Removed from favorites',
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove favorite',
    });
  }
});

// Check if agent is favorited
router.get('/check/:userId/:agentId', async (req: Request, res: Response) => {
  try {
    const { userId, agentId } = req.params;

    const result = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND agent_id = $2',
      [userId, agentId]
    );

    res.json({
      success: true,
      is_favorite: result.rows.length > 0,
    });
  } catch (error) {
    console.error('Error checking favorite:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check favorite status',
    });
  }
});

export default router;
