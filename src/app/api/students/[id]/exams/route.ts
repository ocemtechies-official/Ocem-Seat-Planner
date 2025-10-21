import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify user is authenticated
    await requireRole(["admin", "staff", "supervisor", "student"]);

    const { id: studentId } = await params;
    const supabase = await createClient();

    // Get all exams for this student with seat assignments
    const { data: examStudents, error: examError } = await supabase
      .from("exam_students")
      .select(
        `
        exam:exams (
          id,
          subject,
          exam_date,
          start_time,
          duration_minutes,
          status,
          course:courses (
            id,
            code,
            name
          )
        )
      `
      )
      .eq("student_id", studentId);

    if (examError) {
      throw examError;
    }

    // For each exam, get the seat assignment if it exists
    const examsWithAssignments = await Promise.all(
      (examStudents || []).map(async (es: any) => {
        const { data: assignment } = await supabase
          .from("seat_assignments")
          .select(
            `
            id,
            hall:exam_halls (
              id,
              name
            ),
            seat:seats (
              id,
              seat_number
            )
          `
          )
          .eq("exam_id", es.exam.id)
          .eq("student_id", studentId)
          .single();

        return {
          exam: es.exam,
          assignment: assignment || null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: examsWithAssignments,
    });
  } catch (error: any) {
    console.error("Error in GET /api/students/[id]/exams:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch student exams",
      },
      { status: 500 }
    );
  }
}
