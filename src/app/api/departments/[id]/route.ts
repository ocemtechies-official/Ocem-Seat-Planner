import { requireRole } from "@/lib/auth";
import {
  deleteDepartment,
  getDepartmentById,
  updateDepartment,
} from "@/lib/db/departments";
import { NextRequest, NextResponse } from "next/server";

// GET /api/departments/[id] - Get department by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const department = await getDepartmentById(id);
    return NextResponse.json({ success: true, data: department });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 404 }
    );
  }
}

// PATCH /api/departments/[id] - Update department
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["admin"]);

    const body = await request.json();
    const { id } = await params;
    const department = await updateDepartment(id, body);

    return NextResponse.json({ success: true, data: department });
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

// DELETE /api/departments/[id] - Delete department
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["admin"]);

    const { id } = await params;
    await deleteDepartment(id);

    return NextResponse.json({
      success: true,
      message: "Department deleted successfully",
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
