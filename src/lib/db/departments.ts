import { createClient } from "@/lib/supabase/server";
import type { Department } from "@/types/database";

export async function getDepartments() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("departments")
    .select("*")
    .order("name");

  if (error) throw error;
  return data as Department[];
}

export async function getDepartmentById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("departments")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Department;
}

export async function createDepartment(department: {
  name: string;
  code: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("departments")
    .insert(department as any)
    .select()
    .single();

  if (error) throw error;
  return data as Department;
}

export async function updateDepartment(
  id: string,
  updates: Partial<{ name: string; code: string }>
) {
  const supabase = await createClient();

  const { data, error } = await (supabase as any)
    .from("departments")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Department;
}

export async function deleteDepartment(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("departments")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return { success: true };
}
