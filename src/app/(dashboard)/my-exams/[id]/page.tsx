"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, MapPin, FileDown, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface ExamDetails {
  exam: {
    id: string;
    subject: string;
    exam_date: string;
    start_time: string;
    duration_minutes: number;
    status: string;
    course: {
      code: string;
      name: string;
      department: {
        name: string;
        code: string;
      };
    };
  };
  assignment: {
    hall: {
      name: string;
    };
    seat: {
      seat_number: string;
    };
  } | null;
  student: {
    id: string;
    roll_number: string;
    name: string;
  };
}

export default function MyExamDetailsPage() {
  const params = useParams();
  const { user } = useAuth();
  const examId = params.id as string;

  const [examDetails, setExamDetails] = useState<ExamDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchExamDetails = async () => {
      if (!user) return;

      try {
        // Get student record
        const studentRes = await fetch(`/api/students?user_id=${user.id}`);
        const studentResult = await studentRes.json();

        if (studentResult.success && studentResult.data.length > 0) {
          const student = studentResult.data[0];

          // Get exam details
          const examRes = await fetch(`/api/exams/${examId}`);
          const examResult = await examRes.json();

          if (examResult.success) {
            // Get seat assignment
            const assignmentRes = await fetch(
              `/api/exams/${examId}/assignments`
            );
            const assignmentResult = await assignmentRes.json();

            const myAssignment = assignmentResult.success
              ? assignmentResult.data.find(
                  (a: any) => a.student.id === student.id
                )
              : null;

            setExamDetails({
              exam: examResult.data,
              assignment: myAssignment || null,
              student: {
                id: student.id,
                roll_number: student.roll_number,
                name: student.name,
              },
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch exam details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetails();
  }, [examId, user]);

  const handleDownloadHallTicket = async () => {
    if (!examDetails?.student.id) return;

    setDownloading(true);
    try {
      const response = await fetch(
        `/api/exams/${examId}/hall-tickets?student_id=${examDetails.student.id}`
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `hall-ticket-${examDetails.student.roll_number}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Failed to download hall ticket");
      }
    } catch (error) {
      alert("An error occurred while downloading");
    } finally {
      setDownloading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const calculateEndTime = (startTime: string, durationMinutes: number) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    const ampm = endHours >= 12 ? "PM" : "AM";
    const displayHour = endHours % 12 || 12;
    return `${displayHour}:${endMinutes.toString().padStart(2, "0")} ${ampm}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "default";
      case "completed":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (loading) {
    return <div>Loading exam details...</div>;
  }

  if (!examDetails) {
    return <div>Exam not found</div>;
  }

  const { exam, assignment, student } = examDetails;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/my-exams">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Exams
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{exam.subject}</h1>
          <p className="text-muted-foreground mt-2">
            {exam.course.code} - {exam.course.name}
          </p>
        </div>
        <Badge variant={getStatusColor(exam.status)}>{exam.status}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Exam Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(exam.exam_date)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Time</p>
                <p className="text-sm text-muted-foreground">
                  {formatTime(exam.start_time)} -{" "}
                  {calculateEndTime(exam.start_time, exam.duration_minutes)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm text-muted-foreground">
                  {exam.duration_minutes} minutes
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-1">Department</p>
              <p className="text-sm text-muted-foreground">
                {exam.course.department.name} ({exam.course.department.code})
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Roll Number</p>
              <p className="font-medium">{student.roll_number}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{student.name}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {assignment ? (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Your Seat Assignment
            </CardTitle>
            <CardDescription className="text-green-700">
              Please arrive at the exam hall 15 minutes before the start time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-green-700 mb-1">Exam Hall</p>
                <p className="text-2xl font-bold text-green-900">
                  {assignment.hall.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-green-700 mb-1">Seat Number</p>
                <p className="text-2xl font-bold text-green-900">
                  {assignment.seat.seat_number}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Button
                onClick={handleDownloadHallTicket}
                disabled={downloading}
                className="w-full md:w-auto"
              >
                {downloading ? (
                  <>Generating...</>
                ) : (
                  <>
                    <FileDown className="mr-2 h-4 w-4" />
                    Download Hall Ticket
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-900 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Seat Not Assigned Yet
            </CardTitle>
            <CardDescription className="text-orange-700">
              Your seat will be assigned soon. Check back later for your seating assignment.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Important Instructions</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>• Arrive at least 15 minutes before the exam start time</p>
          <p>• Bring a valid ID card for verification</p>
          <p>• Bring your hall ticket (printed or digital)</p>
          <p>• No electronic devices (phones, smartwatches, etc.) are allowed</p>
          <p>• Bring your own stationery and writing materials</p>
          <p>• You must sit at your assigned seat number</p>
          <p>• Contact the invigilator for any issues or queries</p>
        </CardContent>
      </Card>
    </div>
  );
}
