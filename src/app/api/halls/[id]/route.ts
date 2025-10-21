import { requireRole } from "@/lib/auth";
import { deleteHall, getHallById, updateHall } from "@/lib/db/halls";
import { NextRequest, NextResponse } from "next/server";

// GET /api/halls/[id] - Get hall by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hall = await getHallById(params.id);
    return NextResponse.json({ success: true, data: hall });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 404 }
    );
  }
}

// PATCH /api/halls/[id] - Update hall
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(["admin", "staff"]);

    const body = await request.json();
    const hall = await updateHall(params.id, body);

    return NextResponse.json({ success: true, data: hall });
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

// DELETE /api/halls/[id] - Delete hall
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(["admin", "staff"]);

    // TODO: Check if hall has future exam assignments before deleting
    await deleteHall(params.id);

    return NextResponse.json({
      success: true,
      message: "Hall deleted successfully",
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
