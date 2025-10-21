import { getCurrentUser, requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();

    // Get counts based on role
    if (user.role === "admin" || user.role === "staff") {
      // Total students
      const { count: studentCount } = await supabase
        .from("students")
        .select("*", { count: "exact", head: true });

      // Total exams
      const { count: examCount } = await supabase
        .from("exams")
        .select("*", { count: "exact", head: true });

      // Total halls
      const { count: hallCount } = await supabase
        .from("exam_halls")
        .select("*", { count: "exact", head: true });

      // Upcoming exams (status = scheduled, date >= today)
      const today = new Date().toISOString().split("T")[0];
      const { count: upcomingCount } = await supabase
        .from("exams")
        .select("*", { count: "exact", head: true })
        .eq("status", "scheduled")
        .gte("exam_date", today);

      // Recent exams (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const { data: recentExams } = await supabase
        .from("exams")
        .select(
          `
          id,
          subject,
          exam_date,
          start_time,
          status,
          course:courses (
            code,
            name
          )
        `
        )
        .gte("created_at", sevenDaysAgo.toISOString())
        .order("created_at", { ascending: false })
        .limit(5);

      // Get upcoming exams details
      const { data: upcomingExams } = await supabase
        .from("exams")
        .select(
          `
          id,
          subject,
          exam_date,
          start_time,
          duration_minutes,
          status,
          course:courses (
            code,
            name
          )
        `
        )
        .eq("status", "scheduled")
        .gte("exam_date", today)
        .order("exam_date", { ascending: true })
        .limit(5);

      return NextResponse.json({
        success: true,
        data: {
          stats: {
            students: studentCount || 0,
            exams: examCount || 0,
            halls: hallCount || 0,
            upcoming: upcomingCount || 0,
          },
          recentExams: recentExams || [],
          upcomingExams: upcomingExams || [],
        },
      });
    } else if (user.role === "student") {
      // Get student record
      const { data: studentData } = await supabase
        .from("students")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!studentData) {
        return NextResponse.json({
          success: true,
          data: {
            stats: { myExams: 0, upcoming: 0 },
            upcomingExams: [],
          },
        });
      }

      // Count my exams
      const { count: myExamsCount } = await supabase
        .from("exam_students")
        .select("*", { count: "exact", head: true })
        .eq("student_id", (studentData as any).id);

      // Get upcoming exams for this student
      const today = new Date().toISOString().split("T")[0];
      const { data: examStudents } = await supabase
        .from("exam_students")
        .select(
          `
          exam:exams (
            id,
            subject,
            exam_date,
            start_time,
            duration_minutes,
            status,
            course:courses (
              code,
              name
            )
          )
        `
        )
        .eq("student_id", (studentData as any).id);

      const upcomingExams = (examStudents || [])
        .map((es: any) => es.exam)
        .filter(
          (exam: any) =>
            exam.status === "scheduled" && exam.exam_date >= today
        )
        .sort(
          (a: any, b: any) =>
            new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime()
        )
        .slice(0, 5);

      return NextResponse.json({
        success: true,
        data: {
          stats: {
            myExams: myExamsCount || 0,
            upcoming: upcomingExams.length,
          },
          upcomingExams,
        },
      });
    } else {
      // Supervisor - just show upcoming exams
      const today = new Date().toISOString().split("T")[0];
      const { count: upcomingCount } = await supabase
        .from("exams")
        .select("*", { count: "exact", head: true })
        .eq("status", "scheduled")
        .gte("exam_date", today);

      const { data: upcomingExams } = await supabase
        .from("exams")
        .select(
          `
          id,
          subject,
          exam_date,
          start_time,
          duration_minutes,
          status,
          course:courses (
            code,
            name
          )
        `
        )
        .eq("status", "scheduled")
        .gte("exam_date", today)
        .order("exam_date", { ascending: true })
        .limit(5);

      return NextResponse.json({
        success: true,
        data: {
          stats: {
            upcoming: upcomingCount || 0,
          },
          upcomingExams: upcomingExams || [],
        },
      });
    }
  } catch (error: any) {
    console.error("Error in GET /api/dashboard/stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch dashboard stats",
      },
      { status: 500 }
    );
  }
}
