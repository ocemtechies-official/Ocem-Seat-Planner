"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Users, Building2, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ExamData {
  exam: any;
  studentCount: number;
  hallCount: number;
  totalCapacity: number;
  hasAssignments: boolean;
}

export default function AllocateSeatsPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;

  const [examData, setExamData] = useState<ExamData | null>(null);
  const [selectedPattern, setSelectedPattern] = useState("department");
  const [loading, setLoading] = useState(true);
  const [allocating, setAllocating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examRes, studentsRes, hallsRes, assignmentsRes] =
          await Promise.all([
            fetch(`/api/exams/${examId}`),
            fetch(`/api/exams/${examId}/students`),
            fetch(`/api/exams/${examId}/halls`),
            fetch(`/api/exams/${examId}/assignments`),
          ]);

        const examResult = await examRes.json();
        const studentsResult = await studentsRes.json();
        const hallsResult = await hallsRes.json();
        const assignmentsResult = await assignmentsRes.json();

        const studentCount = studentsResult.success
          ? studentsResult.data.length
          : 0;
        const halls = hallsResult.success ? hallsResult.data : [];
        const totalCapacity = halls.reduce(
          (sum: number, h: any) => sum + (h.hall?.total_seats || 0),
          0
        );
        const hasAssignments = assignmentsResult.success
          ? assignmentsResult.data.length > 0
          : false;

        setExamData({
          exam: examResult.data,
          studentCount,
          hallCount: halls.length,
          totalCapacity,
          hasAssignments,
        });
      } catch (error) {
        console.error("Failed to fetch exam data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [examId]);

  const handleAllocate = async () => {
    if (!examData) return;

    // Confirmation if overwriting existing
    if (examData.hasAssignments) {
      if (
        !confirm(
          "This will delete all existing seat assignments and create new ones. Continue?"
        )
      ) {
        return;
      }
    }

    setAllocating(true);

    try {
      const response = await fetch(`/api/exams/${examId}/allocate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pattern: selectedPattern,
          clear_existing: examData.hasAssignments,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message || "Seats allocated successfully!");
        router.push(`/exams/${examId}/seating`);
      } else {
        alert(result.error || "Failed to allocate seats");
      }
    } catch (error) {
      alert("An error occurred while allocating seats");
    } finally {
      setAllocating(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!examData) {
    return <div>Failed to load exam data</div>;
  }

  const { exam, studentCount, hallCount, totalCapacity, hasAssignments } =
    examData;

  const hasCapacity = totalCapacity >= studentCount;
  const canAllocate = studentCount > 0 && hallCount > 0 && hasCapacity;

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
        <h1 className="text-3xl font-bold">Allocate Seats</h1>
        <p className="text-muted-foreground mt-2">
          {exam?.subject} - {exam?.course.code}
        </p>
      </div>

      {!canAllocate && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-900 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Cannot Allocate Seats
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-red-700 space-y-2">
            {studentCount === 0 && <p>• No students assigned to this exam</p>}
            {hallCount === 0 && <p>• No halls assigned to this exam</p>}
            {!hasCapacity && (
              <p>
                • Insufficient capacity ({studentCount} students need{" "}
                {totalCapacity} seats)
              </p>
            )}
            <p className="pt-2">
              Please assign students and halls before allocating seats.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Select Allocation Pattern</CardTitle>
            <CardDescription>
              Choose how students should be seated to prevent cheating
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedPattern} onValueChange={setSelectedPattern}>
              <div className="space-y-4">
                {/* Pattern 1: Department Alternation */}
                <Card className={selectedPattern === "department" ? "border-primary" : ""}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <RadioGroupItem
                        value="department"
                        id="department"
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor="department" className="text-base font-semibold cursor-pointer">
                          Department Alternation (Recommended)
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Students from different departments sit together at the same desk.
                          Best for preventing collaboration between students in the same field.
                        </p>
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          Example: CS student next to Math student, Physics next to English
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pattern 2: Course Alternation */}
                <Card className={selectedPattern === "course" ? "border-primary" : ""}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <RadioGroupItem
                        value="course"
                        id="course"
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor="course" className="text-base font-semibold cursor-pointer">
                          Course Alternation
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Students from different courses sit together. More granular than
                          department-based alternation.
                        </p>
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          Example: CS101 student next to CS102 student
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pattern 3: Year-Based Alternation */}
                <Card className={selectedPattern === "year" ? "border-primary" : ""}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <RadioGroupItem
                        value="year"
                        id="year"
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor="year" className="text-base font-semibold cursor-pointer">
                          Year-Based Alternation
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Mix different academic years. Different syllabi make cheating less likely.
                          Useful for common/general exams.
                        </p>
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          Example: 1st year next to 3rd year, 2nd year next to 4th year
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pattern 4: Random */}
                <Card className={selectedPattern === "random" ? "border-primary" : ""}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <RadioGroupItem
                        value="random"
                        id="random"
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor="random" className="text-base font-semibold cursor-pointer">
                          Random Placement
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Completely random seat assignment. Fastest allocation with no specific pattern.
                        </p>
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          Use for low-stakes exams or when time is limited
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </RadioGroup>

            {hasAssignments && (
              <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm font-medium text-orange-900">
                  ⚠ Existing Assignments Found
                </p>
                <p className="text-sm text-orange-700 mt-1">
                  This exam already has seat assignments. Allocating will delete the
                  existing assignments and create new ones.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pre-Allocation Check</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {studentCount > 0 ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className="text-sm">Students Assigned</span>
                </div>
                <span className="text-2xl font-bold">{studentCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {hallCount > 0 ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className="text-sm">Halls Assigned</span>
                </div>
                <span className="text-2xl font-bold">{hallCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {hasCapacity ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className="text-sm">Total Capacity</span>
                </div>
                <span className="text-2xl font-bold">{totalCapacity}</span>
              </div>

              {canAllocate && (
                <div className="pt-4 border-t">
                  <div className="bg-green-50 border border-green-200 p-3 rounded text-sm">
                    <p className="font-medium text-green-900">✓ Ready to Allocate</p>
                    <p className="text-green-700 mt-1">
                      All requirements met. You can proceed with seat allocation.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleAllocate}
                disabled={!canAllocate || allocating}
                className="w-full"
              >
                {allocating ? "Allocating..." : "Allocate Seats"}
              </Button>

              <Link href={`/exams/${examId}`} className="block">
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>

              {hasAssignments && (
                <Link href={`/exams/${examId}/seating`} className="block">
                  <Button variant="ghost" className="w-full">
                    View Current Seating
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
