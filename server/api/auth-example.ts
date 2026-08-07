/**
 * Example API Route with Neon Auth Integration
 * 
 * This demonstrates how to protect API routes using Neon Auth tokens.
 * You can use this pattern in your tRPC procedures or Express routes.
 */

import { Request, Response } from "express";
import { extractTokenFromHeader, verifyNeonToken } from "../../lib/neon-auth";

/**
 * Example: Protected route that requires Neon Auth token
 */
export async function protectedRouteExample(req: Request, res: Response) {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "No authentication token provided",
      });
    }

    // Verify the token with Neon Auth
    const user = await verifyNeonToken(token);

    // Token is valid, proceed with the request
    return res.status(200).json({
      message: "Access granted",
      user: {
        id: user.sub,
        email: user.email,
        name: user.name,
        issuedAt: new Date(user.iat * 1000),
        expiresAt: new Date(user.exp * 1000),
      },
    });
  } catch (error) {
    return res.status(401).json({
      error: "Unauthorized",
      message: error instanceof Error ? error.message : "Invalid token",
    });
  }
}

/**
 * Example: Get user info from Neon Auth token
 */
export async function getUserInfoExample(req: Request, res: Response) {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const user = await verifyNeonToken(token);

    // You can now use the user info to:
    // 1. Query your database for additional user data
    // 2. Check permissions
    // 3. Track user activity
    // 4. etc.

    return res.status(200).json({
      userId: user.sub,
      email: user.email,
      name: user.name,
      tokenInfo: {
        issuer: user.iss,
        issuedAt: new Date(user.iat * 1000).toISOString(),
        expiresAt: new Date(user.exp * 1000).toISOString(),
      },
    });
  } catch (error) {
    return res.status(401).json({
      error: "Invalid token",
      details: error instanceof Error ? error.message : "Token verification failed",
    });
  }
}

/**
 * Example: Middleware function for Express routes
 */
export async function neonAuthMiddleware(
  req: Request,
  res: Response,
  next: Function
) {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const user = await verifyNeonToken(token);
    
    // Attach user info to request object
    (req as any).user = user;
    
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
