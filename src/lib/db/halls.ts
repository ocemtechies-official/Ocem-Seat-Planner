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
    .insert(hall)
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

  const { data, error } = await supabase
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

  const { error } = await supabase.from("exam_halls").delete().eq("id", id);

  if (error) throw error;
  return { success: true };
}
