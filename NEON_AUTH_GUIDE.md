# Neon Auth Integration Guide

## Overview

Your CIE Connect app now has Neon Auth integration configured. Neon Auth provides JWT-based authentication using your Neon database's authentication service.

## Configuration

The following environment variables have been added to your `.env` file:

```env
NEON_AUTH_ISSUER=https://ep-flat-paper-axh5i25y.neonauth.c-4.us-east-2.aws.neon.tech/neondb/auth
NEON_JWKS_URL=https://ep-flat-paper-axh5i25y.neonauth.c-4.us-east-2.aws.neon.tech/neondb/auth/.well-known/jwks.json
```

## How It Works

1. **User Authentication**: Users authenticate with Neon Auth and receive a JWT token
2. **Token Verification**: Your app verifies the token using the JWKS endpoint
3. **User Identification**: The verified token contains user information (sub, email, etc.)
4. **Database Access**: You can use the user ID to query/update your database

## Usage Examples

### 1. Verify a Token (Backend)

```typescript
import { verifyNeonToken } from "@/lib/neon-auth";

async function validateUser(token: string) {
  try {
    const user = await verifyNeonToken(token);
    console.log("User ID:", user.sub);
    console.log("Email:", user.email);
    return user;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
```

### 2. Protect API Routes

```typescript
import { neonAuthMiddleware } from "@/server/api/auth-example";
import express from "express";

const app = express();

// Apply middleware to protect routes
app.get("/api/protected", neonAuthMiddleware, (req, res) => {
  const user = (req as any).user;
  res.json({ message: `Hello ${user.email}` });
});
```

### 3. Frontend Token Storage

```typescript
// Store token after login
import AsyncStorage from "@react-native-async-storage/async-storage";

async function saveToken(token: string) {
  await AsyncStorage.setItem("neon_auth_token", token);
}

// Retrieve token for API calls
async function getToken() {
  return await AsyncStorage.getItem("neon_auth_token");
}

// Make authenticated API calls
async function fetchProtectedData() {
  const token = await getToken();
  const response = await fetch("https://your-api.com/protected", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}
```

### 4. tRPC Integration

If using tRPC, you can create a protected procedure:

```typescript
import { verifyNeonToken } from "@/lib/neon-auth";
import { TRPCError } from "@trpc/server";

export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const token = ctx.req?.headers.authorization?.split(" ")[1];
  
  if (!token) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  try {
    const user = await verifyNeonToken(token);
    return next({
      ctx: {
        ...ctx,
        user,
      },
    });
  } catch {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
});
```

## Token Structure

A verified Neon Auth token contains:

```typescript
{
  sub: "user-id",        // Unique user identifier
  email: "user@example.com",
  name: "User Name",
  iss: "neon-auth-issuer-url",
  iat: 1234567890,       // Issued at (Unix timestamp)
  exp: 1234567890,       // Expires at (Unix timestamp)
  // Additional custom claims...
}
```

## Next Steps

### 1. Update Your Login Flow

Replace the mock authentication with Neon Auth:

```typescript
// In lib/store.tsx
const login = async (email: string, password: string) => {
  // Call Neon Auth API to get token
  const response = await fetch("YOUR_NEON_AUTH_ENDPOINT/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  
  const { token } = await response.json();
  
  // Verify and store the token
  const user = await verifyNeonToken(token);
  await AsyncStorage.setItem("neon_auth_token", token);
  
  // Update your app state
  setState({ currentUser: user });
};
```

### 2. Add Token Refresh Logic

Implement token refresh to keep users logged in:

```typescript
async function refreshToken() {
  const currentToken = await AsyncStorage.getItem("neon_auth_token");
  
  // Call your refresh endpoint
  const response = await fetch("YOUR_NEON_AUTH_ENDPOINT/refresh", {
    headers: { Authorization: `Bearer ${currentToken}` },
  });
  
  const { token: newToken } = await response.json();
  await AsyncStorage.setItem("neon_auth_token", newToken);
}
```

### 3. Handle Token Expiration

Check token expiration and redirect to login:

```typescript
import { isTokenExpired } from "@/lib/neon-auth";

async function checkAuth() {
  const token = await getToken();
  if (!token) return false;
  
  try {
    const user = await verifyNeonToken(token);
    if (isTokenExpired(user.exp)) {
      // Token expired, try refresh or redirect to login
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
```

## Security Best Practices

1. **Always use HTTPS** in production
2. **Store tokens securely** using AsyncStorage or SecureStore
3. **Never expose tokens** in URLs or logs
4. **Implement token refresh** to avoid forced re-authentication
5. **Validate tokens on every protected request**
6. **Handle token expiration gracefully**

## Testing

Test your Neon Auth integration:

```bash
# Test token verification (replace with actual token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/protected
```

## Troubleshooting

### Token Verification Fails

- Check that JWKS URL is accessible
- Verify the token issuer matches your configuration
- Ensure the token hasn't expired

### Network Errors

- Verify your Neon database is accessible
- Check firewall rules
- Confirm SSL certificates are valid

## Additional Resources

- [Neon Auth Documentation](https://neon.tech/docs/guides/auth)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
- [JOSE Library Docs](https://github.com/panva/jose)

## Support

If you encounter issues:
1. Check the Neon dashboard for auth logs
2. Review your database connection settings
3. Verify JWKS endpoint is responding
4. Contact Neon support for authentication issues
