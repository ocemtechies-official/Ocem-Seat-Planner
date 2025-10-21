import { createClient } from "@/lib/supabase/server";
import type { Student, StudentWithRelations } from "@/types/database";
import type { StudentFilters } from "@/types/api";

export async function getStudents(filters?: StudentFilters) {
  const supabase = await createClient();

  let query = supabase
    .from("students")
    .select(`
      *,
      department:departments(id, name, code),
      course:courses(id, name, code),
      user:users(id, email)
    `)
    .order("roll_number");

  // Apply filters
  if (filters?.department_id) {
    query = query.eq("department_id", filters.department_id);
  }

  if (filters?.course_id) {
    query = query.eq("course_id", filters.course_id);
  }

  if (filters?.year) {
    query = query.eq("year", filters.year);
  }

  if (filters?.has_user_account !== undefined) {
    if (filters.has_user_account) {
      query = query.not("user_id", "is", null);
    } else {
      query = query.is("user_id", null);
    }
  }

  if (filters?.search) {
    query = query.or(
      `roll_number.ilike.%${filters.search}%,name.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as StudentWithRelations[];
}

export async function getStudentById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("students")
    .select(`
      *,
      department:departments(id, name, code),
      course:courses(id, name, code),
      user:users(id, email)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as StudentWithRelations;
}

export async function getStudentByRollNumber(rollNumber: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("students")
    .select(`
      *,
      department:departments(id, name, code),
      course:courses(id, name, code)
    `)
    .eq("roll_number", rollNumber)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return null;
    }
    throw error;
  }
  return data;
}

export async function createStudent(student: {
  roll_number: string;
  name: string;
  email?: string;
  department_id: string;
  course_id: string;
  year: number;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("students")
    .insert(student as any)
    .select(`
      *,
      department:departments(id, name, code),
      course:courses(id, name, code)
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function updateStudent(
  id: string,
  updates: Partial<{
    roll_number: string;
    name: string;
    email: string;
    department_id: string;
    course_id: string;
    year: number;
  }>
) {
  const supabase = await createClient();

  const { data, error } = await (supabase as any)
    .from("students")
    .update(updates)
    .eq("id", id)
    .select(`
      *,
      department:departments(id, name, code),
      course:courses(id, name, code)
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function deleteStudent(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("students").delete().eq("id", id);

  if (error) throw error;
  return { success: true };
}

export async function bulkCreateStudents(
  students: Array<{
    roll_number: string;
    name: string;
    email?: string;
    department_id: string;
    course_id: string;
    year: number;
  }>
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("students")
    .insert(students as any)
    .select();

  if (error) throw error;
  return data;
}
