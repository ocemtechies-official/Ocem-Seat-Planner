import { requireRole } from "@/lib/auth";
import { getDepartments } from "@/lib/db/departments";
import { getCourses } from "@/lib/db/courses";
import {
  getStudentByRollNumber,
  createStudent,
  updateStudent,
} from "@/lib/db/students";
import type { StudentImportRow, StudentImportResult } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";

// POST /api/students/import - Import students from parsed data
export async function POST(request: NextRequest) {
  try {
    await requireRole(["admin", "staff"]);

    const body = await request.json();
    const { students, updateExisting } = body as {
      students: StudentImportRow[];
      updateExisting: boolean;
    };

    if (!Array.isArray(students) || students.length === 0) {
      return NextResponse.json(
        { success: false, error: "No student data provided" },
        { status: 400 }
      );
    }

    // Fetch departments and courses for validation
    const departments = await getDepartments();
    const courses = await getCourses();

    const departmentMap = new Map(
      (departments as any[]).map((d) => [d.code.toLowerCase(), d.id])
    );
    const courseMap = new Map(
      (courses as any[]).map((c) => [c.code.toLowerCase(), c.id])
    );

    const result: StudentImportResult = {
      success: true,
      imported: 0,
      updated: 0,
      skipped: 0,
      failed: 0,
      errors: [],
    };

    // Process each student
    for (let i = 0; i < students.length; i++) {
      const row = students[i];
      const rowNumber = i + 1;

      try {
        // Validation
        if (!row.roll_number || !row.name) {
          result.errors.push({
            row: rowNumber,
            error: "Roll number and name are required",
          });
          result.failed++;
          continue;
        }

        if (!row.department_code || !row.course_code) {
          result.errors.push({
            row: rowNumber,
            error: "Department code and course code are required",
          });
          result.failed++;
          continue;
        }

        if (!row.year || row.year < 1 || row.year > 4) {
          result.errors.push({
            row: rowNumber,
            error: "Year must be between 1 and 4",
          });
          result.failed++;
          continue;
        }

        // Validate department code
        const departmentId = departmentMap.get(
          row.department_code.toLowerCase()
        );
        if (!departmentId) {
          result.errors.push({
            row: rowNumber,
            error: `Invalid department code: ${row.department_code}`,
          });
          result.failed++;
          continue;
        }

        // Validate course code
        const courseId = courseMap.get(row.course_code.toLowerCase());
        if (!courseId) {
          result.errors.push({
            row: rowNumber,
            error: `Invalid course code: ${row.course_code}`,
          });
          result.failed++;
          continue;
        }

        // Check if student already exists
        const existingStudent = await getStudentByRollNumber(row.roll_number);

        if (existingStudent) {
          if (updateExisting) {
            // Update existing student
            await updateStudent((existingStudent as any).id, {
              name: row.name,
              email: row.email,
              department_id: departmentId,
              course_id: courseId,
              year: row.year,
            });
            result.updated++;
          } else {
            // Skip if not updating
            result.errors.push({
              row: rowNumber,
              error: `Student with roll number ${row.roll_number} already exists`,
            });
            result.skipped++;
          }
        } else {
          // Create new student
          await createStudent({
            roll_number: row.roll_number,
            name: row.name,
            email: row.email,
            department_id: departmentId,
            course_id: courseId,
            year: row.year,
          });
          result.imported++;
        }
      } catch (error: any) {
        result.errors.push({
          row: rowNumber,
          error: error.message || "Unknown error",
        });
        result.failed++;
      }
    }

    return NextResponse.json(result);
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
