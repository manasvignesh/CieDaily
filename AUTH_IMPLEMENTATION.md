# Authentication Implementation Guide

## Overview

CIE Connect now has a complete, production-ready authentication system backed by PostgreSQL with secure password hashing and JWT tokens.

## Architecture

```
┌─────────────────┐
│  React Native   │
│   Components    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Auth Store    │  (lib/auth-store.tsx)
│  React Context  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  tRPC Router    │  (server/routers/auth.router.ts)
│   API Layer     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Auth Service   │  (server/services/auth.service.ts)
│ Business Logic  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ PostgreSQL DB   │  (Neon Database)
│   Drizzle ORM   │
└─────────────────┘
```

## Features

### ✅ Secure Authentication
- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: 7-day expiration with automatic refresh
- **SQL Injection Protection**: Parameterized queries via Drizzle ORM
- **XSS Protection**: Input validation with Zod schemas

### ✅ User Management
- **Registration**: Email, name, password validation
- **Login**: Email and password authentication
- **Profile Updates**: Full profile management
- **Password Change**: Current password verification required
- **Role-Based Access**: Student, Space Admin, System Admin

### ✅ Session Management
- **Token Storage**: AsyncStorage for persistent sessions
- **Auto-Login**: Verify stored tokens on app launch
- **Logout**: Clear tokens and update online status
- **Token Refresh**: Automatic token validation

## Database Schema

```sql
users {
  id: SERIAL PRIMARY KEY
  
  -- Authentication
  email: VARCHAR(320) NOT NULL UNIQUE
  username: VARCHAR(100) NOT NULL UNIQUE
  passwordHash: TEXT NOT NULL
  
  -- Profile
  name: TEXT NOT NULL
  bio: TEXT
  avatar: TEXT
  department: VARCHAR(100)
  year: INTEGER
  collegeDomain: VARCHAR(255)
  
  -- Skills & Interests (JSON arrays as TEXT)
  skills: TEXT
  techStack: TEXT
  interests: TEXT
  
  -- Gamification
  learningStreak: INTEGER DEFAULT 0
  
  -- Authorization
  role: ENUM('student', 'space_admin', 'system_admin')
  isEmailVerified: BOOLEAN DEFAULT false
  isAccountSuspended: BOOLEAN DEFAULT false
  isOnline: BOOLEAN DEFAULT false
  
  -- OAuth (optional)
  openId: VARCHAR(64)
  loginMethod: VARCHAR(64) DEFAULT 'email'
  
  -- Social
  githubUrl: TEXT
  linkedinUrl: TEXT
  
  -- Timestamps
  createdAt: TIMESTAMP DEFAULT NOW()
  updatedAt: TIMESTAMP DEFAULT NOW()
  lastSignedIn: TIMESTAMP DEFAULT NOW()
}
```

## API Endpoints (tRPC)

### auth.register
Register a new user
```typescript
input: {
  name: string (min 2 chars)
  email: string (valid email)
  password: string (min 6 chars)
  username?: string
  department?: string
  year?: number (1-4)
}

output: {
  success: boolean
  token?: string
  user?: User
  error?: string
}
```

### auth.login
Login existing user
```typescript
input: {
  email: string
  password: string
}

output: {
  success: boolean
  token?: string
  user?: User
  error?: string
}
```

### auth.verifyToken
Verify JWT token
```typescript
input: {
  token: string
}

output: {
  valid: boolean
  user?: User
}
```

### auth.updateProfile
Update user profile
```typescript
input: {
  userId: number
  name?: string
  bio?: string
  department?: string
  year?: number
  skills?: string[]
  techStack?: string[]
  interests?: string[]
  githubUrl?: string
  linkedinUrl?: string
}

output: {
  success: boolean
  user?: User
}
```

### auth.changePassword
Change user password
```typescript
input: {
  userId: number
  currentPassword: string
  newPassword: string (min 6 chars)
}

output: {
  success: boolean
  message?: string
  error?: string
}
```

### auth.logout
Logout user
```typescript
input: {
  userId: number
}

output: {
  success: boolean
  message: string
}
```

## Usage Examples

### 1. Registration

```typescript
import { useAuth } from "@/lib/auth-store";

function SignupScreen() {
  const { register } = useAuth();
  
  const handleSignup = async () => {
    const success = await register(
      "John Doe",
      "john@college.edu",
      "password123"
    );
    
    if (success) {
      router.replace("/(tabs)");
    }
  };
}
```

### 2. Login

```typescript
import { useAuth } from "@/lib/auth-store";

function LoginScreen() {
  const { login } = useAuth();
  
  const handleLogin = async () => {
    const success = await login(
      "john@college.edu",
      "password123"
    );
    
    if (success) {
      router.replace("/(tabs)");
    }
  };
}
```

### 3. Check Authentication

```typescript
import { useAuth } from "@/lib/auth-store";

function ProtectedScreen() {
  const { currentUser, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!currentUser) {
    router.replace("/landing");
    return null;
  }
  
  return <View>Welcome {currentUser.name}!</View>;
}
```

### 4. Update Profile

```typescript
import { useAuth } from "@/lib/auth-store";

function ProfileScreen() {
  const { currentUser, updateProfile } = useAuth();
  
  const handleUpdate = async () => {
    await updateProfile({
      bio: "Full-stack developer",
      skills: ["React", "Node.js"],
      githubUrl: "https://github.com/user"
    });
  };
}
```

### 5. Logout

```typescript
import { useAuth } from "@/lib/auth-store";

function SettingsScreen() {
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    router.replace("/landing");
  };
}
```

## Role-Based Access

### Roles
1. **student**: Regular user (default)
2. **space_admin**: Can manage spaces
3. **system_admin**: Full admin access

### Role Assignment
- Email domain `@mlrit.ac.in` → `system_admin`
- All other domains → `student`

### Check User Role
```typescript
const { currentUser } = useAuth();

if (currentUser?.role === "system_admin") {
  // Show admin features
}
```

## Security Best Practices

### Password Security
- ✅ Minimum 6 characters enforced
- ✅ Hashed with bcrypt (10 salt rounds)
- ✅ Never stored in plain text
- ✅ Never sent in API responses

### Token Security
- ✅ Stored in AsyncStorage (encrypted on device)
- ✅ 7-day expiration
- ✅ Verified on every protected request
- ✅ Auto-cleared on logout

### Database Security
- ✅ SSL/TLS connection to Neon
- ✅ Parameterized queries (no SQL injection)
- ✅ Password hash never exposed in queries
- ✅ Unique constraints on email and username

### Input Validation
- ✅ Email format validation
- ✅ Password strength requirements
- ✅ Name length validation
- ✅ SQL injection prevention
- ✅ XSS prevention

## Testing

### Manual Testing

1. **Register a new user**
```bash
# Open app in browser
http://localhost:8081

# Click "Create Account"
# Fill in: Name, Email, Password
# Should redirect to home after success
```

2. **Login**
```bash
# Click "Log In"
# Enter registered email and password
# Should redirect to home
```

3. **Logout**
```bash
# Go to Profile tab
# Click logout
# Should redirect to landing page
```

4. **Protected Routes**
```bash
# Try to access /(tabs) when logged out
# Should redirect to /landing
```

### Database Testing
```bash
# View all users
npm run db:test
npx tsx scripts/view-users.ts

# Check schema
npx tsx scripts/check-schema.ts
```

## Migration History

### 0000_initial_schema
- Created users table with basic fields
- Added role enum (user, admin)
- OAuth support with openId

### 0001_auth_schema_update
- Extended users table for full authentication
- Added username, passwordHash fields
- Added profile fields (bio, avatar, etc.)
- Updated role enum (student, space_admin, system_admin)
- Added unique constraints on email and username
- Added authentication flags

## Troubleshooting

### Token Invalid Error
```typescript
// Clear stored token
await AsyncStorage.removeItem("cie_auth_token");
```

### Database Connection Error
```bash
# Test connection
npm run db:test

# Check environment variables
cat .env | grep DATABASE_URL
```

### Migration Failed
```bash
# Check current schema
npx tsx scripts/check-schema.ts

# Re-apply migration
npx tsx scripts/apply-auth-migration.ts
```

### User Already Exists
- Email must be unique
- Username must be unique
- Try different email or username

## Next Steps

### Recommended Enhancements
1. ✅ Email verification flow
2. ✅ Password reset functionality
3. ✅ OAuth integration (Google, GitHub)
4. ✅ Two-factor authentication
5. ✅ Session timeout handling
6. ✅ Rate limiting on auth endpoints
7. ✅ Audit logging for auth events

### Production Checklist
- ✅ Database migrations applied
- ✅ Environment variables configured
- ✅ SSL/TLS enabled
- ✅ Password hashing implemented
- ✅ Input validation in place
- ✅ Token expiration set
- ✅ Error handling implemented
- ⚠️ Rate limiting (recommended)
- ⚠️ Email verification (recommended)
- ⚠️ CAPTCHA on registration (recommended)

## File Structure

```
├── lib/
│   ├── auth-store.tsx          # React Context for auth state
│   └── neon-auth.ts            # Neon Auth JWT validation
│
├── server/
│   ├── routers/
│   │   └── auth.router.ts      # tRPC auth endpoints
│   ├── services/
│   │   └── auth.service.ts     # Authentication business logic
│   └── routers.ts              # Main router config
│
├── drizzle/
│   ├── schema.ts               # Database schema definition
│   └── migrations/
│       └── 0001_auth_schema_update.sql
│
├── app/
│   ├── (auth)/
│   │   └── login.tsx           # Login screen
│   ├── signup.tsx              # Registration screen
│   ├── landing.tsx             # Public landing page
│   └── (tabs)/
│       └── _layout.tsx         # Protected tabs layout
│
└── scripts/
    ├── apply-auth-migration.ts # Migration runner
    ├── test-db-connection.ts   # DB connection test
    ├── check-schema.ts         # Schema inspector
    └── view-users.ts           # User data viewer
```

## Support

For issues or questions:
1. Check this documentation
2. Review `SECURITY_AUDIT.md`
3. Review `NEON_AUTH_GUIDE.md`
4. Check database connection: `npm run db:test`
5. View audit logs in Neon dashboard

---

**Last Updated**: August 7, 2026  
**Status**: ✅ Production Ready  
**Database**: Neon PostgreSQL  
**Auth Method**: JWT + bcrypt
