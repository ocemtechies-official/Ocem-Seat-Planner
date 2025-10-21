import { requireRole } from "@/lib/auth";
import { getUsers } from "@/lib/db/users";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Only admin can access
    await requireRole(["admin"]);

    const users = await getUsers();

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    console.error("Error in GET /api/admin/users:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Only admin can create users
    await requireRole(["admin"]);

    const body = await request.json();

    // Validate required fields
    if (!body.email || !body.password || !body.role) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: email, password, role",
        },
        { status: 400 }
      );
    }

    // Validate password length
    if (body.password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must be at least 8 characters",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
    });

    if (authError) {
      console.error("Error creating auth user:", authError);
      return NextResponse.json(
        {
          success: false,
          error: authError.message || "Failed to create user",
        },
        { status: 500 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { success: false, error: "Failed to create user" },
        { status: 500 }
      );
    }

    // Create user record
    const { error: userError } = await supabase.from("users").insert({
      id: authData.user.id,
      email: body.email,
      role: body.role,
    });

    if (userError) {
      console.error("Error creating user record:", userError);
      // Try to clean up auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        {
          success: false,
          error: userError.message || "Failed to create user record",
        },
        { status: 500 }
      );
    }

    // If staff, set permissions
    if (body.role === "staff" && body.department_ids && body.department_ids.length > 0) {
      const permissions = body.department_ids.map((deptId: string) => ({
        user_id: authData.user.id,
        department_id: deptId,
      }));

      const { error: permError } = await supabase
        .from("staff_permissions")
        .insert(permissions);

      if (permError) {
        console.error("Error setting staff permissions:", permError);
        // User is created but permissions failed - still return success
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: authData.user.id,
        email: body.email,
        role: body.role,
      },
    });
  } catch (error: any) {
    console.error("Error in POST /api/admin/users:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create user" },
      { status: 500 }
    );
  }
}
