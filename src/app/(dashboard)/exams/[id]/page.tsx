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
import { ArrowLeft, Calendar, Clock, Users, Building2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Exam {
  id: string;
  subject: string;
  exam_date: string;
  start_time: string;
  duration_minutes: number;
  status: string;
  course: {
    id: string;
    name: string;
    code: string;
    department: {
      name: string;
      code: string;
    };
  };
}

interface Student {
  id: string;
  student: {
    id: string;
    roll_number: string;
    name: string;
    department: { name: string };
    course: { name: string };
  };
}

interface Hall {
  id: string;
  hall: {
    id: string;
    name: string;
    total_seats: number;
  };
}

export default function ExamDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;

  const [exam, setExam] = useState<Exam | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const [examRes, studentsRes, hallsRes] = await Promise.all([
          fetch(`/api/exams/${examId}`),
          fetch(`/api/exams/${examId}/students`),
          fetch(`/api/exams/${examId}/halls`),
        ]);

        const examResult = await examRes.json();
        const studentsResult = await studentsRes.json();
        const hallsResult = await hallsRes.json();

        if (examResult.success) setExam(examResult.data);
        if (studentsResult.success) setStudents(studentsResult.data);
        if (hallsResult.success) setHalls(hallsResult.data);
      } catch (error) {
        console.error("Failed to fetch exam data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExamData();
  }, [examId]);

  const handleDeleteExam = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this exam? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/exams/${examId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/exams");
      } else {
        alert("Failed to delete exam");
      }
    } catch (error) {
      alert("An error occurred while deleting the exam");
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

  const getTotalHallCapacity = () => {
    return halls.reduce((sum, h) => sum + h.hall.total_seats, 0);
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

  if (!exam) {
    return <div>Exam not found</div>;
  }

  const totalStudents = students.length;
  const totalCapacity = getTotalHallCapacity();
  const hasCapacity = totalCapacity >= totalStudents;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/exams">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Exams
            </Button>
          </Link>
        </div>
        <Button variant="destructive" onClick={handleDeleteExam}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Exam
        </Button>
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
            <div className="grid gap-4 md:grid-cols-2">
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
                    {formatTime(exam.start_time)} ({exam.duration_minutes} min)
                  </p>
                </div>
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
            <CardTitle>Capacity Check</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Students</span>
                <span className="text-2xl font-bold">{totalStudents}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Available Seats
                </span>
                <span className="text-2xl font-bold">{totalCapacity}</span>
              </div>
              <div className="border-t pt-4">
                {totalStudents > 0 && totalCapacity > 0 ? (
                  hasCapacity ? (
                    <div className="bg-green-50 border border-green-200 p-3 rounded text-sm">
                      <p className="font-medium text-green-900">
                        ✓ Sufficient Capacity
                      </p>
                      <p className="text-green-700 mt-1">
                        {totalCapacity - totalStudents} extra seats
                      </p>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 p-3 rounded text-sm">
                      <p className="font-medium text-red-900">
                        ⚠ Insufficient Capacity
                      </p>
                      <p className="text-red-700 mt-1">
                        Need {totalStudents - totalCapacity} more seats
                      </p>
                    </div>
                  )
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Assign students and halls to check capacity
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Assigned Students</CardTitle>
                <CardDescription>
                  {totalStudents} student{totalStudents !== 1 ? "s" : ""}{" "}
                  assigned
                </CardDescription>
              </div>
              <Link href={`/exams/${examId}/assign-students`}>
                <Button size="sm">
                  <Users className="mr-2 h-4 w-4" />
                  Manage
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  No students assigned yet
                </p>
                <Link href={`/exams/${examId}/assign-students`}>
                  <Button size="sm">Assign Students</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {students.slice(0, 5).map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {s.student.roll_number}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {s.student.name}
                      </p>
                    </div>
                  </div>
                ))}
                {students.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center pt-2">
                    +{students.length - 5} more students
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Assigned Halls</CardTitle>
                <CardDescription>
                  {halls.length} hall{halls.length !== 1 ? "s" : ""} assigned
                </CardDescription>
              </div>
              <Link href={`/exams/${examId}/assign-halls`}>
                <Button size="sm">
                  <Building2 className="mr-2 h-4 w-4" />
                  Manage
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {halls.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  No halls assigned yet
                </p>
                <Link href={`/exams/${examId}/assign-halls`}>
                  <Button size="sm">Assign Halls</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {halls.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{h.hall.name}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {h.hall.total_seats} seats
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {totalStudents > 0 && halls.length > 0 && hasCapacity && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Ready for Next Steps</CardTitle>
            <CardDescription className="text-blue-700">
              Students and halls are assigned. You can now proceed with seat
              allocation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Link href={`/exams/${examId}/allocate-seats`}>
                <Button>Allocate Seats</Button>
              </Link>
              <Link href={`/exams/${examId}/seating`}>
                <Button variant="outline">View Seating</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
