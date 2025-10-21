import { requireRole } from "@/lib/auth";
import {
  assignStudentsToExam,
  getExamStudents,
  removeStudentFromExam,
  removeAllStudentsFromExam,
} from "@/lib/db/exams";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify user is authenticated
    await requireRole(["admin", "staff", "supervisor"]);

    const { id } = await params;
    const students = await getExamStudents(id);

    return NextResponse.json({
      success: true,
      data: students,
    });
  } catch (error: any) {
    console.error("Error in GET /api/exams/[id]/students:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch exam students",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify user is admin or staff
    await requireRole(["admin", "staff"]);

    const body = await request.json();

    if (!body.student_ids || !Array.isArray(body.student_ids)) {
      return NextResponse.json(
        {
          success: false,
          error: "student_ids must be an array",
        },
        { status: 400 }
      );
    }

    if (body.student_ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "At least one student ID is required",
        },
        { status: 400 }
      );
    }

    const { id } = await params;
    const assignments = await assignStudentsToExam(
      id,
      body.student_ids
    );

    return NextResponse.json({
      success: true,
      data: assignments,
      message: `${assignments.length} student(s) assigned to exam`,
    });
  } catch (error: any) {
    console.error("Error in POST /api/exams/[id]/students:", error);

    // Handle duplicate assignment error
    if (error.code === "23505") {
      return NextResponse.json(
        {
          success: false,
          error: "One or more students are already assigned to this exam",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to assign students to exam",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify user is admin or staff
    await requireRole(["admin", "staff"]);

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("student_id");

    const { id } = await params;

    if (studentId) {
      // Remove specific student
      await removeStudentFromExam(id, studentId);
      return NextResponse.json({
        success: true,
        message: "Student removed from exam",
      });
    } else {
      // Remove all students
      await removeAllStudentsFromExam(id);
      return NextResponse.json({
        success: true,
        message: "All students removed from exam",
      });
    }
  } catch (error: any) {
    console.error("Error in DELETE /api/exams/[id]/students:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to remove student(s) from exam",
      },
      { status: 500 }
    );
  }
}
