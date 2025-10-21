import { createClient } from "@/lib/supabase/server";

export type AllocationPattern =
  | "department"
  | "course"
  | "year"
  | "random";

interface Student {
  id: string;
  roll_number: string;
  name: string;
  department_id: string;
  course_id: string;
  year: number;
}

interface Seat {
  id: string;
  hall_id: string;
  seat_number: string;
  row_number: number;
  col_number: number;
  is_usable: boolean;
}

interface Hall {
  id: string;
  name: string;
  seats: Seat[];
}

interface Assignment {
  exam_id: string;
  student_id: string;
  seat_id: string;
  hall_id: string;
  assigned_by: string;
  is_manual: boolean;
}

export interface AllocationResult {
  success: boolean;
  assignments?: Assignment[];
  error?: string;
  summary?: {
    total_students: number;
    total_seats: number;
    assigned: number;
    pattern: string;
  };
}

/**
 * Main seat allocation function
 */
export async function allocateSeats(
  examId: string,
  pattern: AllocationPattern,
  userId: string
): Promise<AllocationResult> {
  const supabase = await createClient();

  try {
    // Step 1: Fetch exam students
    const { data: examStudents, error: studentsError } = await supabase
      .from("exam_students")
      .select(
        `
        student:students (
          id,
          roll_number,
          name,
          department_id,
          course_id,
          year
        )
      `
      )
      .eq("exam_id", examId);

    if (studentsError) throw studentsError;

    const students: Student[] = examStudents
      ?.map((es: any) => es.student)
      .filter(Boolean) || [];

    if (students.length === 0) {
      return {
        success: false,
        error: "No students assigned to this exam",
      };
    }

    // Step 2: Fetch exam halls and their usable seats
    const { data: hallAssignments, error: hallsError } = await supabase
      .from("exam_halls_assignments")
      .select(
        `
        hall:exam_halls (
          id,
          name,
          seats (
            id,
            hall_id,
            seat_number,
            row_number,
            col_number,
            is_usable
          )
        )
      `
      )
      .eq("exam_id", examId);

    if (hallsError) throw hallsError;

    const halls: Hall[] =
      hallAssignments
        ?.map((ha: any) => {
          if (!ha.hall) return null;
          return {
            id: ha.hall.id,
            name: ha.hall.name,
            seats: ha.hall.seats.filter((s: Seat) => s.is_usable),
          };
        })
        .filter(Boolean) || [];

    if (halls.length === 0) {
      return {
        success: false,
        error: "No halls assigned to this exam",
      };
    }

    // Calculate total available seats
    const totalSeats = halls.reduce((sum, hall) => sum + hall.seats.length, 0);

    if (totalSeats < students.length) {
      return {
        success: false,
        error: `Insufficient seating capacity. ${students.length} students need ${totalSeats} available seats`,
      };
    }

    // Step 3: Generate assignments based on pattern
    const assignments = await generateAssignments(
      students,
      halls,
      pattern,
      examId,
      userId
    );

    return {
      success: true,
      assignments,
      summary: {
        total_students: students.length,
        total_seats: totalSeats,
        assigned: assignments.length,
        pattern,
      },
    };
  } catch (error: any) {
    console.error("Error in allocateSeats:", error);
    return {
      success: false,
      error: error.message || "Failed to allocate seats",
    };
  }
}

/**
 * Generate assignments based on selected pattern
 */
function generateAssignments(
  students: Student[],
  halls: Hall[],
  pattern: AllocationPattern,
  examId: string,
  userId: string
): Assignment[] {
  switch (pattern) {
    case "department":
      return departmentAlternation(students, halls, examId, userId);
    case "course":
      return courseAlternation(students, halls, examId, userId);
    case "year":
      return yearAlternation(students, halls, examId, userId);
    case "random":
      return randomPlacement(students, halls, examId, userId);
    default:
      return randomPlacement(students, halls, examId, userId);
  }
}

/**
 * Pattern 1: Department Alternation
 * Students from different departments sit together
 */
function departmentAlternation(
  students: Student[],
  halls: Hall[],
  examId: string,
  userId: string
): Assignment[] {
  // Group students by department
  const departmentGroups: Map<string, Student[]> = new Map();
  students.forEach((student) => {
    const group = departmentGroups.get(student.department_id) || [];
    group.push(student);
    departmentGroups.set(student.department_id, group);
  });

  const groups = Array.from(departmentGroups.values());
  return alternatingAssignment(groups, halls, examId, userId);
}

/**
 * Pattern 2: Course Alternation
 * Students from different courses sit together
 */
function courseAlternation(
  students: Student[],
  halls: Hall[],
  examId: string,
  userId: string
): Assignment[] {
  // Group students by course
  const courseGroups: Map<string, Student[]> = new Map();
  students.forEach((student) => {
    const group = courseGroups.get(student.course_id) || [];
    group.push(student);
    courseGroups.set(student.course_id, group);
  });

  const groups = Array.from(courseGroups.values());
  return alternatingAssignment(groups, halls, examId, userId);
}

/**
 * Pattern 3: Year-Based Alternation
 * Students from different years sit together
 */
function yearAlternation(
  students: Student[],
  halls: Hall[],
  examId: string,
  userId: string
): Assignment[] {
  // Group students by year
  const yearGroups: Map<number, Student[]> = new Map();
  students.forEach((student) => {
    const group = yearGroups.get(student.year) || [];
    group.push(student);
    yearGroups.set(student.year, group);
  });

  const groups = Array.from(yearGroups.values());
  return alternatingAssignment(groups, halls, examId, userId);
}

/**
 * Pattern 4: Random Placement
 * Completely random seat assignment
 */
function randomPlacement(
  students: Student[],
  halls: Hall[],
  examId: string,
  userId: string
): Assignment[] {
  // Shuffle students randomly
  const shuffledStudents = [...students].sort(() => Math.random() - 0.5);

  // Collect all seats
  const allSeats: Array<{ seat: Seat; hallId: string }> = [];
  halls.forEach((hall) => {
    hall.seats.forEach((seat) => {
      allSeats.push({ seat, hallId: hall.id });
    });
  });

  // Shuffle seats
  const shuffledSeats = allSeats.sort(() => Math.random() - 0.5);

  // Sequential assignment
  const assignments: Assignment[] = [];
  for (let i = 0; i < shuffledStudents.length && i < shuffledSeats.length; i++) {
    assignments.push({
      exam_id: examId,
      student_id: shuffledStudents[i].id,
      seat_id: shuffledSeats[i].seat.id,
      hall_id: shuffledSeats[i].hallId,
      assigned_by: userId,
      is_manual: false,
    });
  }

  return assignments;
}

/**
 * Helper: Alternating assignment for group-based patterns
 * Assigns students from different groups to adjacent seats (desks)
 */
function alternatingAssignment(
  groups: Student[][],
  halls: Hall[],
  examId: string,
  userId: string
): Assignment[] {
  const assignments: Assignment[] = [];

  if (groups.length === 0) return assignments;
  if (groups.length === 1) {
    // Only one group, use sequential assignment
    return randomPlacement(groups[0], halls, examId, userId);
  }

  // Organize seats by desk (pairs of seats)
  const desks: Array<{
    seats: Array<{ seat: Seat; hallId: string }>;
    hallId: string;
  }> = [];

  halls.forEach((hall) => {
    // Group seats by row and column to create desks
    const seatsByDesk: Map<string, Seat[]> = new Map();

    hall.seats.forEach((seat) => {
      // Create desk identifier (same row, and group columns by pairs)
      const deskCol = Math.floor((seat.col_number - 1) / 2);
      const deskKey = `${seat.row_number}-${deskCol}`;

      const deskSeats = seatsByDesk.get(deskKey) || [];
      deskSeats.push(seat);
      seatsByDesk.set(deskKey, deskSeats);
    });

    // Convert to desk array
    seatsByDesk.forEach((seats) => {
      desks.push({
        seats: seats.map((seat) => ({ seat, hallId: hall.id })),
        hallId: hall.id,
      });
    });
  });

  // Create rotating pointers for each group
  const groupPointers = groups.map(() => 0);
  let currentGroupIndex = 0;

  // Assign students to desks with alternation
  for (const desk of desks) {
    for (const seatInfo of desk.seats) {
      // Get student from current group
      const currentGroup = groups[currentGroupIndex];
      const currentPointer = groupPointers[currentGroupIndex];

      if (currentPointer < currentGroup.length) {
        const student = currentGroup[currentPointer];
        assignments.push({
          exam_id: examId,
          student_id: student.id,
          seat_id: seatInfo.seat.id,
          hall_id: seatInfo.hallId,
          assigned_by: userId,
          is_manual: false,
        });

        // Move pointer forward
        groupPointers[currentGroupIndex]++;
      }

      // Rotate to next group
      currentGroupIndex = (currentGroupIndex + 1) % groups.length;

      // Stop if all students assigned
      if (assignments.length >= groups.flat().length) {
        break;
      }
    }

    if (assignments.length >= groups.flat().length) {
      break;
    }
  }

  return assignments;
}

/**
 * Save assignments to database
 */
export async function saveAssignments(
  assignments: Assignment[]
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("seat_assignments")
      .insert(
        assignments.map((a) => ({
          exam_id: a.exam_id,
          student_id: a.student_id,
          seat_id: a.seat_id,
          hall_id: a.hall_id,
          assigned_by: a.assigned_by,
          is_manual: a.is_manual,
        }))
      );

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Error saving assignments:", error);
    return {
      success: false,
      error: error.message || "Failed to save assignments",
    };
  }
}

/**
 * Clear all existing assignments for an exam
 */
export async function clearAssignments(
  examId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("seat_assignments")
      .delete()
      .eq("exam_id", examId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Error clearing assignments:", error);
    return {
      success: false,
      error: error.message || "Failed to clear assignments",
    };
  }
}
