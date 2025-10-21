import { User as SupabaseUser } from "@supabase/supabase-js";
import type { UserRole } from "./database";

export interface AuthUser extends SupabaseUser {
  role?: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  rollNumber: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface UpdatePasswordRequest {
  password: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  loading: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signUp: (credentials: RegisterCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

export interface ProtectedRouteConfig {
  allowedRoles: UserRole[];
  redirectTo?: string;
}
