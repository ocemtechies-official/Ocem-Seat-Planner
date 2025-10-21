import { requireRole } from "@/lib/auth";
import { createHall, getHalls } from "@/lib/db/halls";
import { createSeats, generateSeats } from "@/lib/db/seats";
import { NextRequest, NextResponse } from "next/server";

// GET /api/halls - Get all exam halls
export async function GET() {
  try {
    const halls = await getHalls();
    return NextResponse.json({ success: true, data: halls });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/halls - Create new exam hall with seats
export async function POST(request: NextRequest) {
  try {
    await requireRole(["admin", "staff"]);

    const body = await request.json();
    const { name, rows, columns, seats_per_desk = 2 } = body;

    if (!name || !rows || !columns) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, rows, and columns are required",
        },
        { status: 400 }
      );
    }

    const totalSeats = rows * columns * seats_per_desk;

    // Create the hall
    const hall = await createHall({
      name,
      total_seats: totalSeats,
      rows,
      columns,
      layout_config: {
        type: "grid",
        rows,
        columns,
        seats_per_desk,
        unusable_seats: [],
      },
    });

    // Generate and create seats
    const seatData = generateSeats(hall.id, rows, columns, seats_per_desk);
    await createSeats(seatData);

    return NextResponse.json(
      { success: true, data: hall },
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
