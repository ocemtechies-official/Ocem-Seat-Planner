import { requireRole } from "@/lib/auth";
import { getUserById, updateUserRole, deleteUser, setStaffPermissions } from "@/lib/db/users";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(["admin"]);

    const user = await getUserById(params.id);

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error("Error in GET /api/admin/users/[id]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(["admin"]);

    const body = await request.json();
    const userId = params.id;

    // Update role if provided
    if (body.role) {
      await updateUserRole(userId, body.role);
    }

    // Update staff permissions if provided
    if (body.role === "staff" && body.department_ids !== undefined) {
      await setStaffPermissions(userId, body.department_ids);
    }

    const user = await getUserById(userId);

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/admin/users/[id]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(["admin"]);

    const userId = params.id;
    const supabase = await createClient();

    // Delete from users table (will cascade)
    await deleteUser(userId);

    // Delete from auth
    await supabase.auth.admin.deleteUser(userId);

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    console.error("Error in DELETE /api/admin/users/[id]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}
