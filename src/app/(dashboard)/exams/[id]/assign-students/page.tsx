"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Users, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Student {
  id: string;
  roll_number: string;
  name: string;
  email: string;
  department: {
    id: string;
    name: string;
    code: string;
  };
  course: {
    id: string;
    name: string;
    code: string;
  };
}

interface AssignedStudent {
  id: string;
  student: Student;
}

export default function AssignStudentsPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;

  const [exam, setExam] = useState<any>(null);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [assignedStudents, setAssignedStudents] = useState<AssignedStudent[]>(
    []
  );
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examRes, studentsRes, assignedRes] = await Promise.all([
          fetch(`/api/exams/${examId}`),
          fetch("/api/students"),
          fetch(`/api/exams/${examId}/students`),
        ]);

        const examResult = await examRes.json();
        const studentsResult = await studentsRes.json();
        const assignedResult = await assignedRes.json();

        if (examResult.success) setExam(examResult.data);
        if (studentsResult.success) {
          // Filter out already assigned students
          const assignedIds = assignedResult.success
            ? assignedResult.data.map((a: any) => a.student.id)
            : [];
          const available = studentsResult.data.filter(
            (s: Student) => !assignedIds.includes(s.id)
          );
          setAvailableStudents(available);
        }
        if (assignedResult.success) setAssignedStudents(assignedResult.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [examId]);

  const handleBulkAssign = async () => {
    if (!exam?.course_id) return;

    const courseStudents = availableStudents.filter(
      (s) => s.course.id === exam.course_id
    );

    if (courseStudents.length === 0) {
      alert("No students found for this course");
      return;
    }

    if (
      !confirm(
        `Assign all ${courseStudents.length} students from ${exam.course.code}?`
      )
    ) {
      return;
    }

    await assignStudents(courseStudents.map((s) => s.id));
  };

  const handleAssignSelected = async () => {
    if (selectedStudentIds.length === 0) {
      alert("Please select at least one student");
      return;
    }

    await assignStudents(selectedStudentIds);
  };

  const assignStudents = async (studentIds: string[]) => {
    setAssigning(true);
    try {
      const response = await fetch(`/api/exams/${examId}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_ids: studentIds }),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh data
        window.location.reload();
      } else {
        alert(result.error || "Failed to assign students");
      }
    } catch (error) {
      alert("An error occurred while assigning students");
    } finally {
      setAssigning(false);
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!confirm("Remove this student from the exam?")) return;

    try {
      const response = await fetch(
        `/api/exams/${examId}/students?student_id=${studentId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        window.location.reload();
      } else {
        alert("Failed to remove student");
      }
    } catch (error) {
      alert("An error occurred while removing student");
    }
  };

  const handleToggleStudent = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const filteredStudents = availableStudents.filter(
    (student) =>
      student.roll_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

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

      <div>
        <h1 className="text-3xl font-bold">Assign Students</h1>
        <p className="text-muted-foreground mt-2">
          {exam?.subject} - {exam?.course.code}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Available Students</CardTitle>
                <CardDescription>
                  Select students to assign to this exam
                </CardDescription>
              </div>
              {exam && (
                <Button onClick={handleBulkAssign} variant="outline" size="sm">
                  Assign All from {exam.course.code}
                </Button>
              )}
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

              {filteredStudents.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">
                    {searchQuery
                      ? "No students found matching your search"
                      : "All students have been assigned"}
                  </p>
                </div>
              ) : (
                <>
                  <div className="border rounded-lg divide-y max-h-[500px] overflow-y-auto">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50"
                      >
                        <Checkbox
                          checked={selectedStudentIds.includes(student.id)}
                          onCheckedChange={() => handleToggleStudent(student.id)}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {student.roll_number}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {student.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {student.course.code}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {student.department.code}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedStudentIds.length > 0 && (
                    <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">
                        {selectedStudentIds.length} student(s) selected
                      </p>
                      <Button
                        onClick={handleAssignSelected}
                        disabled={assigning}
                        size="sm"
                      >
                        {assigning ? "Assigning..." : "Assign Selected"}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assigned Students</CardTitle>
            <CardDescription>
              {assignedStudents.length} student(s) assigned
            </CardDescription>
          </CardHeader>
          <CardContent>
            {assignedStudents.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  No students assigned yet
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {assignedStudents.map((assigned) => (
                  <div
                    key={assigned.id}
                    className="flex items-center justify-between p-2 border rounded hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {assigned.student.roll_number}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {assigned.student.name}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveStudent(assigned.student.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
