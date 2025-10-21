import { requireRole } from "@/lib/auth";
import { getExamById } from "@/lib/db/exams";
import { getExamAssignments, getStudentAssignment } from "@/lib/db/assignments";
import {
  generateHallTicket,
  generateMultipleHallTickets,
  type HallTicketData,
} from "@/lib/pdf/hall-ticket-generator";
import JSZip from "jszip";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify user is authenticated
    await requireRole(["admin", "staff", "supervisor"]);

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("student_id");
    const format = searchParams.get("format") || "pdf"; // 'pdf' or 'zip'

    const examId = params.id;

    // Fetch exam details
    const exam = await getExamById(examId);
    if (!exam) {
      return NextResponse.json(
        { success: false, error: "Exam not found" },
        { status: 404 }
      );
    }

    if (studentId) {
      // Generate single hall ticket
      const assignment = await getStudentAssignment(examId, studentId);

      if (!assignment) {
        return NextResponse.json(
          { success: false, error: "No seat assignment found for this student" },
          { status: 404 }
        );
      }

      const ticketData: HallTicketData = {
        student: {
          roll_number: assignment.student.roll_number,
          name: assignment.student.name,
          email: assignment.student.email || undefined,
          department: assignment.student.department,
          course: assignment.student.course,
        },
        exam: {
          subject: exam.subject,
          exam_date: exam.exam_date,
          start_time: exam.start_time,
          duration_minutes: exam.duration_minutes,
        },
        assignment: {
          hall: assignment.hall,
          seat: assignment.seat,
        },
      };

      const pdfBlob = await generateHallTicket(ticketData);

      // Convert Blob to Buffer for Next.js response
      const buffer = Buffer.from(await pdfBlob.arrayBuffer());

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="hall-ticket-${assignment.student.roll_number}.pdf"`,
        },
      });
    } else if (format === "zip") {
      // Generate all hall tickets as ZIP
      const assignments = await getExamAssignments(examId);

      if (assignments.length === 0) {
        return NextResponse.json(
          { success: false, error: "No seat assignments found for this exam" },
          { status: 404 }
        );
      }

      // Prepare ticket data for all students
      const ticketsData: HallTicketData[] = assignments.map((assignment) => ({
        student: {
          roll_number: assignment.student.roll_number,
          name: assignment.student.name,
          email: assignment.student.email || undefined,
          department: assignment.student.department,
          course: assignment.student.course,
        },
        exam: {
          subject: exam.subject,
          exam_date: exam.exam_date,
          start_time: exam.start_time,
          duration_minutes: exam.duration_minutes,
        },
        assignment: {
          hall: assignment.hall,
          seat: assignment.seat,
        },
      }));

      // Generate all PDFs
      const pdfResults = await generateMultipleHallTickets(ticketsData);

      // Create ZIP file
      const zip = new JSZip();
      pdfResults.forEach((result) => {
        zip.file(`hall-ticket-${result.rollNumber}.pdf`, result.blob);
      });

      const zipBlob = await zip.generateAsync({ type: "nodebuffer" });

      return new NextResponse(zipBlob, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="hall-tickets-${exam.course.code}-${exam.exam_date}.zip"`,
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request. Provide student_id or format=zip",
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error in GET /api/exams/[id]/hall-tickets:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate hall tickets",
      },
      { status: 500 }
    );
  }
}
