// Authentication service for Coastal Threat Alert System
import { z } from 'zod';

// User role definitions
export const USER_ROLES = {
  DISASTER_MANAGEMENT: 'disaster_management',
  COASTAL_CITY_GOVERNMENT: 'coastal_city_government',
  ENVIRONMENTAL_NGO: 'environmental_ngo',
  FISHERFOLK: 'fisherfolk',
  CIVIL_DEFENCE_TEAM: 'civil_defence_team'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// User permissions based on role
export const ROLE_PERMISSIONS = {
  [USER_ROLES.DISASTER_MANAGEMENT]: {
    canViewAllData: true,
    canCreateAlerts: true,
    canManageUsers: true,
    canAccessReports: true,
    canViewPredictions: true,
    canManageSensors: true,
    canEmergencyBroadcast: true
  },
  [USER_ROLES.COASTAL_CITY_GOVERNMENT]: {
    canViewAllData: true,
    canCreateAlerts: true,
    canManageUsers: false,
    canAccessReports: true,
    canViewPredictions: true,
    canManageSensors: false,
    canEmergencyBroadcast: true
  },
  [USER_ROLES.ENVIRONMENTAL_NGO]: {
    canViewAllData: true,
    canCreateAlerts: true,
    canManageUsers: false,
    canAccessReports: true,
    canViewPredictions: true,
    canManageSensors: false,
    canEmergencyBroadcast: false
  },
  [USER_ROLES.FISHERFOLK]: {
    canViewAllData: false,
    canCreateAlerts: true,
    canManageUsers: false,
    canAccessReports: false,
    canViewPredictions: true,
    canManageSensors: false,
    canEmergencyBroadcast: false
  },
  [USER_ROLES.CIVIL_DEFENCE_TEAM]: {
    canViewAllData: true,
    canCreateAlerts: true,
    canManageUsers: false,
    canAccessReports: true,
    canViewPredictions: true,
    canManageSensors: false,
    canEmergencyBroadcast: true
  }
} as const;

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  organization: string;
  role: UserRole;
  phone?: string;
  location?: {
    city: string;
    state: string;
    country: string;
  };
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
  permissions: typeof ROLE_PERMISSIONS[UserRole];
}

// Authentication state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Login credentials schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export type LoginCredentials = z.infer<typeof loginSchema>;

// Registration schema
export const registrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  organization: z.string().min(2, 'Organization name must be at least 2 characters'),
  role: z.nativeEnum(USER_ROLES as any),
  phone: z.string().optional(),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export type RegistrationData = z.infer<typeof registrationSchema>;

// Mock user database for development
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@disaster.gov',
    name: 'Admin User',
    organization: 'National Disaster Management Authority',
    role: USER_ROLES.DISASTER_MANAGEMENT,
    phone: '+91-9876543210',
    location: { city: 'New Delhi', state: 'Delhi', country: 'India' },
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: new Date().toISOString(),
    isActive: true,
    permissions: ROLE_PERMISSIONS[USER_ROLES.DISASTER_MANAGEMENT]
  },
  {
    id: '2',
    email: 'mayor@mumbai.gov',
    name: 'Mumbai Mayor',
    organization: 'Mumbai Municipal Corporation',
    role: USER_ROLES.COASTAL_CITY_GOVERNMENT,
    phone: '+91-9876543211',
    location: { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: new Date().toISOString(),
    isActive: true,
    permissions: ROLE_PERMISSIONS[USER_ROLES.COASTAL_CITY_GOVERNMENT]
  }
];

// Mock authentication service
export class AuthService {
  private users = mockUsers;
  private currentUser: User | null = null;

  // Login user
  async login(credentials: LoginCredentials): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = this.users.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // In a real app, you'd verify the password hash here
    if (credentials.password !== 'password123') {
      throw new Error('Invalid email or password');
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    this.currentUser = user;

    // Store in localStorage for persistence
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return user;
  }

  // Register new user
  async register(data: RegistrationData): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    if (this.users.find(u => u.email === data.email)) {
      throw new Error('User with this email already exists');
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      organization: data.organization,
      role: data.role,
      phone: data.phone,
      location: {
        city: data.city,
        state: data.state,
        country: data.country
      },
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isActive: true,
      permissions: ROLE_PERMISSIONS[data.role]
    };

    this.users.push(newUser);
    this.currentUser = newUser;

    // Store in localStorage for persistence
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return newUser;
  }

  // Logout user
  async logout(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  // Get current user
  getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Try to restore from localStorage
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored);
        return this.currentUser;
      } catch {
        localStorage.removeItem('currentUser');
      }
    }

    return null;
  }

  // Check if user has permission
  hasPermission(user: User, permission: keyof typeof ROLE_PERMISSIONS[UserRole]): boolean {
    return user.permissions[permission] || false;
  }

  // Get role display name
  getRoleDisplayName(role: UserRole): string {
    const displayNames = {
      [USER_ROLES.DISASTER_MANAGEMENT]: 'Disaster Management Department',
      [USER_ROLES.COASTAL_CITY_GOVERNMENT]: 'Coastal City Government',
      [USER_ROLES.ENVIRONMENTAL_NGO]: 'Environmental NGO',
      [USER_ROLES.FISHERFOLK]: 'Fisherfolk',
      [USER_ROLES.CIVIL_DEFENCE_TEAM]: 'Civil Defence Team'
    };
    return displayNames[role];
  }

  // Get role description
  getRoleDescription(role: UserRole): string {
    const descriptions = {
      [USER_ROLES.DISASTER_MANAGEMENT]: 'Full access to all system features including user management and emergency broadcasts',
      [USER_ROLES.COASTAL_CITY_GOVERNMENT]: 'Access to coastal monitoring data, alerts, and emergency response coordination',
      [USER_ROLES.ENVIRONMENTAL_NGO]: 'Access to environmental data and ability to report environmental incidents',
      [USER_ROLES.FISHERFOLK]: 'Basic access to safety alerts and weather predictions for fishing activities',
      [USER_ROLES.CIVIL_DEFENCE_TEAM]: 'Access to emergency response tools and coordination features'
    };
    return descriptions[role];
  }
}

// Export default instance
export const authService = new AuthService();
