import { User } from '@supabase/supabase-js';

export type UserRole = "brand" | "creator" | "agency";

export interface RegisterData {
  email: string;
  password: string;
  role: UserRole;
  company_name?: string;
  industry?: string;
  username?: string;
  niche?: string;
  agency_name?: string;
  specialization?: string;
}

export interface AuthResult {
  success?: boolean;
  error?: string;
  data?: any;
  user?: User | null;
}