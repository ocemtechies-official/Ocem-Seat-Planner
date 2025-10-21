import { getCurrentUser, requireRole } from "@/lib/auth";
import { createExam, getExams, type CreateExamData } from "@/lib/db/exams";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as
      | "draft"
      | "scheduled"
      | "completed"
      | "cancelled"
      | null;
    const course_id = searchParams.get("course_id");
    const start_date = searchParams.get("start_date");
    const end_date = searchParams.get("end_date");

    const filters: any = {};
    if (status) filters.status = status;
    if (course_id) filters.course_id = course_id;
    if (start_date) filters.start_date = start_date;
    if (end_date) filters.end_date = end_date;

    const exams = await getExams(filters);

    return NextResponse.json({
      success: true,
      data: exams,
    });
  } catch (error: any) {
    console.error("Error in GET /api/exams:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch exams" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Verify user is admin or staff
    await requireRole(["admin", "staff"]);
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (
      !body.subject ||
      !body.course_id ||
      !body.exam_date ||
      !body.start_time ||
      !body.duration_minutes
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Validate duration
    if (body.duration_minutes <= 0 || body.duration_minutes > 300) {
      return NextResponse.json(
        {
          success: false,
          error: "Duration must be between 1 and 300 minutes",
        },
        { status: 400 }
      );
    }

    // Validate exam date is not in the past
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

    const examData: CreateExamData = {
      subject: body.subject,
      course_id: body.course_id,
      exam_date: body.exam_date,
      start_time: body.start_time,
      duration_minutes: parseInt(body.duration_minutes),
      status: body.status || "draft",
      created_by: user.id,
    };

    const exam = await createExam(examData);

    return NextResponse.json({
      success: true,
      data: exam,
    });
  } catch (error: any) {
    console.error("Error in POST /api/exams:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create exam" },
      { status: 500 }
    );
  }
}
