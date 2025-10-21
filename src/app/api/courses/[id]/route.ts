import { requireRole } from "@/lib/auth";
import {
  deleteCourse,
  getCourseById,
  updateCourse,
} from "@/lib/db/courses";
import { NextRequest, NextResponse } from "next/server";

// GET /api/courses/[id] - Get course by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const course = await getCourseById(params.id);
    return NextResponse.json({ success: true, data: course });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 404 }
    );
  }
}

// PATCH /api/courses/[id] - Update course
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(["admin"]);

    const body = await request.json();
    const course = await updateCourse(params.id, body);

    return NextResponse.json({ success: true, data: course });
  } catch (error: any) {
    if (error.message === "Unauthorized: Insufficient permissions") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[id] - Delete course
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(["admin"]);

    await deleteCourse(params.id);

    return NextResponse.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error: any) {
    if (error.message === "Unauthorized: Insufficient permissions") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
