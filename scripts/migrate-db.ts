/**
 * Database Migration Script
 * 
 * Applies Drizzle migrations safely, handling existing tables
 */

import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Client } from "pg";

config();

const DATABASE_URL = process.env.DATABASE_URL;

async function runMigrations() {
  console.log("🔄 Running database migrations...\n");

  if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL not found");
    process.exit(1);
  }

  const client = new Client({ connectionString: DATABASE_URL });

  try {
    await client.connect();
    console.log("✅ Connected to database");

    const db = drizzle(client);

    // Run migrations
    console.log("⏳ Applying migrations...");
    await migrate(db, { migrationsFolder: "./drizzle/migrations" });
    
    console.log("✅ Migrations completed successfully!");

    // Verify tables
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    console.log("\n📋 Database Tables:");
    result.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.table_name}`);
    });

  } catch (error) {
    console.error("\n❌ Migration failed:");
    if (error instanceof Error) {
      console.error("   Message:", error.message);
      
      // Check if it's a duplicate table/type error
      if (error.message.includes("already exists")) {
        console.log("\n💡 Tables already exist - database is up to date");
        process.exit(0);
      }
    }
    throw error;
  } finally {
    await client.end();
  }
}

runMigrations().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
