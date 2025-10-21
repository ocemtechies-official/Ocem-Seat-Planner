"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, FileText, Search, Archive } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Assignment {
  id: string;
  student: {
    id: string;
    roll_number: string;
    name: string;
    department: { code: string; name: string };
    course: { code: string; name: string };
  };
  seat: {
    seat_number: string;
  };
  hall: {
    name: string;
  };
}

export default function HallTicketsPage() {
  const params = useParams();
  const examId = params.id as string;

  const [exam, setExam] = useState<any>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examRes, assignmentsRes] = await Promise.all([
          fetch(`/api/exams/${examId}`),
          fetch(`/api/exams/${examId}/assignments`),
        ]);

        const examResult = await examRes.json();
        const assignmentsResult = await assignmentsRes.json();

        if (examResult.success) setExam(examResult.data);
        if (assignmentsResult.success) setAssignments(assignmentsResult.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [examId]);

  const handleDownloadSingle = async (studentId: string, rollNumber: string) => {
    setDownloading(studentId);
    try {
      const response = await fetch(
        `/api/exams/${examId}/hall-tickets?student_id=${studentId}`
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `hall-ticket-${rollNumber}.pdf`;
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
      setDownloading(null);
    }
  };

  const handleDownloadAll = async () => {
    setDownloadingAll(true);
    try {
      const response = await fetch(
        `/api/exams/${examId}/hall-tickets?format=zip`
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `hall-tickets-${exam?.course.code}-${exam?.exam_date}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Failed to download hall tickets");
      }
    } catch (error) {
      alert("An error occurred while downloading");
    } finally {
      setDownloadingAll(false);
    }
  };

  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.student.roll_number
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      assignment.student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (assignments.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/exams/${examId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Exam
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Seat Assignments</h3>
            <p className="text-muted-foreground text-center mb-4">
              Seats must be allocated before generating hall tickets
            </p>
            <Link href={`/exams/${examId}/allocate-seats`}>
              <Button>Allocate Seats</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/exams/${examId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Exam
            </Button>
          </Link>
        </div>

        <Button
          onClick={handleDownloadAll}
          disabled={downloadingAll || assignments.length === 0}
        >
          {downloadingAll ? (
            <>Generating ZIP...</>
          ) : (
            <>
              <Archive className="mr-2 h-4 w-4" />
              Download All ({assignments.length})
            </>
          )}
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Hall Tickets</h1>
        <p className="text-muted-foreground mt-2">
          {exam?.subject} - {exam?.course.code}
        </p>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">About Hall Tickets</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-700 space-y-2">
          <p>• Each hall ticket contains student details, exam information, and seating assignment</p>
          <p>• QR code included for easy verification</p>
          <p>• Download individual tickets or all tickets as a ZIP file</p>
          <p>• Students must present their hall ticket to enter the exam hall</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Student Hall Tickets</CardTitle>
              <CardDescription>
                {assignments.length} student(s) with seat assignments
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by roll number or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="border rounded-lg divide-y max-h-[600px] overflow-y-auto">
              {filteredAssignments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    No students found matching your search
                  </p>
                </div>
              ) : (
                filteredAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">
                            {assignment.student.roll_number}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {assignment.student.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">
                          {assignment.student.department.code}
                        </Badge>
                        <Badge variant="outline">
                          {assignment.student.course.code}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          • {assignment.hall.name} - Seat {assignment.seat.seat_number}
                        </span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() =>
                        handleDownloadSingle(
                          assignment.student.id,
                          assignment.student.roll_number
                        )
                      }
                      disabled={downloading === assignment.student.id}
                    >
                      {downloading === assignment.student.id ? (
                        <>Generating...</>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                ))
              )}
            </div>

            {filteredAssignments.length > 0 && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredAssignments.length} of {assignments.length}{" "}
                  student(s)
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadAll}
                  disabled={downloadingAll}
                >
                  {downloadingAll ? (
                    <>Generating ZIP...</>
                  ) : (
                    <>
                      <Archive className="mr-2 h-4 w-4" />
                      Download All as ZIP
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hall Ticket Format</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>Each hall ticket includes:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Student information (roll number, name, department, course)</li>
            <li>Exam details (subject, date, time, duration)</li>
            <li>Seating assignment (hall name and seat number)</li>
            <li>Instructions for students</li>
            <li>QR code for verification</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
