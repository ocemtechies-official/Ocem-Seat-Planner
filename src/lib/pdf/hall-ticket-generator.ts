import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export interface HallTicketData {
  student: {
    roll_number: string;
    name: string;
    email?: string;
    department: {
      name: string;
      code: string;
    };
    course: {
      name: string;
      code: string;
    };
  };
  exam: {
    subject: string;
    exam_date: string;
    start_time: string;
    duration_minutes: number;
  };
  assignment: {
    hall: {
      name: string;
    };
    seat: {
      seat_number: string;
    };
  };
}

/**
 * Generate a single hall ticket PDF
 */
export async function generateHallTicket(
  data: HallTicketData
): Promise<Blob> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  // Add border
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Header - Institution Name
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("EXAMINATION HALL TICKET", pageWidth / 2, 25, {
    align: "center",
  });

  // Divider line
  doc.setLineWidth(0.3);
  doc.line(margin, 32, pageWidth - margin, 32);

  let currentY = 45;

  // Student Information Section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("STUDENT INFORMATION", margin, currentY);
  currentY += 8;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  // Roll Number
  doc.setFont("helvetica", "bold");
  doc.text("Roll Number:", margin, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(data.student.roll_number, margin + 40, currentY);
  currentY += 7;

  // Name
  doc.setFont("helvetica", "bold");
  doc.text("Name:", margin, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(data.student.name, margin + 40, currentY);
  currentY += 7;

  // Department
  doc.setFont("helvetica", "bold");
  doc.text("Department:", margin, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(
    `${data.student.department.name} (${data.student.department.code})`,
    margin + 40,
    currentY
  );
  currentY += 7;

  // Course
  doc.setFont("helvetica", "bold");
  doc.text("Course:", margin, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(
    `${data.student.course.code} - ${data.student.course.name}`,
    margin + 40,
    currentY
  );
  currentY += 12;

  // Exam Details Section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("EXAM DETAILS", margin, currentY);
  currentY += 8;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  // Subject
  doc.setFont("helvetica", "bold");
  doc.text("Subject:", margin, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(data.exam.subject, margin + 40, currentY);
  currentY += 7;

  // Date
  doc.setFont("helvetica", "bold");
  doc.text("Date:", margin, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(formatDate(data.exam.exam_date), margin + 40, currentY);
  currentY += 7;

  // Time
  doc.setFont("helvetica", "bold");
  doc.text("Time:", margin, currentY);
  doc.setFont("helvetica", "normal");
  const endTime = calculateEndTime(
    data.exam.start_time,
    data.exam.duration_minutes
  );
  doc.text(
    `${formatTime(data.exam.start_time)} - ${endTime}`,
    margin + 40,
    currentY
  );
  currentY += 7;

  // Duration
  doc.setFont("helvetica", "bold");
  doc.text("Duration:", margin, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.exam.duration_minutes} minutes`, margin + 40, currentY);
  currentY += 12;

  // Seating Assignment Section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("SEATING ASSIGNMENT", margin, currentY);
  currentY += 8;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  // Hall
  doc.setFont("helvetica", "bold");
  doc.text("Hall:", margin, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(data.assignment.hall.name, margin + 40, currentY);
  currentY += 7;

  // Seat Number - Highlighted
  doc.setFont("helvetica", "bold");
  doc.text("Seat Number:", margin, currentY);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(data.assignment.seat.seat_number, margin + 40, currentY);
  currentY += 15;

  // Instructions Section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("INSTRUCTIONS", margin, currentY);
  currentY += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const instructions = [
    "1. Arrive at least 15 minutes before the exam start time",
    "2. Bring a valid ID card for verification",
    "3. No electronic devices (phones, smartwatches, etc.) are allowed",
    "4. Bring your own stationery and writing materials",
    "5. You must sit at your assigned seat number",
    "6. Contact the invigilator for any issues or queries",
    "7. This hall ticket must be presented to enter the exam hall",
  ];

  instructions.forEach((instruction) => {
    doc.text(instruction, margin, currentY);
    currentY += 6;
  });

  currentY += 10;

  // Generate QR Code
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(data.student.roll_number, {
      width: 150,
      margin: 1,
    });

    // Add QR code
    const qrSize = 35;
    const qrX = pageWidth / 2 - qrSize / 2;
    doc.addImage(qrCodeDataUrl, "PNG", qrX, currentY, qrSize, qrSize);
    currentY += qrSize + 5;

    // QR Code label
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("Scan for verification", pageWidth / 2, currentY, {
      align: "center",
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
  }

  // Footer
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text(
    "Generated with Claude Code",
    pageWidth / 2,
    pageHeight - 15,
    { align: "center" }
  );

  // Convert to Blob
  return doc.output("blob");
}

/**
 * Generate multiple hall tickets and return as array of Blobs
 */
export async function generateMultipleHallTickets(
  tickets: HallTicketData[]
): Promise<{ rollNumber: string; blob: Blob }[]> {
  const results: { rollNumber: string; blob: Blob }[] = [];

  for (const ticket of tickets) {
    const blob = await generateHallTicket(ticket);
    results.push({
      rollNumber: ticket.student.roll_number,
      blob,
    });
  }

  return results;
}

/**
 * Helper: Format date
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Helper: Format time
 */
function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

/**
 * Helper: Calculate end time
 */
function calculateEndTime(
  startTime: string,
  durationMinutes: number
): string {
  const [hours, minutes] = startTime.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  const ampm = endHours >= 12 ? "PM" : "AM";
  const displayHour = endHours % 12 || 12;
  return `${displayHour}:${endMinutes.toString().padStart(2, "0")} ${ampm}`;
}
