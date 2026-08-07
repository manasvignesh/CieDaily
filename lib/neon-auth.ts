/**
 * Neon Auth Integration
 * 
 * This module provides JWT validation using Neon's authentication service.
 * It validates tokens issued by Neon Auth and verifies user identity.
 */

import { jwtVerify, createRemoteJWKSet } from "jose";

// Neon Auth configuration from environment variables
const NEON_AUTH_ISSUER = process.env.NEON_AUTH_ISSUER || "https://ep-flat-paper-axh5i25y.neonauth.c-4.us-east-2.aws.neon.tech/neondb/auth";
const NEON_JWKS_URL = process.env.NEON_JWKS_URL || "https://ep-flat-paper-axh5i25y.neonauth.c-4.us-east-2.aws.neon.tech/neondb/auth/.well-known/jwks.json";

// Create JWKS (JSON Web Key Set) for token verification
const JWKS = createRemoteJWKSet(new URL(NEON_JWKS_URL));

export interface NeonAuthUser {
  sub: string; // User ID from Neon Auth
  email?: string;
  name?: string;
  iss: string; // Issuer
  iat: number; // Issued at
  exp: number; // Expiration time
  [key: string]: any; // Additional claims
}

/**
 * Verify a JWT token from Neon Auth
 * 
 * @param token - The JWT token to verify
 * @returns The decoded token payload if valid
 * @throws Error if token is invalid or expired
 */
export async function verifyNeonToken(token: string): Promise<NeonAuthUser> {
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: NEON_AUTH_ISSUER,
      // Add audience validation if required by your Neon Auth setup
      // audience: 'your-audience',
    });

    return payload as NeonAuthUser;
  } catch (error) {
    console.error("Neon Auth token verification failed:", error);
    throw new Error("Invalid or expired token");
  }
}

/**
 * Extract token from Authorization header
 * 
 * @param authHeader - The Authorization header value
 * @returns The extracted token or null
 */
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader) return null;
  
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;
  
  return parts[1];
}

/**
 * Middleware to validate Neon Auth tokens in API requests
 * Use this in your tRPC procedures or API routes
 */
export async function validateNeonAuthToken(token: string | null): Promise<NeonAuthUser | null> {
  if (!token) return null;
  
  try {
    const user = await verifyNeonToken(token);
    return user;
  } catch (error) {
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(exp: number): boolean {
  return Date.now() >= exp * 1000;
}

/**
 * Get token expiration time in a readable format
 */
export function getTokenExpiration(exp: number): Date {
  return new Date(exp * 1000);
}
