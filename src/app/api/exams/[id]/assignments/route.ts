import { requireRole } from "@/lib/auth";
import { getExamAssignments } from "@/lib/db/assignments";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify user is authenticated
    await requireRole(["admin", "staff", "supervisor"]);

    const { id } = await params;
    const assignments = await getExamAssignments(id);

    return NextResponse.json({
      success: true,
      data: assignments,
    });
  } catch (error: any) {
    console.error("Error in GET /api/exams/[id]/assignments:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch assignments",
      },
      { status: 500 }
    );
  }
}
