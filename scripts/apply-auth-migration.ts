/**
 * Apply Auth Schema Migration
 */

import { config } from "dotenv";
import { Client } from "pg";
import fs from "fs";
import path from "path";

config();

async function applyMigration() {
  console.log("🔄 Applying authentication schema migration...\n");

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log("✅ Connected to database");

    // Read the migration file
    const migrationPath = path.join(
      process.cwd(),
      "drizzle",
      "migrations",
      "0001_auth_schema_update.sql"
    );
    const sql = fs.readFileSync(migrationPath, "utf-8");

    console.log("⏳ Executing migration...");
    
    // Split by statement separator and execute one by one
    const statements = sql
      .split("-- Step")
      .filter((s) => s.trim().length > 0)
      .map((s) => "-- Step" + s);

    for (let i = 0; i < statements.length; i++) {
      const stepMatch = statements[i].match(/-- Step (\d+):/);
      if (stepMatch) {
        console.log(`   Step ${stepMatch[1]}...`);
      }
      
      try {
        await client.query(statements[i]);
      } catch (error) {
        if (error instanceof Error && error.message.includes("already exists")) {
          console.log(`   ⚠️  Already exists, skipping...`);
        } else {
          throw error;
        }
      }
    }

    console.log("\n✅ Migration completed successfully!");

    // Verify the schema
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);

    console.log("\n📋 Updated Users Table Schema:");
    result.rows.forEach((row) => {
      console.log(
        `   - ${row.column_name}: ${row.data_type} ${row.is_nullable === "NO" ? "NOT NULL" : "NULL"}`
      );
    });

    // Count users
    const countResult = await client.query("SELECT COUNT(*) FROM users");
    console.log(`\n👥 Total users: ${countResult.rows[0].count}`);
  } catch (error) {
    console.error("\n❌ Migration failed:");
    console.error(error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

applyMigration();
