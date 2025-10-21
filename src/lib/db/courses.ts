import { createClient } from "@/lib/supabase/server";
import type { Course } from "@/types/database";

export async function getCourses(departmentId?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("courses")
    .select(`
      *,
      department:departments(id, name, code)
    `)
    .order("name");

  if (departmentId) {
    query = query.eq("department_id", departmentId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function getCourseById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select(`
      *,
      department:departments(id, name, code)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createCourse(course: {
  name: string;
  code: string;
  department_id: string;
  year: number;
  semester: number;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .insert(course as any)
    .select(`
      *,
      department:departments(id, name, code)
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function updateCourse(
  id: string,
  updates: Partial<{
    name: string;
    code: string;
    department_id: string;
    year: number;
    semester: number;
  }>
) {
  const supabase = await createClient();

  const { data, error } = await (supabase as any)
    .from("courses")
    .update(updates)
    .eq("id", id)
    .select(`
      *,
      department:departments(id, name, code)
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCourse(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("courses")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return { success: true };
}
