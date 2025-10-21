import { requireRole } from "@/lib/auth";
import {
  deleteStudent,
  getStudentById,
  updateStudent,
} from "@/lib/db/students";
import { NextRequest, NextResponse } from "next/server";

// GET /api/students/[id] - Get student by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const student = await getStudentById(id);
    return NextResponse.json({ success: true, data: student });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 404 }
    );
  }
}

// PATCH /api/students/[id] - Update student
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["admin", "staff"]);

    const body = await request.json();
    const { id } = await params;
    const student = await updateStudent(id, body);

    return NextResponse.json({ success: true, data: student });
  } catch (error: any) {
    if (error.message === "Unauthorized: Insufficient permissions") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 403 }
      );
    }

    if (error.code === "23505") {
      return NextResponse.json(
        { success: false, error: "Roll number already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/students/[id] - Delete student
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["admin", "staff"]);

    const { id } = await params;
    await deleteStudent(id);

    return NextResponse.json({
      success: true,
      message: "Student deleted successfully",
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
