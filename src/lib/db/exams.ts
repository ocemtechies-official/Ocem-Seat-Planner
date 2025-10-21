import { createClient } from "@/lib/supabase/server";

export interface ExamFilters {
  status?: "draft" | "scheduled" | "completed" | "cancelled";
  course_id?: string;
  start_date?: string;
  end_date?: string;
}

export interface CreateExamData {
  subject: string;
  course_id: string;
  exam_date: string;
  start_time: string;
  duration_minutes: number;
  status?: "draft" | "scheduled";
  created_by: string;
}

export interface UpdateExamData {
  subject?: string;
  course_id?: string;
  exam_date?: string;
  start_time?: string;
  duration_minutes?: number;
  status?: "draft" | "scheduled" | "completed" | "cancelled";
}

export async function getExams(filters?: ExamFilters) {
  const supabase = await createClient();

  let query = supabase
    .from("exams")
    .select(
      `
      *,
      course:courses(
        id,
        name,
        code,
        department:departments(
          id,
          name,
          code
        )
      ),
      creator:users!exams_created_by_fkey(
        id,
        email,
        role
      )
    `
    )
    .order("exam_date", { ascending: false });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.course_id) {
    query = query.eq("course_id", filters.course_id);
  }

  if (filters?.start_date) {
    query = query.gte("exam_date", filters.start_date);
  }

  if (filters?.end_date) {
    query = query.lte("exam_date", filters.end_date);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching exams:", error);
    throw error;
  }

  return data;
}

export async function getExamById(examId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("exams")
    .select(
      `
      *,
      course:courses(
        id,
        name,
        code,
        year,
        semester,
        department:departments(
          id,
          name,
          code
        )
      ),
      creator:users!exams_created_by_fkey(
        id,
        email,
        role
      )
    `
    )
    .eq("id", examId)
    .single();

  if (error) {
    console.error("Error fetching exam:", error);
    throw error;
  }

  return data;
}

export async function createExam(examData: CreateExamData) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("exams")
    .insert({
      subject: examData.subject,
      course_id: examData.course_id,
      exam_date: examData.exam_date,
      start_time: examData.start_time,
      duration_minutes: examData.duration_minutes,
      status: examData.status || "draft",
      created_by: examData.created_by,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating exam:", error);
    throw error;
  }

  return data;
}

export async function updateExam(examId: string, examData: UpdateExamData) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("exams")
    .update({
      ...examData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", examId)
    .select()
    .single();

  if (error) {
    console.error("Error updating exam:", error);
    throw error;
  }

  return data;
}

export async function deleteExam(examId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("exams").delete().eq("id", examId);

  if (error) {
    console.error("Error deleting exam:", error);
    throw error;
  }

  return true;
}

// Student Assignment Functions

export async function getExamStudents(examId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("exam_students")
    .select(
      `
      id,
      created_at,
      student:students(
        id,
        roll_number,
        name,
        email,
        year,
        department:departments(
          id,
          name,
          code
        ),
        course:courses(
          id,
          name,
          code
        )
      )
    `
    )
    .eq("exam_id", examId);

  if (error) {
    console.error("Error fetching exam students:", error);
    throw error;
  }

  return data;
}

export async function assignStudentsToExam(
  examId: string,
  studentIds: string[]
) {
  const supabase = await createClient();

  // Create array of exam_student records
  const examStudents = studentIds.map((studentId) => ({
    exam_id: examId,
    student_id: studentId,
  }));

  const { data, error } = await supabase
    .from("exam_students")
    .insert(examStudents)
    .select();

  if (error) {
    console.error("Error assigning students to exam:", error);
    throw error;
  }

  return data;
}

export async function removeStudentFromExam(examId: string, studentId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("exam_students")
    .delete()
    .eq("exam_id", examId)
    .eq("student_id", studentId);

  if (error) {
    console.error("Error removing student from exam:", error);
    throw error;
  }

  return true;
}

export async function removeAllStudentsFromExam(examId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("exam_students")
    .delete()
    .eq("exam_id", examId);

  if (error) {
    console.error("Error removing all students from exam:", error);
    throw error;
  }

  return true;
}

// Hall Assignment Functions

export async function getExamHalls(examId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("exam_halls_assignments")
    .select(
      `
      id,
      created_at,
      hall:exam_halls(
        id,
        name,
        total_seats,
        rows,
        columns
      )
    `
    )
    .eq("exam_id", examId);

  if (error) {
    console.error("Error fetching exam halls:", error);
    throw error;
  }

  return data;
}

export async function assignHallsToExam(examId: string, hallIds: string[]) {
  const supabase = await createClient();

  // Create array of exam_halls_assignments records
  const examHalls = hallIds.map((hallId) => ({
    exam_id: examId,
    hall_id: hallId,
  }));

  const { data, error } = await supabase
    .from("exam_halls_assignments")
    .insert(examHalls)
    .select();

  if (error) {
    console.error("Error assigning halls to exam:", error);
    throw error;
  }

  return data;
}

export async function removeHallFromExam(examId: string, hallId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("exam_halls_assignments")
    .delete()
    .eq("exam_id", examId)
    .eq("hall_id", hallId);

  if (error) {
    console.error("Error removing hall from exam:", error);
    throw error;
  }

  return true;
}

export async function removeAllHallsFromExam(examId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("exam_halls_assignments")
    .delete()
    .eq("exam_id", examId);

  if (error) {
    console.error("Error removing all halls from exam:", error);
    throw error;
  }

  return true;
}

// Utility Functions

export async function getExamCapacity(examId: string) {
  const supabase = await createClient();

  // Get total students
  const { count: studentCount, error: studentError } = await supabase
    .from("exam_students")
    .select("*", { count: "exact", head: true })
    .eq("exam_id", examId);

  if (studentError) {
    console.error("Error counting exam students:", studentError);
    throw studentError;
  }

  // Get total usable seats from assigned halls
  const { data: hallData, error: hallError } = await supabase
    .from("exam_halls_assignments")
    .select(
      `
      hall:exam_halls(
        id,
        seats(id, is_usable)
      )
    `
    )
    .eq("exam_id", examId);

  if (hallError) {
    console.error("Error fetching exam hall capacity:", hallError);
    throw hallError;
  }

  // Count usable seats
  let totalSeats = 0;
  if (hallData) {
    hallData.forEach((assignment: any) => {
      if (assignment.hall?.seats) {
        totalSeats += assignment.hall.seats.filter(
          (seat: any) => seat.is_usable
        ).length;
      }
    });
  }

  return {
    students: studentCount || 0,
    seats: totalSeats,
    hasCapacity: totalSeats >= (studentCount || 0),
  };
}
