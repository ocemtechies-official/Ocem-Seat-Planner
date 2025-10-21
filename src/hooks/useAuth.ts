"use client";

import { createClient } from "@/lib/supabase/client";
import type { AuthUser, LoginCredentials, RegisterCredentials } from "@/types/auth";
import type { UserRole } from "@/types/database";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          await fetchUserRole(session.user.id);
        } else {
          setUser(null);
          setRole(null);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await fetchUserRole(session.user.id);
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data: userData } = await supabase
        .from("users")
        .select("role, email")
        .eq("id", userId)
        .single();

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser && userData) {
        setUser({ ...authUser, role: (userData as any).role } as AuthUser);
        setRole((userData as any).role as UserRole);
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const signIn = async ({ email, password }: LoginCredentials) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Refresh to update session
    router.refresh();
  };

  const signUp = async ({ email, password, rollNumber }: RegisterCredentials) => {
    // First, verify roll number exists and isn't already linked
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("id, user_id")
      .eq("roll_number", rollNumber)
      .single();

    if (studentError || !student) {
      throw new Error("Invalid roll number. Please contact your administrator.");
    }

    if ((student as any).user_id) {
      throw new Error("This roll number is already linked to an account.");
    }

    // Create auth user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) throw signUpError;

    if (authData.user) {
      // Link student record to user
      const { error: updateError } = await (supabase as any)
        .from("students")
        .update({ user_id: authData.user.id })
        .eq("id", (student as any).id);

      if (updateError) {
        console.error("Error linking student to user:", updateError);
      }
    }

    router.refresh();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    router.push("/login");
    router.refresh();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) throw error;
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
  };

  return {
    user,
    role,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    signInWithGoogle,
  };
}

/**
 * Hook to require authentication
 * Redirects to login if not authenticated
 */
export function useRequireAuth(requiredRoles?: UserRole[]) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (requiredRoles && role && !requiredRoles.includes(role)) {
        // Redirect based on role
        if (role === "student") {
          router.push("/my-exams");
        } else {
          router.push("/dashboard");
        }
      }
    }
  }, [user, role, loading, requiredRoles, router]);

  return { user, role, loading };
}
