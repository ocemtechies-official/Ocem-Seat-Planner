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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Department {
  id: string;
  name: string;
  code: string;
}

interface Course {
  id: string;
  name: string;
  code: string;
  department_id: string;
}

interface Student {
  id: string;
  roll_number: string;
  name: string;
  email?: string;
  department_id: string;
  course_id: string;
  year: number;
  user?: { id: string; email: string };
  department?: Department;
  course?: Course;
}

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [student, setStudent] = useState<Student | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    roll_number: "",
    name: "",
    email: "",
    department_id: "",
    course_id: "",
    year: "1",
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchStudent();
    fetchDepartments();
    fetchCourses();
  }, [studentId]);

  const fetchStudent = async () => {
    try {
      const response = await fetch(`/api/students/${studentId}`);
      const result = await response.json();
      if (result.success) {
        const s = result.data;
        setStudent(s);
        setFormData({
          roll_number: s.roll_number,
          name: s.name,
          email: s.email || "",
          department_id: s.department_id,
          course_id: s.course_id,
          year: s.year.toString(),
        });
      }
    } catch (error) {
      console.error("Failed to fetch student:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/departments");
      const result = await response.json();
      if (result.success) {
        setDepartments(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/courses");
      const result = await response.json();
      if (result.success) {
        setCourses(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const filteredCourses = courses.filter(
    (course) => course.department_id === formData.department_id
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        year: parseInt(formData.year),
        email: formData.email || undefined,
      };

      const response = await fetch(`/api/students/${studentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        router.push("/students");
      } else {
        setError(result.error || "Failed to update student");
      }
    } catch (error: any) {
      setError(error.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!student) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <Link href="/students">
            <Button>Back to Students</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/students">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Students
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Edit Student</h1>
        <p className="text-muted-foreground mt-2">
          Update student information
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
            <CardDescription>
              Update the student details below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roll_number">Roll Number *</Label>
                  <Input
                    id="roll_number"
                    value={formData.roll_number}
                    onChange={(e) =>
                      setFormData({ ...formData, roll_number: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select
                  value={formData.department_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, department_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name} ({dept.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">Course *</Label>
                <Select
                  value={formData.course_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, course_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCourses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name} ({course.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Academic Year *</Label>
                <Select
                  value={formData.year}
                  onValueChange={(value) =>
                    setFormData({ ...formData, year: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Changes"}
                </Button>
                <Link href="/students">
                  <Button type="button" variant="outline" disabled={submitting}>
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              {student.user ? (
                <div className="space-y-2">
                  <Badge variant="default">Account Linked</Badge>
                  <p className="text-sm text-muted-foreground">
                    This student has a user account linked with email:{" "}
                    <span className="font-medium">{student.user.email}</span>
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Badge variant="secondary">No Account</Badge>
                  <p className="text-sm text-muted-foreground">
                    This student has not created a user account yet. They can
                    register using their roll number.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Student Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Roll Number:</span>{" "}
                <span className="font-medium font-mono">{student.roll_number}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Department:</span>{" "}
                <span className="font-medium">{student.department?.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Course:</span>{" "}
                <span className="font-medium">{student.course?.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Year:</span>{" "}
                <span className="font-medium">{student.year}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
