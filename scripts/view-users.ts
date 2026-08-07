/**
 * View Users in Database
 */

import { config } from "dotenv";
import { Client } from "pg";

config();

async function viewUsers() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  
  try {
    await client.connect();
    
    const result = await client.query('SELECT * FROM users ORDER BY id');
    
    console.log(`\n👥 Users in database (${result.rows.length}):\n`);
    
    result.rows.forEach((user, index) => {
      console.log(`${index + 1}. User ID: ${user.id}`);
      console.log(`   OpenID: ${user.openId}`);
      console.log(`   Name: ${user.name || 'N/A'}`);
      console.log(`   Email: ${user.email || 'N/A'}`);
      console.log(`   Login Method: ${user.loginMethod || 'N/A'}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log(`   Last Sign In: ${user.lastSignedIn}`);
      console.log('');
    });
    
  } finally {
    await client.end();
  }
}

viewUsers();
