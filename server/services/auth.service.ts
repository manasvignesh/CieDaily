/**
 * Authentication Service
 * 
 * Handles user registration, login, token generation, and validation
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { Client } from "pg";
import { users } from "../../drizzle/schema";
import type { User } from "../../drizzle/schema";

const JWT_SECRET = process.env.JWT_SECRET || "cie_connect_jwt_secret_key_99";
const JWT_EXPIRES_IN = "7d"; // Token expires in 7 days

// Initialize database connection
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect().catch(err => {
  console.error("Failed to connect to database:", err);
});

const db = drizzle(client);

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  username?: string;
  department?: string;
  year?: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthToken {
  token: string;
  user: Omit<User, "passwordHash">;
}

/**
 * Hash a password using bcrypt
 */
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compare a plain text password with a hashed password
 */
async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT token for a user
 */
function generateToken(user: User): string {
  const payload = {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

/**
 * Remove sensitive data from user object
 */
function sanitizeUser(user: User): Omit<User, "passwordHash"> {
  const { passwordHash, ...sanitized } = user;
  return sanitized;
}

/**
 * Register a new user
 */
export async function register(data: RegisterData): Promise<AuthToken> {
  const { name, email, password, username, department, year } = data;

  // Check if user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new Error("User with this email already exists");
  }

  // Generate username if not provided
  const finalUsername = username || email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "_");

  // Check if username is taken
  const existingUsername = await db
    .select()
    .from(users)
    .where(eq(users.username, finalUsername))
    .limit(1);

  if (existingUsername.length > 0) {
    throw new Error("Username already taken");
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Determine role based on email domain
  const domain = email.split("@")[1];
  const role = domain === "mlrit.ac.in" ? "system_admin" : "student";

  // Create user
  const newUser = await db
    .insert(users)
    .values({
      name,
      email,
      username: finalUsername,
      passwordHash,
      department: department || "Computer Science",
      year: year || 1,
      collegeDomain: domain,
      role,
      isEmailVerified: true, // Auto-verify for demo
      skills: JSON.stringify([]),
      techStack: JSON.stringify([]),
      interests: JSON.stringify([]),
      learningStreak: 0,
      isOnline: true,
      loginMethod: "email",
    })
    .returning();

  const user = newUser[0];
  const token = generateToken(user);

  return {
    token,
    user: sanitizeUser(user),
  };
}

/**
 * Login a user
 */
export async function login(data: LoginData): Promise<AuthToken> {
  const { email, password } = data;

  // Find user by email
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (result.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = result[0];

  // Check if account is suspended
  if (user.isAccountSuspended) {
    throw new Error("Account has been suspended. Please contact support.");
  }

  // Verify password
  const isValidPassword = await comparePassword(password, user.passwordHash);

  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }

  // Update last sign in
  await db
    .update(users)
    .set({
      lastSignedIn: new Date(),
      isOnline: true,
    })
    .where(eq(users.id, user.id));

  // Update user object
  user.lastSignedIn = new Date();
  user.isOnline = true;

  const token = generateToken(user);

  return {
    token,
    user: sanitizeUser(user),
  };
}

/**
 * Get user by ID
 */
export async function getUserById(userId: number): Promise<Omit<User, "passwordHash"> | null> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  return sanitizeUser(result[0]);
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<Omit<User, "passwordHash"> | null> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  return sanitizeUser(result[0]);
}

/**
 * Update user profile
 */
export async function updateProfile(
  userId: number,
  updates: Partial<Omit<User, "id" | "email" | "passwordHash" | "createdAt">>
): Promise<Omit<User, "passwordHash">> {
  const result = await db
    .update(users)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();

  return sanitizeUser(result[0]);
}

/**
 * Change password
 */
export async function changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string
): Promise<boolean> {
  // Get user with password
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (result.length === 0) {
    throw new Error("User not found");
  }

  const user = result[0];

  // Verify current password
  const isValid = await comparePassword(currentPassword, user.passwordHash);

  if (!isValid) {
    throw new Error("Current password is incorrect");
  }

  // Hash new password
  const newPasswordHash = await hashPassword(newPassword);

  // Update password
  await db
    .update(users)
    .set({
      passwordHash: newPasswordHash,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  return true;
}

/**
 * Logout user (update online status)
 */
export async function logout(userId: number): Promise<void> {
  await db
    .update(users)
    .set({
      isOnline: false,
    })
    .where(eq(users.id, userId));
}
