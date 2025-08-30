import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client for regular operations (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for privileged operations (uses service role key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Database schema types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          organization: string | null;
          role: UserRole;
          status: UserStatus;
          phone: string | null;
          location: string | null;
          created_at: string;
          updated_at: string;
          approved_by: string | null;
          approved_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          organization?: string | null;
          role: UserRole;
          status?: UserStatus;
          phone?: string | null;
          location?: string | null;
          created_at?: string;
          updated_at?: string;
          approved_by?: string | null;
          approved_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          organization?: string | null;
          role?: UserRole;
          status?: UserStatus;
          phone?: string | null;
          location?: string | null;
          created_at?: string;
          updated_at?: string;
          approved_by?: string | null;
          approved_at?: string | null;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          avatar_url: string | null;
          bio: string | null;
          expertise: string[] | null;
          certifications: string[] | null;
          emergency_contact: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          avatar_url?: string | null;
          bio?: string | null;
          expertise?: string[] | null;
          certifications?: string[] | null;
          emergency_contact?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          avatar_url?: string | null;
          bio?: string | null;
          expertise?: string[] | null;
          certifications?: string[] | null;
          emergency_contact?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  AUTHORITY = 'authority',
  CONTRIBUTOR = 'contributor',
  OPERATIONAL = 'operational',
  FISHERFOLK = 'fisherfolk'
}

export enum UserStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended'
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  organization: string | null;
  role: UserRole;
  status: UserStatus;
  phone: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
  approved_by: string | null;
  approved_at: string | null;
}
