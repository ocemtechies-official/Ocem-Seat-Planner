import { requireRole } from "@/lib/auth";
import {
  assignHallsToExam,
  getExamHalls,
  removeHallFromExam,
  removeAllHallsFromExam,
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
    const halls = await getExamHalls(id);

    return NextResponse.json({
      success: true,
      data: halls,
    });
  } catch (error: any) {
    console.error("Error in GET /api/exams/[id]/halls:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch exam halls" },
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

    if (!body.hall_ids || !Array.isArray(body.hall_ids)) {
      return NextResponse.json(
        {
          success: false,
          error: "hall_ids must be an array",
        },
        { status: 400 }
      );
    }

    if (body.hall_ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "At least one hall ID is required",
        },
        { status: 400 }
      );
    }

    const { id } = await params;
    const assignments = await assignHallsToExam(id, body.hall_ids);

    return NextResponse.json({
      success: true,
      data: assignments,
      message: `${assignments.length} hall(s) assigned to exam`,
    });
  } catch (error: any) {
    console.error("Error in POST /api/exams/[id]/halls:", error);

    // Handle duplicate assignment error
    if (error.code === "23505") {
      return NextResponse.json(
        {
          success: false,
          error: "One or more halls are already assigned to this exam",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to assign halls to exam",
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
    const hallId = searchParams.get("hall_id");

    const { id } = await params;

    if (hallId) {
      // Remove specific hall
      await removeHallFromExam(id, hallId);
      return NextResponse.json({
        success: true,
        message: "Hall removed from exam",
      });
    } else {
      // Remove all halls
      await removeAllHallsFromExam(id);
      return NextResponse.json({
        success: true,
        message: "All halls removed from exam",
      });
    }
  } catch (error: any) {
    console.error("Error in DELETE /api/exams/[id]/halls:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to remove hall(s) from exam",
      },
      { status: 500 }
    );
  }
}
