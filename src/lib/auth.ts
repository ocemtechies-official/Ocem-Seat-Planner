import { createClient as createServerClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";
import { cache } from "react";

/**
 * Get the current authenticated user (server-side)
 * Cached per request
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch user role from our users table
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  return {
    ...user,
    role: (userData as any)?.role as UserRole | undefined,
  };
});

/**
 * Get user's role (server-side)
 */
export async function getUserRole(): Promise<UserRole | null> {
  const user = await getCurrentUser();
  return user?.role || null;
}

/**
 * Check if current user has one of the required roles
 */
export async function hasRole(allowedRoles: UserRole[]): Promise<boolean> {
  const role = await getUserRole();
  if (!role) return false;
  return allowedRoles.includes(role);
}

/**
 * Require specific role(s) - throws error if unauthorized
 * Use this in API routes or server actions
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<void> {
  const isAuthorized = await hasRole(allowedRoles);
  if (!isAuthorized) {
    throw new Error("Unauthorized: Insufficient permissions");
  }
}

/**
 * Check if user can access a specific department (for staff)
 */
export async function canAccessDepartment(
  departmentId: string
): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  // Admins can access all departments
  if (user.role === "admin") return true;

  // Staff can only access their assigned departments
  if (user.role === "staff") {
    const supabase = await createServerClient();
    const { data } = await supabase
      .from("staff_permissions")
      .select("department_id")
      .eq("user_id", user.id)
      .eq("department_id", departmentId)
      .single();

    return !!data;
  }

  return false;
}

/**
 * Check if user owns a student record
 */
export async function isStudentOwner(studentId: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  const supabase = await createServerClient();
  const { data } = await supabase
    .from("students")
    .select("user_id")
    .eq("id", studentId)
    .eq("user_id", user.id)
    .single();

  return !!data;
}

/**
 * Get user's accessible departments (for staff)
 */
export async function getAccessibleDepartments(): Promise<string[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  // Admins can access all departments
  if (user.role === "admin") {
    const supabase = await createServerClient();
    const { data } = await supabase.from("departments").select("id");
    return (data as any)?.map((d: any) => d.id) || [];
  }

  // Staff can only access assigned departments
  if (user.role === "staff") {
    const supabase = await createServerClient();
    const { data } = await supabase
      .from("staff_permissions")
      .select("department_id")
      .eq("user_id", user.id);

    return (data as any)?.map((p: any) => p.department_id) || [];
  }

  return [];
}
