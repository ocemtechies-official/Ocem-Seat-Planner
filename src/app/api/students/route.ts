import { requireRole } from "@/lib/auth";
import { createStudent, getStudents } from "@/lib/db/students";
import type { StudentFilters } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";

// GET /api/students - Get all students with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: StudentFilters = {
      department_id: searchParams.get("department_id") || undefined,
      course_id: searchParams.get("course_id") || undefined,
      year: searchParams.get("year")
        ? parseInt(searchParams.get("year")!)
        : undefined,
      has_user_account: searchParams.get("has_user_account")
        ? searchParams.get("has_user_account") === "true"
        : undefined,
      search: searchParams.get("search") || undefined,
    };

    const students = await getStudents(filters);
    return NextResponse.json({ success: true, data: students });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/students - Create new student
export async function POST(request: NextRequest) {
  try {
    await requireRole(["admin", "staff"]);

    const body = await request.json();
    const { roll_number, name, email, department_id, course_id, year } = body;

    if (!roll_number || !name || !department_id || !course_id || !year) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Roll number, name, department, course, and year are required",
        },
        { status: 400 }
      );
    }

    const student = await createStudent({
      roll_number,
      name,
      email: email || undefined,
      department_id,
      course_id,
      year,
    });

    return NextResponse.json(
      { success: true, data: student },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message === "Unauthorized: Insufficient permissions") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 403 }
      );
    }

    // Check for unique constraint violation (duplicate roll number)
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
