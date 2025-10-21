import { createClient } from "@/lib/supabase/server";
import type { ExamHall } from "@/types/database";

export async function getHalls() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("exam_halls")
    .select("*")
    .order("name");

  if (error) throw error;
  return data as ExamHall[];
}

export async function getHallById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("exam_halls")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as ExamHall;
}

export async function createHall(hall: {
  name: string;
  total_seats: number;
  rows: number;
  columns: number;
  layout_config?: any;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("exam_halls")
    .insert(hall as any)
    .select()
    .single();

  if (error) throw error;
  return data as ExamHall;
}

export async function updateHall(
  id: string,
  updates: Partial<{
    name: string;
    total_seats: number;
    rows: number;
    columns: number;
    layout_config: any;
  }>
) {
  const supabase = await createClient();

  const { data, error } = await (supabase as any)
    .from("exam_halls")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as ExamHall;
}

export async function deleteHall(id: string) {
  const supabase = await createClient();

  // Check if hall has future exam assignments
  const { data: futureExams, error: checkError } = await supabase
    .from("exam_halls_assignments")
    .select(`
      id,
      exams (
        id,
        subject,
        exam_date,
        status
      )
    `)
    .eq("hall_id", id);

  if (checkError) throw checkError;

  // Check if any assigned exams are in the future or scheduled
  const today = new Date().toISOString().split("T")[0];
  const hasFutureExams = futureExams?.some((assignment: any) => {
    const exam = assignment.exams;
    return (
      exam &&
      (exam.exam_date >= today || exam.status === "scheduled")
    );
  });

  if (hasFutureExams) {
    throw new Error(
      "Cannot delete hall with scheduled or future exams. Please reassign or delete those exams first."
    );
  }

  const { error } = await supabase.from("exam_halls").delete().eq("id", id);

  if (error) throw error;
  return { success: true };
}
