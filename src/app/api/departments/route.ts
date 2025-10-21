import { requireRole } from "@/lib/auth";
import {
  createDepartment,
  getDepartments,
} from "@/lib/db/departments";
import { NextRequest, NextResponse } from "next/server";

// GET /api/departments - Get all departments
export async function GET() {
  try {
    const departments = await getDepartments();
    return NextResponse.json({ success: true, data: departments });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/departments - Create new department
export async function POST(request: NextRequest) {
  try {
    // Only admins can create departments
    await requireRole(["admin"]);

    const body = await request.json();
    const { name, code } = body;

    if (!name || !code) {
      return NextResponse.json(
        { success: false, error: "Name and code are required" },
        { status: 400 }
      );
    }

    const department = await createDepartment({ name, code });

    return NextResponse.json(
      { success: true, data: department },
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
