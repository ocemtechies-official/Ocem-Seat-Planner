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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { FileUp, Pencil, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
}

interface Student {
  id: string;
  roll_number: string;
  name: string;
  email?: string;
  year: number;
  department?: Department;
  course?: Course;
  user?: { id: string; email: string };
}

export default function StudentsPage() {
  const { role } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [accountFilter, setAccountFilter] = useState<string>("all");

  useEffect(() => {
    if (role && !["admin", "staff"].includes(role)) {
      router.push("/dashboard");
      return;
    }
    fetchDepartments();
    fetchCourses();
    fetchStudents();
  }, [role, router]);

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

  const fetchStudents = async () => {
    try {
      // Build query params
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (departmentFilter !== "all")
        params.append("department_id", departmentFilter);
      if (courseFilter !== "all") params.append("course_id", courseFilter);
      if (yearFilter !== "all") params.append("year", yearFilter);
      if (accountFilter !== "all")
        params.append("has_user_account", accountFilter);

      const response = await fetch(`/api/students?${params.toString()}`);
      const result = await response.json();
      if (result.success) {
        setStudents(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, rollNumber: string) => {
    if (
      !confirm(
        `Are you sure you want to delete student ${rollNumber}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        fetchStudents();
      } else {
        alert(result.error || "Failed to delete student");
      }
    } catch (error) {
      alert("An error occurred while deleting the student");
    }
  };

  useEffect(() => {
    if (!loading) {
      fetchStudents();
    }
  }, [
    searchTerm,
    departmentFilter,
    courseFilter,
    yearFilter,
    accountFilter,
  ]);

  if (!["admin", "staff"].includes(role || "")) {
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const filteredCourses =
    departmentFilter === "all"
      ? courses
      : courses.filter((c: any) => c.department_id === departmentFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground mt-2">
            Manage student records and information
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/students/import">
            <Button variant="outline">
              <FileUp className="mr-2 h-4 w-4" />
              Import Students
            </Button>
          </Link>
          <Link href="/students/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter students by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Roll number or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Course</label>
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {filteredCourses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Year</label>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="1">1st Year</SelectItem>
                  <SelectItem value="2">2nd Year</SelectItem>
                  <SelectItem value="3">3rd Year</SelectItem>
                  <SelectItem value="4">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Account Status</label>
              <Select value={accountFilter} onValueChange={setAccountFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="true">Has Account</SelectItem>
                  <SelectItem value="false">No Account</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>
            {students.length} student{students.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No students found. Try adjusting your filters or import students to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-mono font-medium">
                      {student.roll_number}
                    </TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.department?.name}</TableCell>
                    <TableCell>{student.course?.code}</TableCell>
                    <TableCell>{student.year}</TableCell>
                    <TableCell>
                      {student.user ? (
                        <Badge variant="default">Linked</Badge>
                      ) : (
                        <Badge variant="secondary">No Account</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/students/${student.id}`}>
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDelete(student.id, student.roll_number)
                          }
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
