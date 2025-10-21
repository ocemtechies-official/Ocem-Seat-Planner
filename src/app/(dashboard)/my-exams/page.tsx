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
import { Calendar, Clock, MapPin, FileDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface StudentExam {
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
}

export default function MyExamsPage() {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState<any>(null);
  const [exams, setExams] = useState<StudentExam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyExams = async () => {
      if (!user) return;

      try {
        // First, get student record for current user
        const studentRes = await fetch(
          `/api/students?user_id=${user.id}`
        );
        const studentResult = await studentRes.json();

        if (studentResult.success && studentResult.data.length > 0) {
          const student = studentResult.data[0];
          setStudentData(student);

          // Get all exams for this student
          const examsRes = await fetch(`/api/students/${student.id}/exams`);
          const examsResult = await examsRes.json();

          if (examsResult.success) {
            setExams(examsResult.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyExams();
  }, [user]);

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

  const isUpcoming = (dateString: string) => {
    const examDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return examDate >= today;
  };

  if (loading) {
    return <div>Loading your exams...</div>;
  }

  if (!studentData) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <h3 className="text-lg font-semibold mb-2">No Student Record Found</h3>
          <p className="text-muted-foreground text-center">
            Your account is not linked to a student record. Please contact the administrator.
          </p>
        </CardContent>
      </Card>
    );
  }

  const upcomingExams = exams.filter((e) => isUpcoming(e.exam.exam_date));
  const pastExams = exams.filter((e) => !isUpcoming(e.exam.exam_date));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Exams</h1>
        <p className="text-muted-foreground mt-2">
          {studentData.roll_number} - {studentData.name}
        </p>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Student Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-700">Roll Number:</span>
            <span className="font-medium text-blue-900">{studentData.roll_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Name:</span>
            <span className="font-medium text-blue-900">{studentData.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Department:</span>
            <span className="font-medium text-blue-900">
              {studentData.department?.name} ({studentData.department?.code})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Course:</span>
            <span className="font-medium text-blue-900">
              {studentData.course?.code} - {studentData.course?.name}
            </span>
          </div>
        </CardContent>
      </Card>

      {upcomingExams.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Upcoming Exams</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingExams.map((item) => (
              <Link key={item.exam.id} href={`/my-exams/${item.exam.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {item.exam.subject}
                        </CardTitle>
                        <CardDescription>
                          {item.exam.course.code} - {item.exam.course.name}
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusColor(item.exam.status)}>
                        {item.exam.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(item.exam.exam_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {formatTime(item.exam.start_time)} ({item.exam.duration_minutes} min)
                      </span>
                    </div>
                    {item.assignment ? (
                      <div className="pt-2 border-t">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-700">
                            {item.assignment.hall.name} - Seat {item.assignment.seat.seat_number}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-2 border-t">
                        <p className="text-sm text-orange-600">
                          Seat not assigned yet
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {pastExams.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Past Exams</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {pastExams.map((item) => (
              <Link key={item.exam.id} href={`/my-exams/${item.exam.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-75 h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {item.exam.subject}
                        </CardTitle>
                        <CardDescription>
                          {item.exam.course.code} - {item.exam.course.name}
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusColor(item.exam.status)}>
                        {item.exam.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(item.exam.exam_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {formatTime(item.exam.start_time)} ({item.exam.duration_minutes} min)
                      </span>
                    </div>
                    {item.assignment && (
                      <div className="pt-2 border-t">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {item.assignment.hall.name} - Seat {item.assignment.seat.seat_number}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {exams.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Exams Scheduled</h3>
            <p className="text-muted-foreground text-center">
              You don&apos;t have any exams scheduled at the moment.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
