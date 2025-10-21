"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw, FileDown } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Assignment {
  id: string;
  student: {
    roll_number: string;
    name: string;
    department: { code: string };
    course: { code: string };
  };
  seat: {
    seat_number: string;
    row_number: number;
    col_number: number;
  };
  hall: {
    id: string;
    name: string;
  };
  is_manual: boolean;
}

interface Hall {
  id: string;
  hall: {
    id: string;
    name: string;
    rows: number;
    columns: number;
    total_seats: number;
  };
}

export default function SeatingPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;

  const [exam, setExam] = useState<any>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [selectedHallId, setSelectedHallId] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examRes, assignmentsRes, hallsRes] = await Promise.all([
          fetch(`/api/exams/${examId}`),
          fetch(`/api/exams/${examId}/assignments`),
          fetch(`/api/exams/${examId}/halls`),
        ]);

        const examResult = await examRes.json();
        const assignmentsResult = await assignmentsRes.json();
        const hallsResult = await hallsRes.json();

        if (examResult.success) setExam(examResult.data);
        if (assignmentsResult.success) setAssignments(assignmentsResult.data);
        if (hallsResult.success) {
          setHalls(hallsResult.data);
          if (hallsResult.data.length > 0) {
            setSelectedHallId(hallsResult.data[0].hall.id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [examId]);

  const handleClearAssignments = async () => {
    if (
      !confirm(
        "Are you sure you want to clear all seat assignments? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/exams/${examId}/allocate`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push(`/exams/${examId}/allocate-seats`);
      } else {
        alert("Failed to clear assignments");
      }
    } catch (error) {
      alert("An error occurred while clearing assignments");
    }
  };

  const getFilteredAssignments = () => {
    if (selectedHallId === "all") {
      return assignments;
    }
    return assignments.filter((a) => a.hall.id === selectedHallId);
  };

  const getSeatingGrid = () => {
    const filtered = getFilteredAssignments();
    const selectedHall = halls.find((h) => h.hall.id === selectedHallId);

    if (!selectedHall) return null;

    const { rows, columns } = selectedHall.hall;
    const grid: (Assignment | null)[][] = [];

    // Initialize empty grid
    for (let r = 0; r < rows; r++) {
      grid[r] = [];
      for (let c = 0; c < columns * 2; c++) {
        grid[r][c] = null;
      }
    }

    // Fill grid with assignments
    filtered.forEach((assignment) => {
      const rowIndex = assignment.seat.row_number - 1;
      const colIndex = (assignment.seat.col_number - 1) * 2;

      // Determine position within desk (A/B or C/D)
      const seatLetter = assignment.seat.seat_number.slice(-1);
      const offset = ["A", "C"].includes(seatLetter) ? 0 : 1;

      if (grid[rowIndex]) {
        grid[rowIndex][colIndex + offset] = assignment;
      }
    });

    return { grid, rows, columns };
  };

  if (loading) {
    return <div>Loading seating arrangement...</div>;
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
            <h3 className="text-lg font-semibold mb-2">No Seating Assignments</h3>
            <p className="text-muted-foreground text-center mb-4">
              Seats have not been allocated for this exam yet
            </p>
            <Link href={`/exams/${examId}/allocate-seats`}>
              <Button>Allocate Seats</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredAssignments = getFilteredAssignments();
  const seatingData = getSeatingGrid();
  const manualCount = assignments.filter((a) => a.is_manual).length;

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

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClearAssignments}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Clear & Re-allocate
          </Button>
          <Link href={`/exams/${examId}/hall-tickets`}>
            <Button>
              <FileDown className="mr-2 h-4 w-4" />
              Generate Hall Tickets
            </Button>
          </Link>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Seating Arrangement</h1>
        <p className="text-muted-foreground mt-2">
          {exam?.subject} - {exam?.course.code}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={selectedHallId} onValueChange={setSelectedHallId}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select hall" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Halls</SelectItem>
              {halls.map((hall) => (
                <SelectItem key={hall.hall.id} value={hall.hall.id}>
                  {hall.hall.name} ({hall.hall.total_seats} seats)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Total Assigned:</span>{" "}
            <span className="font-bold">{assignments.length}</span>
          </div>
          {manualCount > 0 && (
            <div>
              <span className="text-muted-foreground">Manual Overrides:</span>{" "}
              <span className="font-bold text-orange-600">{manualCount}</span>
            </div>
          )}
        </div>
      </div>

      {selectedHallId === "all" ? (
        <div className="space-y-6">
          {halls.map((hall) => {
            const hallAssignments = assignments.filter(
              (a) => a.hall.id === hall.hall.id
            );
            return (
              <Card key={hall.hall.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{hall.hall.name}</CardTitle>
                      <CardDescription>
                        {hallAssignments.length} students assigned
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedHallId(hall.hall.id)}
                    >
                      View Layout
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {hallAssignments.slice(0, 6).map((assignment) => (
                      <div
                        key={assignment.id}
                        className="flex items-center justify-between p-2 border rounded text-sm"
                      >
                        <div>
                          <p className="font-medium">
                            {assignment.seat.seat_number}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {assignment.student.roll_number}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {assignment.student.department.code}
                        </Badge>
                      </div>
                    ))}
                    {hallAssignments.length > 6 && (
                      <div className="flex items-center justify-center p-2 border rounded text-sm text-muted-foreground">
                        +{hallAssignments.length - 6} more
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        seatingData && (
          <Card>
            <CardHeader>
              <CardTitle>
                {halls.find((h) => h.hall.id === selectedHallId)?.hall.name} Layout
              </CardTitle>
              <CardDescription>
                {filteredAssignments.length} students assigned
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 rounded-lg overflow-x-auto">
                <div className="text-center mb-6 text-sm text-muted-foreground font-medium">
                  [Front / Teacher / Supervisor]
                </div>

                <div className="space-y-3">
                  {seatingData.grid.map((row, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="flex justify-center items-center gap-6"
                    >
                      {Array.from(
                        { length: seatingData.columns },
                        (_, deskIndex) => {
                          const seat1 = row[deskIndex * 2];
                          const seat2 = row[deskIndex * 2 + 1];

                          return (
                            <div key={deskIndex} className="flex gap-2">
                              {[seat1, seat2].map((assignment, seatIndex) => (
                                <div
                                  key={seatIndex}
                                  className={`
                                    w-24 h-24 rounded border-2 flex flex-col items-center justify-center
                                    text-xs transition-all
                                    ${
                                      assignment
                                        ? assignment.is_manual
                                          ? "bg-orange-100 border-orange-400 hover:bg-orange-200"
                                          : "bg-blue-100 border-blue-400 hover:bg-blue-200"
                                        : "bg-gray-200 border-gray-300"
                                    }
                                  `}
                                >
                                  {assignment ? (
                                    <>
                                      <span className="font-bold">
                                        {assignment.seat.seat_number}
                                      </span>
                                      <span className="font-medium mt-1">
                                        {assignment.student.roll_number}
                                      </span>
                                      <span className="text-[10px] text-muted-foreground">
                                        {assignment.student.department.code}
                                      </span>
                                      {assignment.is_manual && (
                                        <span className="text-[10px] text-orange-600 mt-1">
                                          Manual
                                        </span>
                                      )}
                                    </>
                                  ) : (
                                    <span className="text-muted-foreground">
                                      Empty
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          );
                        }
                      )}
                    </div>
                  ))}
                </div>

                <div className="text-center mt-6 text-sm text-muted-foreground font-medium">
                  [Back]
                </div>
              </div>

              <div className="flex gap-4 mt-6 justify-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-100 border-2 border-blue-400 rounded"></div>
                  <span>Auto-assigned</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-100 border-2 border-orange-400 rounded"></div>
                  <span>Manual Override</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 border-2 border-gray-300 rounded"></div>
                  <span>Empty</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
