import { pgTable, serial, varchar, text, timestamp, pgEnum, boolean } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["student", "space_admin", "system_admin"]);

/**
 * Core user table backing auth flow.
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  // Basic Info
  name: text("name").notNull(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: text("passwordHash").notNull(),
  
  // Profile Info
  bio: text("bio"),
  avatar: text("avatar"),
  department: varchar("department", { length: 100 }),
  year: serial("year"),
  collegeDomain: varchar("collegeDomain", { length: 255 }),
  
  // Skills & Interests
  skills: text("skills"), // JSON array stored as text
  techStack: text("techStack"), // JSON array stored as text
  interests: text("interests"), // JSON array stored as text
  
  // Gamification
  learningStreak: serial("learningStreak").default(0),
  
  // Auth & Status
  role: roleEnum("role").default("student").notNull(),
  isEmailVerified: boolean("isEmailVerified").default(false).notNull(),
  isAccountSuspended: boolean("isAccountSuspended").default(false).notNull(),
  isOnline: boolean("isOnline").default(false).notNull(),
  
  // OAuth (optional)
  openId: varchar("openId", { length: 64 }),
  loginMethod: varchar("loginMethod", { length: 64 }).default("email"),
  
  // Social Links
  githubUrl: text("githubUrl"),
  linkedinUrl: text("linkedinUrl"),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
