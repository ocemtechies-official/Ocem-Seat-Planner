import { requireRole } from "@/lib/auth";
import { createCourse, getCourses } from "@/lib/db/courses";
import { NextRequest, NextResponse } from "next/server";

// GET /api/courses - Get all courses
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const departmentId = searchParams.get("department_id");

    const courses = await getCourses(departmentId || undefined);
    return NextResponse.json({ success: true, data: courses });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create new course
export async function POST(request: NextRequest) {
  try {
    await requireRole(["admin"]);

    const body = await request.json();
    const { name, code, department_id, year, semester } = body;

    if (!name || !code || !department_id || !year || !semester) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, code, department_id, year, and semester are required",
        },
        { status: 400 }
      );
    }

    const course = await createCourse({
      name,
      code,
      department_id,
      year,
      semester,
    });

    return NextResponse.json(
      { success: true, data: course },
      { status: 201 }
    );
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
