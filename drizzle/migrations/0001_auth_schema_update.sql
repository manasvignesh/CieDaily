-- Custom migration to update users table for authentication
-- This migration safely handles existing data

-- Step 1: Drop the old role enum constraint
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;

-- Step 2: Drop and recreate the role enum with new values
DROP TYPE IF EXISTS "public"."role";
CREATE TYPE "public"."role" AS ENUM('student', 'space_admin', 'system_admin');

-- Step 3: Add new columns (nullable first)
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "username" varchar(100);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "passwordHash" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "bio" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "avatar" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "department" varchar(100);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "year" integer;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "collegeDomain" varchar(255);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "skills" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "techStack" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "interests" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "learningStreak" integer DEFAULT 0;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "isEmailVerified" boolean DEFAULT false NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "isAccountSuspended" boolean DEFAULT false NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "isOnline" boolean DEFAULT false NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "githubUrl" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "linkedinUrl" text;

-- Step 4: Update existing data with defaults
UPDATE "users" 
SET 
  "username" = COALESCE("username", SPLIT_PART("email", '@', 1)),
  "passwordHash" = COALESCE("passwordHash", '$2a$10$defaulthashforexistingusers'),
  "department" = COALESCE("department", 'Computer Science'),
  "year" = COALESCE("year", 1),
  "collegeDomain" = COALESCE("collegeDomain", SPLIT_PART("email", '@', 2)),
  "skills" = COALESCE("skills", '[]'),
  "techStack" = COALESCE("techStack", '[]'),
  "interests" = COALESCE("interests", '[]'),
  "learningStreak" = COALESCE("learningStreak", 0)
WHERE "username" IS NULL OR "passwordHash" IS NULL;

-- Step 5: Make email and name NOT NULL if not already
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;
ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;

-- Step 6: Make critical columns NOT NULL now that they have data
ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;
ALTER TABLE "users" ALTER COLUMN "passwordHash" SET NOT NULL;

-- Step 7: Add unique constraints
ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");

-- Step 8: Update role column to use new enum
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."role" 
  USING CASE 
    WHEN "role"::text = 'admin' THEN 'system_admin'::"public"."role"
    WHEN "role"::text = 'user' THEN 'student'::"public"."role"
    ELSE 'student'::"public"."role"
  END;

ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'student'::"public"."role";
ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;

-- Step 9: Update loginMethod default
ALTER TABLE "users" ALTER COLUMN "loginMethod" SET DEFAULT 'email';

-- Step 10: Make openId nullable (for email-based auth)
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_openId_unique";
ALTER TABLE "users" ALTER COLUMN "openId" DROP NOT NULL;
