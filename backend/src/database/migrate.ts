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

  // Check if agents already exist
  const countResult = await pool.query('SELECT COUNT(*) FROM agents');
  const count = parseInt(countResult.rows[0].count);
  
  if (count > 0) {
    console.log(`✅ Agents already exist (${count} records). Skipping seed.`);
    return;
  }

  const agents = [
    // Ujjain, Madhya Pradesh agents (near lat: 23.1766172, lng: 75.7905953)
    {
      name: 'Gupta Kirana Store',
      type: 'Grocery Store',
      description: 'Trusted neighborhood store in Madhav Nagar',
      phone: '+91 98765 10001',
      address: 'Freeganj, Madhav Nagar, Ujjain - 456010',
      latitude: 23.1766,
      longitude: 75.7906,
      rating: 4.7,
      reviews_count: 89,
      commission_rate: '1.5%',
      operating_hours: '09:00 - 21:00',
      status: 'open',
      services: ['Cash In', 'Cash Out', 'AEPS'],
      is_verified: true,
    },
    {
      name: 'Sharma Mobile & Electronics',
      type: 'Mobile Store',
      description: 'Mobile repair shop with banking services',
      phone: '+91 98765 10002',
      address: 'Amar Singh Marg, Ujjain - 456010',
      latitude: 23.1780,
      longitude: 75.7920,
      rating: 4.5,
      reviews_count: 67,
      commission_rate: '1.8%',
      operating_hours: '10:00 - 20:00',
      status: 'open',
      services: ['Cash Out', 'AEPS', 'DMT'],
      is_verified: true,
    },
    {
      name: 'Patel Medical Store',
      type: 'Pharmacy',
      description: '24/7 pharmacy with complete banking services',
      phone: '+91 98765 10003',
      address: 'Station Road, Ujjain - 456001',
      latitude: 23.1750,
      longitude: 75.7890,
      rating: 4.9,
      reviews_count: 145,
      commission_rate: '1.2%',
      operating_hours: '24 Hours',
      status: 'open',
      services: ['Cash In', 'Cash Out', 'AEPS', 'UPI'],
      is_verified: true,
    },
    {
      name: 'Verma General Store',
      type: 'General Store',
      description: 'One-stop shop for all your needs',
      phone: '+91 98765 10004',
      address: 'Nana Kheda, Ujjain - 456001',
      latitude: 23.1800,
      longitude: 75.7850,
      rating: 4.3,
      reviews_count: 52,
      commission_rate: '1.0%',
      operating_hours: '08:00 - 22:00',
      status: 'open',
      services: ['Cash In', 'UPI', 'Bill Payments'],
      is_verified: true,
    },
    {
      name: 'Singh Tea & Snacks',
      type: 'Tea Stall',
      description: 'Popular tea stall with cash deposit facility',
      phone: '+91 98765 10005',
      address: 'Dewas Gate, Ujjain - 456001',
      latitude: 23.1730,
      longitude: 75.7950,
      rating: 4.6,
      reviews_count: 78,
      commission_rate: '1.0%',
      operating_hours: '06:00 - 20:00',
      status: 'open',
      services: ['Cash In', 'UPI'],
      is_verified: false,
    },
    {
      name: 'Jain Super Market',
      type: 'Supermarket',
      description: 'Large supermarket with dedicated banking counter',
      phone: '+91 98765 10006',
      address: 'Sanwer Road, Ujjain - 456001',
      latitude: 23.1820,
      longitude: 75.7880,
      rating: 4.4,
      reviews_count: 93,
      commission_rate: '1.3%',
      operating_hours: '07:00 - 21:00',
      status: 'busy',
      services: ['Cash In', 'Cash Out', 'UPI'],
      is_verified: true,
    },
    {
      name: 'Malviya Book Depot',
      type: 'Bookshop',
      description: 'Bookstore with student-friendly banking',
      phone: '+91 98765 10007',
      address: 'Mahakal Marg, Ujjain - 456001',
      latitude: 23.1745,
      longitude: 75.7870,
      rating: 4.8,
      reviews_count: 112,
      commission_rate: '1.5%',
      operating_hours: '09:00 - 21:00',
      status: 'open',
      services: ['Cash In', 'Cash Out', 'UPI'],
      is_verified: true,
    },
    // Delhi agents (original data)
    {
      name: 'Sharma Kirana Store',
      type: 'Grocery Store',
      description: 'Trusted neighborhood store with 10+ years of service',
      phone: '+91 98765 43210',
      address: '123 Main Street, Market Area, Delhi - 110001',
      latitude: 28.6139,
      longitude: 77.2090,
      rating: 4.8,
      reviews_count: 124,
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
      address: '45 Park Road, Near Bus Stand, Delhi - 110002',
      latitude: 28.6150,
      longitude: 77.2100,
      rating: 4.5,
      reviews_count: 89,
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
      address: '78 Tech Plaza, 2nd Floor, Delhi - 110003',
      latitude: 28.6120,
      longitude: 77.2080,
      rating: 4.9,
      reviews_count: 201,
      commission_rate: '2.0%',
      operating_hours: '10:00 - 20:00',
      status: 'busy',
      services: ['Cash Out', 'AEPS', 'DMT'],
      is_verified: true,
    },
    {
      name: 'Reddy Super Market',
      type: 'Supermarket',
      description: 'Large supermarket with dedicated banking counter',
      phone: '+91 98765 43213',
      address: '90 Highway Road, Shopping Complex, Delhi - 110004',
      latitude: 28.6160,
      longitude: 77.2110,
      rating: 4.3,
      reviews_count: 67,
      commission_rate: '1.0%',
      operating_hours: '07:00 - 21:00',
      status: 'closed',
      services: ['Cash In', 'Cash Out'],
      is_verified: true,
    },
    {
      name: 'Gupta Medical Store',
      type: 'Pharmacy',
      description: 'Extended hours pharmacy with banking services',
      phone: '+91 98765 43214',
      address: '12 Health Street, Near Hospital, Delhi - 110005',
      latitude: 28.6110,
      longitude: 77.2070,
      rating: 4.7,
      reviews_count: 156,
      commission_rate: '1.8%',
      operating_hours: '08:00 - 23:00',
      status: 'open',
      services: ['Cash In', 'AEPS', 'UPI'],
      is_verified: true,
    },
    {
      name: 'Singh Electronics',
      type: 'Electronics Store',
      description: 'Modern electronics store with digital payment hub',
      phone: '+91 98765 43215',
      address: '34 Gadget Lane, Electronics Market, Delhi - 110006',
      latitude: 28.6170,
      longitude: 77.2120,
      rating: 4.6,
      reviews_count: 93,
      commission_rate: '1.5%',
      operating_hours: '10:00 - 21:00',
      status: 'open',
      services: ['Cash Out', 'UPI', 'Bill Payments'],
      is_verified: true,
    },
    {
      name: 'Verma Textiles',
      type: 'Clothing Store',
      description: 'Traditional clothing store with cash services',
      phone: '+91 98765 43216',
      address: '56 Fashion Street, Textile Market, Delhi - 110007',
      latitude: 28.6100,
      longitude: 77.2060,
      rating: 4.2,
      reviews_count: 45,
      commission_rate: '1.0%',
      operating_hours: '10:00 - 20:00',
      status: 'open',
      services: ['Cash In', 'Cash Out'],
      is_verified: false,
    },
    {
      name: 'Iyer Coffee House',
      type: 'Cafe',
      description: 'Popular cafe with convenient banking corner',
      phone: '+91 98765 43217',
      address: '78 Brew Avenue, Coffee Colony, Delhi - 110008',
      latitude: 28.6180,
      longitude: 77.2130,
      rating: 4.9,
      reviews_count: 278,
      commission_rate: '1.3%',
      operating_hours: '07:00 - 22:00',
      status: 'open',
      services: ['Cash In', 'UPI', 'AEPS'],
      is_verified: true,
    },
    {
      name: 'Das Hardware Store',
      type: 'Hardware Store',
      description: 'Hardware store with money transfer services',
      phone: '+91 98765 43218',
      address: '90 Builder Road, Industrial Area, Delhi - 110009',
      latitude: 28.6090,
      longitude: 77.2050,
      rating: 4.1,
      reviews_count: 38,
      commission_rate: '2.0%',
      operating_hours: '09:00 - 19:00',
      status: 'busy',
      services: ['Cash Out', 'DMT'],
      is_verified: false,
    },
    {
      name: 'Nair Book Store',
      type: 'Bookshop',
      description: 'Bookstore with student-friendly banking services',
      phone: '+91 98765 43219',
      address: '12 Library Lane, Education Hub, Delhi - 110010',
      latitude: 28.6190,
      longitude: 77.2140,
      rating: 4.8,
      reviews_count: 167,
      commission_rate: '1.5%',
      operating_hours: '09:00 - 21:00',
      status: 'open',
      services: ['Cash In', 'Cash Out', 'UPI'],
      is_verified: true,
    },
    {
      name: 'Mehta Jewelry Mart',
      type: 'Jewelry Store',
      description: 'Premium jewelry store with secure cash services',
      phone: '+91 98765 43220',
      address: '34 Gold Street, Jewelry Market, Delhi - 110011',
      latitude: 28.6080,
      longitude: 77.2040,
      rating: 4.4,
      reviews_count: 72,
      commission_rate: '1.8%',
      operating_hours: '10:00 - 20:00',
      status: 'open',
      services: ['Cash In', 'AEPS'],
      is_verified: true,
    },
    {
      name: 'Chopra Bakery',
      type: 'Bakery',
      description: 'Early morning bakery with full banking services',
      phone: '+91 98765 43221',
      address: '56 Sweet Street, Food Court, Delhi - 110012',
      latitude: 28.6200,
      longitude: 77.2150,
      rating: 4.7,
      reviews_count: 215,
      commission_rate: '1.2%',
      operating_hours: '06:00 - 22:00',
      status: 'open',
      services: ['Cash In', 'Cash Out', 'UPI', 'Bill Payments'],
      is_verified: true,
    },
    {
      name: 'Bose Tea Stall',
      type: 'Tea Stall',
      description: 'Local tea stall with basic cash deposit facility',
      phone: '+91 98765 43222',
      address: '78 Chai Point, Market Square, Delhi - 110013',
      latitude: 28.6070,
      longitude: 77.2030,
      rating: 4.3,
      reviews_count: 91,
      commission_rate: '1.0%',
      operating_hours: '06:00 - 20:00',
      status: 'open',
      services: ['Cash In', 'UPI'],
      is_verified: false,
    },
    {
      name: 'Malhotra Sports Hub',
      type: 'Sports Store',
      description: 'Sports equipment store with withdrawal services',
      phone: '+91 98765 43223',
      address: '90 Stadium Road, Sports Complex, Delhi - 110014',
      latitude: 28.6210,
      longitude: 77.2160,
      rating: 4.6,
      reviews_count: 128,
      commission_rate: '1.7%',
      operating_hours: '10:00 - 21:00',
      status: 'closed',
      services: ['Cash Out', 'AEPS', 'UPI'],
      is_verified: true,
    },
    {
      name: 'Pillai Pharmacy Plus',
      type: 'Pharmacy',
      description: '24/7 pharmacy with complete banking services',
      phone: '+91 98765 43224',
      address: '12 Emergency Lane, Near Hospital, Delhi - 110015',
      latitude: 28.6060,
      longitude: 77.2020,
      rating: 4.9,
      reviews_count: 302,
      commission_rate: '1.5%',
      operating_hours: '24 Hours',
      status: 'open',
      services: ['Cash In', 'Cash Out', 'AEPS', 'UPI'],
      is_verified: true,
    },
  ];

  for (const agent of agents) {
    const { services, ...agentData } = agent;
    await pool.query(
      `INSERT INTO agents (name, type, description, phone, address, latitude, longitude, rating, reviews_count, commission_rate, operating_hours, status, services, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        agentData.name,
        agentData.type,
        agentData.description,
        agentData.phone,
        agentData.address,
        agentData.latitude,
        agentData.longitude,
        agentData.rating,
        agentData.reviews_count || 0,
        agentData.commission_rate,
        agentData.operating_hours,
        agentData.status,
        services,
        agentData.is_verified,
      ]
    );
  }

  console.log(`✅ Successfully seeded ${agents.length} agents!`);
}
