import { Router, Request, Response } from 'express';
import { pool } from '../server';

const router = Router();

// Create a new transaction
router.post('/', async (req: Request, res: Response) => {
  try {
    const { user_id, agent_id, type, amount, commission, description } = req.body;

    if (!agent_id || !type || !amount || !commission) {
      return res.status(400).json({
        success: false,
        error: 'agent_id, type, amount, and commission are required',
      });
    }

    const result = await pool.query(
      `INSERT INTO transactions (user_id, agent_id, type, amount, commission, description) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_id || null, agent_id, type, amount, commission, description || null]
    );

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create transaction',
    });
  }
});

// Get all transactions
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, type, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM transactions WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (status) {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (type) {
      query += ` AND type = $${paramCount}`;
      params.push(type);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit as string), parseInt(offset as string));

    const result = await pool.query(query, params);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions',
    });
  }
});

// Get transactions by user
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT t.*, a.name as agent_name
       FROM transactions t
       JOIN agents a ON t.agent_id = a.id
       WHERE t.user_id = $1
       ORDER BY t.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, parseInt(limit as string), parseInt(offset as string)]
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user transactions',
    });
  }
});

// Get transactions by agent
router.get('/agent/:agentId', async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const { status, limit = 50, offset = 0 } = req.query;

    let query = `SELECT t.*, u.full_name as user_name
                 FROM transactions t
                 LEFT JOIN users u ON t.user_id = u.id
                 WHERE t.agent_id = $1`;
    const params: any[] = [agentId];
    let paramCount = 2;

    if (status) {
      query += ` AND t.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    query += ` ORDER BY t.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit as string), parseInt(offset as string));

    const result = await pool.query(query, params);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching agent transactions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch agent transactions',
    });
  }
});

// Update transaction status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'completed', 'failed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status',
      });
    }

    const result = await pool.query(
      'UPDATE transactions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found',
      });
    }

    res.json({
      success: true,
      message: 'Transaction updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update transaction',
    });
  }
});

// Get transaction by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT t.*, a.name as agent_name, u.full_name as user_name
       FROM transactions t
       JOIN agents a ON t.agent_id = a.id
       LEFT JOIN users u ON t.user_id = u.id
       WHERE t.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transaction',
    });
  }
});

export default router;
