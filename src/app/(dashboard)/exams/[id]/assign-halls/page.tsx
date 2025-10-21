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
import { ArrowLeft, Building2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Hall {
  id: string;
  name: string;
  total_seats: number;
  rows: number;
  columns: number;
}

interface AssignedHall {
  id: string;
  hall: Hall;
}

export default function AssignHallsPage() {
  const params = useParams();
  const examId = params.id as string;

  const [exam, setExam] = useState<any>(null);
  const [availableHalls, setAvailableHalls] = useState<Hall[]>([]);
  const [assignedHalls, setAssignedHalls] = useState<AssignedHall[]>([]);
  const [selectedHallIds, setSelectedHallIds] = useState<string[]>([]);
  const [studentCount, setStudentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examRes, hallsRes, assignedHallsRes, studentsRes] =
          await Promise.all([
            fetch(`/api/exams/${examId}`),
            fetch("/api/halls"),
            fetch(`/api/exams/${examId}/halls`),
            fetch(`/api/exams/${examId}/students`),
          ]);

        const examResult = await examRes.json();
        const hallsResult = await hallsRes.json();
        const assignedHallsResult = await assignedHallsRes.json();
        const studentsResult = await studentsRes.json();

        if (examResult.success) setExam(examResult.data);
        if (hallsResult.success) {
          // Filter out already assigned halls
          const assignedIds = assignedHallsResult.success
            ? assignedHallsResult.data.map((a: any) => a.hall.id)
            : [];
          const available = hallsResult.data.filter(
            (h: Hall) => !assignedIds.includes(h.id)
          );
          setAvailableHalls(available);
        }
        if (assignedHallsResult.success)
          setAssignedHalls(assignedHallsResult.data);
        if (studentsResult.success) setStudentCount(studentsResult.data.length);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [examId]);

  const handleAssignSelected = async () => {
    if (selectedHallIds.length === 0) {
      alert("Please select at least one hall");
      return;
    }

    setAssigning(true);
    try {
      const response = await fetch(`/api/exams/${examId}/halls`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hall_ids: selectedHallIds }),
      });

      const result = await response.json();

      if (result.success) {
        window.location.reload();
      } else {
        alert(result.error || "Failed to assign halls");
      }
    } catch (error) {
      alert("An error occurred while assigning halls");
    } finally {
      setAssigning(false);
    }
  };

  const handleRemoveHall = async (hallId: string) => {
    if (!confirm("Remove this hall from the exam?")) return;

    try {
      const response = await fetch(
        `/api/exams/${examId}/halls?hall_id=${hallId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        window.location.reload();
      } else {
        alert("Failed to remove hall");
      }
    } catch (error) {
      alert("An error occurred while removing hall");
    }
  };

  const handleToggleHall = (hallId: string) => {
    setSelectedHallIds((prev) =>
      prev.includes(hallId)
        ? prev.filter((id) => id !== hallId)
        : [...prev, hallId]
    );
  };

  const getTotalAssignedCapacity = () => {
    return assignedHalls.reduce((sum, h) => sum + h.hall.total_seats, 0);
  };

  const getSelectedCapacity = () => {
    return selectedHallIds.reduce((sum, id) => {
      const hall = availableHalls.find((h) => h.id === id);
      return sum + (hall?.total_seats || 0);
    }, 0);
  };

  const totalCapacity = getTotalAssignedCapacity() + getSelectedCapacity();
  const hasCapacity = totalCapacity >= studentCount;

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
        <h1 className="text-3xl font-bold">Assign Exam Halls</h1>
        <p className="text-muted-foreground mt-2">
          {exam?.subject} - {exam?.course.code}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Available Halls</CardTitle>
            <CardDescription>
              Select halls to assign to this exam
            </CardDescription>
          </CardHeader>
          <CardContent>
            {availableHalls.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  All halls have been assigned or no halls available
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border rounded-lg divide-y">
                  {availableHalls.map((hall) => (
                    <div
                      key={hall.id}
                      className="flex items-center gap-3 p-4 hover:bg-gray-50"
                    >
                      <Checkbox
                        checked={selectedHallIds.includes(hall.id)}
                        onCheckedChange={() => handleToggleHall(hall.id)}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{hall.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {hall.rows} rows × {hall.columns} columns
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{hall.total_seats}</p>
                        <p className="text-xs text-muted-foreground">seats</p>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedHallIds.length > 0 && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-900">
                        {selectedHallIds.length} hall(s) selected
                      </p>
                      <p className="text-sm font-medium text-blue-900">
                        +{getSelectedCapacity()} seats
                      </p>
                    </div>
                    <Button
                      onClick={handleAssignSelected}
                      disabled={assigning}
                      className="w-full"
                      size="sm"
                    >
                      {assigning ? "Assigning..." : "Assign Selected Halls"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Capacity Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Students
                  </span>
                  <span className="text-2xl font-bold">{studentCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Capacity
                  </span>
                  <span className="text-2xl font-bold">{totalCapacity}</span>
                </div>
                <div className="border-t pt-4">
                  {studentCount > 0 ? (
                    hasCapacity ? (
                      <div className="bg-green-50 border border-green-200 p-3 rounded text-sm">
                        <p className="font-medium text-green-900">
                          ✓ Sufficient Capacity
                        </p>
                        <p className="text-green-700 mt-1">
                          {totalCapacity - studentCount} extra seats
                        </p>
                      </div>
                    ) : (
                      <div className="bg-red-50 border border-red-200 p-3 rounded text-sm">
                        <p className="font-medium text-red-900">
                          ⚠ Insufficient Capacity
                        </p>
                        <p className="text-red-700 mt-1">
                          Need {studentCount - totalCapacity} more seats
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="bg-orange-50 border border-orange-200 p-3 rounded text-sm">
                      <p className="font-medium text-orange-900">
                        No Students Assigned
                      </p>
                      <p className="text-orange-700 mt-1">
                        Assign students first to check capacity
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assigned Halls</CardTitle>
              <CardDescription>
                {assignedHalls.length} hall(s) assigned
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assignedHalls.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">
                    No halls assigned yet
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {assignedHalls.map((assigned) => (
                    <div
                      key={assigned.id}
                      className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {assigned.hall.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {assigned.hall.total_seats} seats
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveHall(assigned.hall.id)}
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
    </div>
  );
}
