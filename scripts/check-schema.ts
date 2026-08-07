/**
 * Check Database Schema
 */

import { config } from "dotenv";
import { Client } from "pg";

config();

async function checkSchema() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  
  try {
    await client.connect();
    
    // Check users table structure
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    
    console.log("📋 Users table schema:");
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${row.column_default || ''}`);
    });
    
    // Check for role enum
    const enumResult = await client.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'role'
      )
    `);
    console.log(`\n🔧 Role enum exists: ${enumResult.rows[0].exists ? 'Yes' : 'No'}`);
    
    // Count users
    const countResult = await client.query('SELECT COUNT(*) FROM users');
    console.log(`\n👥 Total users: ${countResult.rows[0].count}`);
    
  } finally {
    await client.end();
  }
}

checkSchema();
