import { pool } from '../server';

export async function initializeDatabase() {
  console.log('🗄️  Initializing database schema...');

  try {
    // Create agents table (deposit points)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS agents (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        description TEXT,
        phone VARCHAR(20) NOT NULL,
        address TEXT NOT NULL,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        rating DECIMAL(3, 2) DEFAULT 0.00,
        reviews_count INTEGER DEFAULT 0,
        commission_rate VARCHAR(10) NOT NULL,
        operating_hours VARCHAR(100) NOT NULL,
        status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'busy')),
        services TEXT[] NOT NULL,
        is_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Agents table created');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(20) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        is_agent BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');

    // Create favorites table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, agent_id)
      )
    `);
    console.log('✅ Favorites table created');

    // Create transactions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        amount DECIMAL(12, 2) NOT NULL,
        commission DECIMAL(10, 2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Transactions table created');

    // Create reviews table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, agent_id)
      )
    `);
    console.log('✅ Reviews table created');

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);
      CREATE INDEX IF NOT EXISTS idx_agents_services ON agents USING GIN(services);
      CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
      CREATE INDEX IF NOT EXISTS idx_favorites_agent_id ON favorites(agent_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_agent_id ON transactions(agent_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_agent_id ON reviews(agent_id);
    `);
    console.log('✅ Indexes created');

    console.log('🎉 Database initialization complete!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

export async function seedAgents() {
  console.log('🌱 Seeding agents data...');

  const agents = [
    {
      name: 'Sharma Kirana Store',
      type: 'Grocery Store',
      description: 'Trusted neighborhood store with 10+ years of service',
      phone: '+91 98765 43210',
      address: '123 Main Street, Market Area, City - 123456',
      latitude: 28.6139,
      longitude: 77.2090,
      rating: 4.8,
      commission_rate: '1.5%',
      operating_hours: '09:00 - 21:00',
      status: 'open',
      services: ['Cash In', 'Cash Out', 'AEPS'],
      is_verified: true,
    },
    {
      name: 'Patel General Store',
      type: 'General Store',
      description: 'One-stop shop for all your banking needs',
      phone: '+91 98765 43211',
      address: '45 Park Road, Near Bus Stand, City - 123456',
      latitude: 28.6150,
      longitude: 77.2100,
      rating: 4.5,
      commission_rate: '1.2%',
      operating_hours: '08:00 - 22:00',
      status: 'open',
      services: ['Cash In', 'UPI', 'Bill Payments'],
      is_verified: true,
    },
    {
      name: 'Khan Mobile Shop',
      type: 'Mobile Store',
      description: 'High-rated service center with fast processing',
      phone: '+91 98765 43212',
      address: '78 Tech Plaza, 2nd Floor, City - 123456',
      latitude: 28.6120,
      longitude: 77.2080,
      rating: 4.9,
      commission_rate: '2.0%',
      operating_hours: '10:00 - 20:00',
      status: 'busy',
      services: ['Cash Out', 'AEPS', 'DMT'],
      is_verified: true,
    },
  ];

  for (const agent of agents) {
    const { services, ...agentData } = agent;
    await pool.query(
      `INSERT INTO agents (name, type, description, phone, address, latitude, longitude, rating, commission_rate, operating_hours, status, services, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       ON CONFLICT DO NOTHING`,
      [
        agentData.name,
        agentData.type,
        agentData.description,
        agentData.phone,
        agentData.address,
        agentData.latitude,
        agentData.longitude,
        agentData.rating,
        agentData.commission_rate,
        agentData.operating_hours,
        agentData.status,
        services,
        agentData.is_verified,
      ]
    );
  }

  console.log('✅ Agents seeded successfully!');
}
