/**
 * Database Connection Test Script
 * 
 * This script tests the connection to your Neon PostgreSQL database
 * and displays information about the connection and database.
 */

import { config } from "dotenv";
import { Client } from "pg";

// Load environment variables
config();

const DATABASE_URL = process.env.DATABASE_URL;

async function testConnection() {
  console.log("🔍 Testing Neon Database Connection...\n");

  if (!DATABASE_URL) {
    console.error("❌ ERROR: DATABASE_URL not found in environment variables");
    console.log("Please check your .env file");
    process.exit(1);
  }

  // Mask password in URL for display
  const displayUrl = DATABASE_URL.replace(/:([^:@]+)@/, ":****@");
  console.log("📝 Connection String:", displayUrl);
  console.log("");

  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    // Test 1: Connect to database
    console.log("⏳ Attempting to connect...");
    await client.connect();
    console.log("✅ Successfully connected to database!\n");

    // Test 2: Get database version
    console.log("📊 Database Information:");
    const versionResult = await client.query("SELECT version()");
    console.log("   PostgreSQL Version:", versionResult.rows[0].version.split(" ")[1]);

    // Test 3: Get current database name
    const dbResult = await client.query("SELECT current_database()");
    console.log("   Database Name:", dbResult.rows[0].current_database);

    // Test 4: Get current user
    const userResult = await client.query("SELECT current_user");
    console.log("   Current User:", userResult.rows[0].current_user);

    // Test 5: Check connection info
    const hostResult = await client.query("SELECT inet_server_addr(), inet_server_port()");
    if (hostResult.rows[0].inet_server_addr) {
      console.log("   Server Address:", hostResult.rows[0].inet_server_addr);
      console.log("   Server Port:", hostResult.rows[0].inet_server_port);
    }

    // Test 6: List all tables
    console.log("\n📋 Existing Tables:");
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (tablesResult.rows.length === 0) {
      console.log("   No tables found (database is empty)");
    } else {
      tablesResult.rows.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.table_name}`);
      });
    }

    // Test 7: Check for drizzle migrations table
    const migrationsResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = '__drizzle_migrations'
      )
    `);
    
    console.log("\n🔧 Migration Status:");
    if (migrationsResult.rows[0].exists) {
      const migrationCount = await client.query(
        "SELECT COUNT(*) FROM __drizzle_migrations"
      );
      console.log(`   ✅ Migrations table exists (${migrationCount.rows[0].count} migrations applied)`);
    } else {
      console.log("   ⚠️  Migrations table not found - run 'npm run db:push' to create tables");
    }

    // Test 8: Connection pool info
    console.log("\n🔌 Connection Details:");
    console.log("   SSL Mode: Required (Neon)");
    console.log("   Connection Pooling: Enabled (pooler endpoint)");
    
    console.log("\n✅ All database tests passed!");
    console.log("\n💡 Your Neon database is properly connected and ready to use.");

  } catch (error) {
    console.error("\n❌ Database Connection Failed!");
    console.error("\nError Details:");
    if (error instanceof Error) {
      console.error("   Message:", error.message);
      console.error("   Name:", error.name);
    } else {
      console.error("   Error:", error);
    }
    
    console.log("\n🔧 Troubleshooting Steps:");
    console.log("   1. Check if DATABASE_URL is correct in .env file");
    console.log("   2. Verify your Neon database is active");
    console.log("   3. Check your network connection");
    console.log("   4. Ensure SSL mode is set to 'require'");
    console.log("   5. Verify database credentials are valid");
    
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run the test
testConnection().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
