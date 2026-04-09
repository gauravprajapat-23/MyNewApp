import { pool } from '../server';

async function addUjjainAgents() {
  console.log('🌱 Adding Ujjain agents to database...');

  const ujjainAgents = [
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
  ];

  let added = 0;
  for (const agent of ujjainAgents) {
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
    added++;
    console.log(`✅ Added: ${agent.name}`);
  }

  console.log(`\n🎉 Successfully added ${added} Ujjain agents!`);
  process.exit(0);
}

addUjjainAgents().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
