# 🗄️ Supabase Database Setup Guide

## 🚀 Quick Start

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Choose your organization and project name
4. Set a secure database password
5. Choose your region (closest to your users)
6. Wait for project to be ready (2-3 minutes)

### 2. Get Your Project Credentials
1. Go to **Settings** → **API** in your project dashboard
2. Copy these values:
   - **Project URL** (e.g., `https://abc123.supabase.co`)
   - **Anon Key** (public key for client-side)
   - **Service Role Key** (private key for server-side)

### 3. Configure Environment Variables
```bash
# Copy env.example to .env
cp env.example .env
```

Edit `.env` file:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
JWT_SECRET=your_very_long_random_secret_key_here
JWT_EXPIRES_IN=24h
PORT=5000
NODE_ENV=development
```

### 4. Set Up Database Schema
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the entire content of `supabase-setup.sql`
3. Paste it in the SQL Editor
4. Click **Run** to execute the script

## 📊 Database Schema Overview

### 🔐 **Authentication & Users**
- **`users`** - User accounts with roles and status
- **`user_profiles`** - Extended user information and preferences

### 🚨 **Incident Management**
- **`incident_reports`** - Environmental incident reports from users
- **`alerts`** - System-generated alerts and warnings

### 📡 **Monitoring & Sensors**
- **`sensors`** - Coastal monitoring sensors and equipment
- **`sensor_readings`** - Real-time sensor data readings

### 🤖 **AI & Predictions**
- **`predictions`** - AI-generated coastal predictions
- **`prediction_models`** - Machine learning model metadata

### ⚠️ **Risk Assessment**
- **`risk_assessments`** - Environmental risk evaluations
- **`notification_logs`** - User notification history

## 🔑 User Roles & Permissions

### **Fisherfolk (Community Users)**
- ✅ Create incident reports
- ✅ View active alerts
- ✅ Update own profile
- ❌ No admin access

### **Contributors (NGOs)**
- ✅ All Fisherfolk permissions
- ✅ Access to environmental data
- ❌ No admin access

### **Authorities (City Governments)**
- ✅ All Contributor permissions
- ✅ Manage local users
- ✅ Create and manage alerts
- ❌ No system-wide admin access

### **Operational (Civil Defence)**
- ✅ All Authority permissions
- ✅ Access to emergency protocols
- ❌ No user management access

### **Admins**
- ✅ All permissions
- ✅ User management
- ✅ Role assignment
- ✅ System configuration

### **Super Admin**
- ✅ All Admin permissions
- ✅ Can manage other admins
- ✅ System-wide control

## 🗃️ Database Tables Details

### **Users Table**
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

### **Incident Reports Table**
```sql
CREATE TABLE incident_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES users(id),
  incident_type incident_type NOT NULL,
  incident_title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity incident_severity NOT NULL,
  status incident_status DEFAULT 'pending',
  location TEXT NOT NULL,
  coordinates TEXT,
  sector TEXT,
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  -- ... more fields
);
```

### **Alerts Table**
```sql
CREATE TABLE alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type alert_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  category alert_category NOT NULL,
  location TEXT NOT NULL,
  severity incident_severity NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP WITH TIME ZONE,
  -- ... more fields
);
```

## 🔒 Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

- **Users can only see their own data**
- **Admins can see all data**
- **Public data (alerts, sensors) visible to all authenticated users**
- **Sensitive operations require proper role permissions**

## 📱 API Endpoints

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### **Admin Management**
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users/:id/approve` - Approve user
- `POST /api/admin/users/:id/reject` - Reject user
- `PUT /api/admin/users/:id/role` - Update user role

### **Incident Reports**
- `POST /api/incidents` - Create incident report
- `GET /api/incidents` - Get all incidents
- `GET /api/incidents/:id` - Get specific incident
- `PUT /api/incidents/:id` - Update incident
- `POST /api/incidents/:id/verify` - Verify incident (admin)
- `POST /api/incidents/:id/resolve` - Resolve incident (admin)

### **Alerts**
- `GET /api/alerts` - Get all alerts
- `GET /api/alerts/active` - Get active alerts
- `POST /api/alerts` - Create alert (admin)
- `PUT /api/alerts/:id` - Update alert (admin)
- `POST /api/alerts/:id/acknowledge` - Acknowledge alert

## 🧪 Testing the Setup

### 1. Test Database Connection
```bash
npm run dev
# Check console for successful startup
```

### 2. Test Health Endpoint
```bash
curl http://localhost:5000/health
# Should return: {"status":"OK","timestamp":"...","environment":"development"}
```

### 3. Test User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User",
    "role": "fisherfolk"
  }'
```

### 4. Test User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🚨 Troubleshooting

### **Common Issues**

1. **"Missing Supabase environment variables"**
   - Check your `.env` file
   - Ensure all required variables are set

2. **"Connection failed"**
   - Verify your Supabase project is active
   - Check your API keys are correct
   - Ensure your project URL is correct

3. **"Table doesn't exist"**
   - Run the SQL script in Supabase SQL Editor
   - Check for any SQL errors in the execution

4. **"Permission denied"**
   - Verify RLS policies are properly set
   - Check user role and status

5. **"JWT verification failed"**
   - Ensure JWT_SECRET is set and secure
   - Check token format in Authorization header

### **Database Schema Issues**

1. **Check if tables exist:**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

2. **Check RLS policies:**
   ```sql
   SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
   FROM pg_policies 
   WHERE schemaname = 'public';
   ```

3. **Verify user roles:**
   ```sql
   SELECT * FROM public.users;
   ```

## 🔄 Database Migrations

For future updates, you can:

1. **Create new migration files** with incremental changes
2. **Use Supabase migrations** for version control
3. **Test migrations** in development before production

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Functions](https://supabase.com/docs/guides/database/functions)

## 🎯 Next Steps

1. ✅ **Database setup complete**
2. ✅ **API endpoints ready**
3. 🔄 **Test all endpoints**
4. 🔄 **Connect frontend to backend**
5. 🔄 **Deploy to production**

Your Supabase database is now ready to handle all your coastal monitoring system requirements! 🚀
