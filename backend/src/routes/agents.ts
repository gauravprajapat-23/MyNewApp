import { Router, Request, Response } from 'express';
import { pool } from '../server';

const router = Router();

// Get all agents with optional filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, services, sortBy = 'rating', limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM agents WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    // Filter by status
    if (status) {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    // Filter by services
    if (services) {
      const servicesArray = (services as string).split(',');
      query += ` AND services && $${paramCount}`;
      params.push(servicesArray);
      paramCount++;
    }

    // Sorting
    const validSortColumns = ['rating', 'name', 'created_at'];
    const sortColumn = validSortColumns.includes(sortBy as string) ? sortBy : 'rating';
    query += ` ORDER BY ${sortColumn} DESC`;

    // Pagination
    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit as string), parseInt(offset as string));

    const result = await pool.query(query, params);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch agents',
    });
  }
});

// Get agent by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM agents WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch agent',
    });
  }
});

// Search agents
router.get('/search/:query', async (req: Request, res: Response) => {
  try {
    const { query } = req.params;

    const result = await pool.query(
      `SELECT * FROM agents 
       WHERE name ILIKE $1 
          OR type ILIKE $1 
          OR address ILIKE $1 
          OR services::text ILIKE $1
       ORDER BY rating DESC
       LIMIT 50`,
      [`%${query}%`]
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error searching agents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search agents',
    });
  }
});

// Get nearby agents (simple distance calculation)
router.get('/nearby/:lat/:lng', async (req: Request, res: Response) => {
  try {
    const { lat, lng } = req.params;
    const { radius = 10 } = req.query; // radius in km

    const result = await pool.query(
      `SELECT *, 
        (6371 * acos(
          cos(radians($1)) * cos(radians(latitude)) * 
          cos(radians(longitude) - radians($2)) + 
          sin(radians($1)) * sin(radians(latitude))
        )) AS distance
       FROM agents
       WHERE status = 'open'
       HAVING distance <= $3
       ORDER BY distance ASC
       LIMIT 50`,
      [parseFloat(lat), parseFloat(lng), parseFloat(radius as string)]
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching nearby agents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch nearby agents',
    });
  }
});

// Update agent status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['open', 'closed', 'busy'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be: open, closed, or busy',
      });
    }

    const result = await pool.query(
      'UPDATE agents SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating agent status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update agent status',
    });
  }
});

export default router;
