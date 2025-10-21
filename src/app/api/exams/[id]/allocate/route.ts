import { getCurrentUser, requireRole } from "@/lib/auth";
import {
  allocateSeats,
  clearAssignments,
  saveAssignments,
  type AllocationPattern,
} from "@/lib/algorithms/seat-allocation";
import { hasAssignments } from "@/lib/db/assignments";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify user is admin or staff
    await requireRole(["admin", "staff"]);
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const examId = params.id;

    // Validate pattern
    const validPatterns = ["department", "course", "year", "random"];
    if (!body.pattern || !validPatterns.includes(body.pattern)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or missing pattern. Must be: department, course, year, or random",
        },
        { status: 400 }
      );
    }

    const pattern: AllocationPattern = body.pattern;

    // Check if exam already has assignments
    const existingAssignments = await hasAssignments(examId);
    if (existingAssignments && !body.clear_existing) {
      return NextResponse.json(
        {
          success: false,
          error: "Exam already has seat assignments. Set clear_existing: true to overwrite.",
        },
        { status: 400 }
      );
    }

    // Clear existing assignments if requested
    if (existingAssignments && body.clear_existing) {
      const clearResult = await clearAssignments(examId);
      if (!clearResult.success) {
        return NextResponse.json(
          {
            success: false,
            error: clearResult.error || "Failed to clear existing assignments",
          },
          { status: 500 }
        );
      }
    }

    // Run allocation algorithm
    const result = await allocateSeats(examId, pattern, user.id);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 400 }
      );
    }

    // Save assignments to database
    if (result.assignments && result.assignments.length > 0) {
      const saveResult = await saveAssignments(result.assignments);
      if (!saveResult.success) {
        return NextResponse.json(
          {
            success: false,
            error: saveResult.error || "Failed to save assignments",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: result.summary,
      message: `Successfully allocated ${result.summary?.assigned} seats using ${pattern} pattern`,
    });
  } catch (error: any) {
    console.error("Error in POST /api/exams/[id]/allocate:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to allocate seats" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify user is admin or staff
    await requireRole(["admin", "staff"]);

    const examId = params.id;

    // Clear all assignments
    const result = await clearAssignments(examId);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to clear assignments",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "All seat assignments cleared successfully",
    });
  } catch (error: any) {
    console.error("Error in DELETE /api/exams/[id]/allocate:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to clear assignments",
      },
      { status: 500 }
    );
  }
}
