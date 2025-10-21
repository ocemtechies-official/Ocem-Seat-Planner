import { createClient } from "@/lib/supabase/server";

export interface SeatAssignment {
  id: string;
  exam_id: string;
  student_id: string;
  seat_id: string;
  hall_id: string;
  assigned_at: string;
  assigned_by: string;
  is_manual: boolean;
  student: {
    id: string;
    roll_number: string;
    name: string;
    email: string | null;
    department: {
      id: string;
      name: string;
      code: string;
    };
    course: {
      id: string;
      name: string;
      code: string;
    };
  };
  seat: {
    id: string;
    seat_number: string;
    row_number: number;
    col_number: number;
  };
  hall: {
    id: string;
    name: string;
  };
}

/**
 * Get all seat assignments for an exam
 */
export async function getExamAssignments(
  examId: string
): Promise<SeatAssignment[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("seat_assignments")
    .select(
      `
      id,
      exam_id,
      student_id,
      seat_id,
      hall_id,
      assigned_at,
      assigned_by,
      is_manual,
      student:students (
        id,
        roll_number,
        name,
        email,
        department:departments (
          id,
          name,
          code
        ),
        course:courses (
          id,
          name,
          code
        )
      ),
      seat:seats (
        id,
        seat_number,
        row_number,
        col_number
      ),
      hall:exam_halls (
        id,
        name
      )
    `
    )
    .eq("exam_id", examId)
    .order("hall_id")
    .order("seat_number");

  if (error) {
    console.error("Error fetching exam assignments:", error);
    throw error;
  }

  return (data as any) || [];
}

/**
 * Get assignments for a specific hall in an exam
 */
export async function getHallAssignments(
  examId: string,
  hallId: string
): Promise<SeatAssignment[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("seat_assignments")
    .select(
      `
      id,
      exam_id,
      student_id,
      seat_id,
      hall_id,
      assigned_at,
      assigned_by,
      is_manual,
      student:students (
        id,
        roll_number,
        name,
        email,
        department:departments (
          id,
          name,
          code
        ),
        course:courses (
          id,
          name,
          code
        )
      ),
      seat:seats (
        id,
        seat_number,
        row_number,
        col_number
      ),
      hall:exam_halls (
        id,
        name
      )
    `
    )
    .eq("exam_id", examId)
    .eq("hall_id", hallId)
    .order("seat_number");

  if (error) {
    console.error("Error fetching hall assignments:", error);
    throw error;
  }

  return (data as any) || [];
}

/**
 * Get assignment for a specific student in an exam
 */
export async function getStudentAssignment(
  examId: string,
  studentId: string
): Promise<SeatAssignment | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("seat_assignments")
    .select(
      `
      id,
      exam_id,
      student_id,
      seat_id,
      hall_id,
      assigned_at,
      assigned_by,
      is_manual,
      student:students (
        id,
        roll_number,
        name,
        email,
        department:departments (
          id,
          name,
          code
        ),
        course:courses (
          id,
          name,
          code
        )
      ),
      seat:seats (
        id,
        seat_number,
        row_number,
        col_number
      ),
      hall:exam_halls (
        id,
        name
      )
    `
    )
    .eq("exam_id", examId)
    .eq("student_id", studentId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No assignment found
      return null;
    }
    console.error("Error fetching student assignment:", error);
    throw error;
  }

  return data as any;
}

/**
 * Update a seat assignment (manual override)
 */
export async function updateAssignment(
  assignmentId: string,
  newSeatId: string,
  newHallId: string,
  userId: string
): Promise<SeatAssignment> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("seat_assignments")
    .update({
      seat_id: newSeatId,
      hall_id: newHallId,
      is_manual: true,
      assigned_by: userId,
      assigned_at: new Date().toISOString(),
    } as any)
    .eq("id", assignmentId)
    .select()
    .single();

  if (error) {
    console.error("Error updating assignment:", error);
    throw error;
  }

  return data as any;
}

/**
 * Delete a seat assignment
 */
export async function deleteAssignment(assignmentId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("seat_assignments")
    .delete()
    .eq("id", assignmentId);

  if (error) {
    console.error("Error deleting assignment:", error);
    throw error;
  }
}

/**
 * Check if exam has any seat assignments
 */
export async function hasAssignments(examId: string): Promise<boolean> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("seat_assignments")
    .select("*", { count: "exact", head: true })
    .eq("exam_id", examId);

  if (error) {
    console.error("Error checking assignments:", error);
    throw error;
  }

  return (count || 0) > 0;
}

/**
 * Get assignment statistics for an exam
 */
export async function getAssignmentStats(examId: string) {
  const supabase = await createClient();

  const { count: totalAssignments, error: assignmentsError } = await supabase
    .from("seat_assignments")
    .select("*", { count: "exact", head: true })
    .eq("exam_id", examId);

  if (assignmentsError) {
    console.error("Error counting assignments:", assignmentsError);
    throw assignmentsError;
  }

  const { count: manualAssignments, error: manualError } = await supabase
    .from("seat_assignments")
    .select("*", { count: "exact", head: true })
    .eq("exam_id", examId)
    .eq("is_manual", true);

  if (manualError) {
    console.error("Error counting manual assignments:", manualError);
    throw manualError;
  }

  const { count: totalStudents, error: studentsError } = await supabase
    .from("exam_students")
    .select("*", { count: "exact", head: true })
    .eq("exam_id", examId);

  if (studentsError) {
    console.error("Error counting students:", studentsError);
    throw studentsError;
  }

  return {
    total_assignments: totalAssignments || 0,
    manual_assignments: manualAssignments || 0,
    auto_assignments: (totalAssignments || 0) - (manualAssignments || 0),
    total_students: totalStudents || 0,
    unassigned: (totalStudents || 0) - (totalAssignments || 0),
  };
}
