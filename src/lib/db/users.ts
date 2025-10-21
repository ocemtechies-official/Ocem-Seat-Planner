import { createClient } from "@/lib/supabase/server";

export interface CreateUserData {
  email: string;
  password: string;
  role: "admin" | "staff" | "supervisor" | "student";
  department_ids?: string[]; // For staff permissions
}

export async function getUsers() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select(
      `
      id,
      email,
      role,
      created_at,
      updated_at
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    throw error;
  }

  return data;
}

export async function getUserById(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select(
      `
      id,
      email,
      role,
      created_at,
      updated_at
    `
    )
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    throw error;
  }

  return data;
}

export async function updateUserRole(
  userId: string,
  role: "admin" | "staff" | "supervisor" | "student"
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .update({
      role,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating user role:", error);
    throw error;
  }

  return data;
}

export async function deleteUser(userId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("users").delete().eq("id", userId);

  if (error) {
    console.error("Error deleting user:", error);
    throw error;
  }

  return true;
}

// Staff Permissions

export async function getStaffPermissions(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("staff_permissions")
    .select(
      `
      id,
      department:departments (
        id,
        name,
        code
      )
    `
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching staff permissions:", error);
    throw error;
  }

  return data;
}

export async function setStaffPermissions(
  userId: string,
  departmentIds: string[]
) {
  const supabase = await createClient();

  // Delete existing permissions
  await supabase.from("staff_permissions").delete().eq("user_id", userId);

  // Insert new permissions
  if (departmentIds.length > 0) {
    const permissions = departmentIds.map((departmentId) => ({
      user_id: userId,
      department_id: departmentId,
    }));

    const { error } = await supabase
      .from("staff_permissions")
      .insert(permissions);

    if (error) {
      console.error("Error setting staff permissions:", error);
      throw error;
    }
  }

  return true;
}
