import { requireRole } from "@/lib/auth";
import {
  deleteExam,
  getExamById,
  updateExam,
  type UpdateExamData,
} from "@/lib/db/exams";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify user is authenticated
    await requireRole(["admin", "staff", "supervisor", "student"]);

    const { id } = await params;
    const exam = await getExamById(id);

    return NextResponse.json({
      success: true,
      data: exam,
    });
  } catch (error: any) {
    console.error("Error in GET /api/exams/[id]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch exam" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify user is admin or staff
    await requireRole(["admin", "staff"]);

    const body = await request.json();

    // Validate duration if provided
    if (body.duration_minutes !== undefined) {
      if (body.duration_minutes <= 0 || body.duration_minutes > 300) {
        return NextResponse.json(
          {
            success: false,
            error: "Duration must be between 1 and 300 minutes",
          },
          { status: 400 }
        );
      }
    }

    // Validate exam date if provided
    if (body.exam_date) {
      const examDate = new Date(body.exam_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (examDate < today) {
        return NextResponse.json(
          {
            success: false,
            error: "Exam date cannot be in the past",
          },
          { status: 400 }
        );
      }
    }

    const updateData: UpdateExamData = {};
    if (body.subject !== undefined) updateData.subject = body.subject;
    if (body.course_id !== undefined) updateData.course_id = body.course_id;
    if (body.exam_date !== undefined) updateData.exam_date = body.exam_date;
    if (body.start_time !== undefined) updateData.start_time = body.start_time;
    if (body.duration_minutes !== undefined)
      updateData.duration_minutes = parseInt(body.duration_minutes);
    if (body.status !== undefined) updateData.status = body.status;

    const { id } = await params;
    const exam = await updateExam(id, updateData);

    return NextResponse.json({
      success: true,
      data: exam,
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/exams/[id]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update exam" },
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

    const { id } = await params;
    await deleteExam(id);

    return NextResponse.json({
      success: true,
      message: "Exam deleted successfully",
    });
  } catch (error: any) {
    console.error("Error in DELETE /api/exams/[id]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete exam" },
      { status: 500 }
    );
  }
}
