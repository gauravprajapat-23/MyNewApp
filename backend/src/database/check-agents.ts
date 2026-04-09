import { pool } from '../server';

async function checkAgents() {
  console.log('🔍 Checking agents in database...\n');

  const result = await pool.query('SELECT id, name, latitude, longitude, status FROM agents ORDER BY id');
  
  console.log(`Total agents in database: ${result.rows.length}\n`);
  
  result.rows.forEach((row, index) => {
    console.log(`${index + 1}. ${row.name}`);
    console.log(`   ID: ${row.id}, Lat: ${row.latitude}, Lng: ${row.longitude}, Status: ${row.status}\n`);
  });

  // Check Ujjain agents specifically
  const ujjainResult = await pool.query(
    `SELECT id, name, latitude, longitude, status 
     FROM agents 
     WHERE latitude BETWEEN 23.1 AND 23.2 
     AND longitude BETWEEN 75.7 AND 75.8
     ORDER BY id`
  );

  console.log(`\n📍 Ujjain agents (near 23.1766, 75.7906): ${ujjainResult.rows.length}\n`);
  
  ujjainResult.rows.forEach((row, index) => {
    console.log(`${index + 1}. ${row.name}`);
    console.log(`   ID: ${row.id}, Lat: ${row.latitude}, Lng: ${row.longitude}, Status: ${row.status}\n`);
  });

  await pool.end();
}

checkAgents().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
