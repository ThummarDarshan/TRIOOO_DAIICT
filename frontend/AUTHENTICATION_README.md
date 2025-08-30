# SeaWatch Guardian Authentication System

## Overview

The SeaWatch Guardian application now includes a comprehensive authentication system with role-based access control (RBAC) designed specifically for coastal monitoring and emergency response stakeholders.

## User Categories

The system supports 5 distinct user categories, each with different levels of access:

### 1. Disaster Management Departments
- **Role**: `disaster_management`
- **Access Level**: Full System Access
- **Permissions**:
  - View all system data
  - Create and manage alerts
  - Manage all users and permissions
  - Access advanced reports and analytics
  - View AI predictions
  - Manage sensor configurations
  - Send emergency broadcasts

### 2. Coastal City Governments
- **Role**: `coastal_city_government`
- **Access Level**: High Access
- **Permissions**:
  - View all system data
  - Create and manage alerts
  - Access reports and analytics
  - View AI predictions
  - Emergency coordination tools
  - Public communication features

### 3. Environmental NGOs
- **Role**: `environmental_ngo`
- **Access Level**: Medium Access
- **Permissions**:
  - View environmental data
  - Create alerts for environmental incidents
  - Access research tools and reports
  - View AI predictions
  - Community alert capabilities

### 4. Fisherfolk
- **Role**: `fisherfolk`
- **Access Level**: Basic Access
- **Permissions**:
  - Receive safety alerts
  - View weather predictions
  - Emergency notifications
  - Basic monitoring data access

### 5. Civil Defence Teams
- **Role**: `civil_defence_team`
- **Access Level**: High Access
- **Permissions**:
  - View all system data
  - Create and manage alerts
  - Access emergency response tools
  - View AI predictions
  - Emergency coordination features
  - Public safety alerts

## Authentication Flow

### 1. Landing Page
- Unauthenticated users see a comprehensive landing page
- Information about the system and user categories
- Call-to-action buttons for login and registration

### 2. Registration
- New users can create accounts with role selection
- Comprehensive form with validation
- Role-specific feature explanations
- Automatic permission assignment based on role

### 3. Login
- Existing users can sign in with email/password
- Role-based navigation and features
- Automatic redirect to dashboard after authentication

### 4. Protected Routes
- All main application features require authentication
- Role-based permission checking
- Automatic redirects for unauthorized access

## Demo Credentials

For testing purposes, the following demo accounts are available:

### Admin User
- **Email**: `admin@disaster.gov`
- **Password**: `password123`
- **Role**: Disaster Management Department
- **Access**: Full system access

### Mayor User
- **Email**: `mayor@mumbai.gov`
- **Password**: `password123`
- **Role**: Coastal City Government
- **Access**: High-level access without user management

## Technical Implementation

### Authentication Context
- Global state management for user authentication
- Automatic token persistence in localStorage
- Role-based permission checking

### Protected Routes
- Route-level permission validation
- Automatic redirects for unauthorized access
- Loading states during authentication checks

### Form Validation
- Zod schema validation for all forms
- Real-time error feedback
- Password strength requirements

## File Structure

```
src/
├── contexts/
│   └── AuthContext.tsx          # Authentication context
├── components/
│   └── auth/
│       └── ProtectedRoute.tsx   # Route protection component
├── lib/
│   └── auth.ts                  # Authentication service and types
├── pages/
│   ├── Login.tsx                # Login page
│   ├── Register.tsx             # Registration page
│   ├── Profile.tsx              # User profile page
│   └── Landing.tsx              # Landing page for unauthenticated users
└── App.tsx                      # Updated with authentication routing
```

## Security Features

- Password validation and confirmation
- Role-based access control
- Protected route implementation
- Session persistence
- Automatic logout on authentication failure

## Future Enhancements

- JWT token implementation
- Password reset functionality
- Email verification
- Two-factor authentication
- Advanced role management
- Audit logging
- Session timeout management

## Usage Instructions

### For Users
1. Visit the landing page to learn about the system
2. Click "Sign Up" to create a new account
3. Select your appropriate user category
4. Complete the registration form
5. Sign in with your credentials
6. Access role-specific features and tools

### For Developers
1. The authentication system is fully integrated
2. Use `useAuth()` hook to access authentication state
3. Wrap protected components with `ProtectedRoute`
4. Check permissions using `user.permissions`
5. All authentication logic is centralized in the auth context

## Testing

The system includes mock data for development and testing:
- Mock user database with sample accounts
- Simulated API delays for realistic testing
- Comprehensive error handling and validation
- Role-based feature demonstrations

## Support

For technical support or questions about the authentication system, please refer to the main project documentation or contact the development team.
