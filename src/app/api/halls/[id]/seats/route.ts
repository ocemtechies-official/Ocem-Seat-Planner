import { requireRole } from "@/lib/auth";
import { getSeatsByHallId, bulkUpdateSeats } from "@/lib/db/seats";
import { NextRequest, NextResponse } from "next/server";

// GET /api/halls/[id]/seats - Get all seats for a hall
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const seats = await getSeatsByHallId(params.id);
    return NextResponse.json({ success: true, data: seats });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/halls/[id]/seats - Bulk update seats (toggle usable/unusable)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(["admin", "staff"]);

    const body = await request.json();
    const { updates } = body as {
      updates: Array<{ id: string; is_usable: boolean }>;
    };

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { success: false, error: "Invalid updates format" },
        { status: 400 }
      );
    }

    const result = await bulkUpdateSeats(updates);

    return NextResponse.json({ success: true, data: result });
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
