# Coastal Monitoring System - Backend API

A secure, role-based authentication system built with Express.js, TypeScript, and Supabase for coastal monitoring and disaster management.

## 🏗️ Architecture Overview

### User Hierarchy & Authentication Flow

1. **Disaster Management Departments (Admins)**
   - Assigned by system super-admin
   - Manual onboarding process
   - Can manage other users after logging in

2. **Coastal City Governments (Authorities)**
   - Approved by Admin
   - City official signs up → account created as "Pending"
   - Admin verifies → upgrades role to Authority

3. **Environmental NGOs**
   - Self-registration but verified by Admin
   - NGO creates account → uploads NGO details → Admin approves
   - After approval → role = Contributor

4. **Fisherfolk (Community Users)**
   - Open self-registration (no approval needed)
   - Anyone can register as "Community User"
   - Role automatically set as Fisherfolk
   - They only get alert + reporting features (safe)

5. **Civil Defence Teams (Operational)**
   - Verified by Admin (like Authorities)
   - Civil defence team lead registers → Admin verifies credentials
   - Role updated to Operational User

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase

#### A. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and API keys

#### B. Configure Environment Variables
Copy `env.example` to `.env` and fill in your values:
```bash
cp env.example .env
```

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# JWT Configuration
JWT_SECRET=your_very_long_random_secret_key_here
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### C. Set Up Database Schema
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-setup.sql`
4. Run the script

### 3. Build and Run

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm run build
npm start
```

## 📚 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | User registration | Public |
| POST | `/login` | User login | Public |
| GET | `/profile` | Get user profile | Authenticated |
| PUT | `/profile` | Update user profile | Authenticated |

### Admin Routes (`/api/admin`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/users` | Get all users | Admin only |
| GET | `/users/pending` | Get pending users | Admin only |
| POST | `/users/:userId/approve` | Approve user | Admin only |
| POST | `/users/:userId/reject` | Reject user | Admin only |
| POST | `/users/:userId/suspend` | Suspend user | Admin only |
| POST | `/users/:userId/reactivate` | Reactivate user | Admin only |
| PUT | `/users/:userId/role` | Update user role | Admin only |

## 🔐 Authentication & Authorization

### JWT Token Format
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "fisherfolk",
  "status": "approved"
}
```

### Role-Based Access Control

#### Fisherfolk (Community Users)
- ✅ View own profile
- ✅ Update own profile
- ✅ Access alerts and reporting features
- ❌ No admin access

#### Contributors (NGOs)
- ✅ All Fisherfolk permissions
- ✅ Access to environmental data
- ✅ Submit reports and data
- ❌ No admin access

#### Authorities (City Governments)
- ✅ All Contributor permissions
- ✅ Access to city-specific data
- ✅ Manage local users
- ❌ No system-wide admin access

#### Operational (Civil Defence)
- ✅ All Authority permissions
- ✅ Access to emergency protocols
- ✅ Manage emergency responses
- ❌ No user management access

#### Admins
- ✅ All permissions
- ✅ User management
- ✅ Role assignment
- ✅ System configuration

#### Super Admin
- ✅ All Admin permissions
- ✅ Can manage other admins
- ✅ System-wide control

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  organization TEXT,
  role user_role NOT NULL DEFAULT 'fisherfolk',
  status user_status NOT NULL DEFAULT 'pending',
  phone TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP WITH TIME ZONE
);
```

### User Profiles Table
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  avatar_url TEXT,
  bio TEXT,
  expertise TEXT[],
  certifications TEXT[],
  emergency_contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔒 Security Features

- **Row Level Security (RLS)** enabled on all tables
- **JWT-based authentication** with configurable expiration
- **Role-based access control** with granular permissions
- **Password hashing** using bcryptjs
- **CORS protection** with configurable origins
- **Input validation** and sanitization
- **Rate limiting** (can be added)

## 🧪 Testing

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User",
    "role": "fisherfolk",
    "organization": "Test Org"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🚨 Troubleshooting

### Common Issues

1. **Supabase Connection Error**
   - Verify your environment variables
   - Check if your Supabase project is active
   - Ensure your API keys are correct

2. **Database Schema Errors**
   - Run the SQL script in the correct order
   - Check if all required extensions are enabled
   - Verify RLS policies are properly configured

3. **JWT Token Issues**
   - Ensure JWT_SECRET is set and secure
   - Check token expiration settings
   - Verify token format in Authorization header

4. **CORS Errors**
   - Update CORS origins in `src/index.ts`
   - Ensure frontend URL is included in allowed origins

## 📝 Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `SUPABASE_URL` | Your Supabase project URL | ✅ | - |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ | - |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ | - |
| `JWT_SECRET` | Secret key for JWT signing | ✅ | - |
| `JWT_EXPIRES_IN` | JWT token expiration time | ❌ | `24h` |
| `PORT` | Server port | ❌ | `5000` |
| `NODE_ENV` | Environment mode | ❌ | `development` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review Supabase documentation
