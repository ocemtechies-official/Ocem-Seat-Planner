"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Check, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Seat {
  id: string;
  hall_id: string;
  seat_number: string;
  row_number: number;
  col_number: number;
  is_usable: boolean;
}

interface ExamHall {
  id: string;
  name: string;
  total_seats: number;
  rows: number;
  columns: number;
  layout_config: any;
}

export default function HallLayoutPage() {
  const params = useParams();
  const hallId = params.id as string;

  const [hall, setHall] = useState<ExamHall | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState<
    Array<{ id: string; is_usable: boolean }>
  >([]);

  useEffect(() => {
    const fetchHallData = async () => {
      try {
        const [hallResponse, seatsResponse] = await Promise.all([
          fetch(`/api/halls/${hallId}`),
          fetch(`/api/halls/${hallId}/seats`),
        ]);

        const hallResult = await hallResponse.json();
        const seatsResult = await seatsResponse.json();

        if (hallResult.success) {
          setHall(hallResult.data);
        }

        if (seatsResult.success) {
          setSeats(seatsResult.data);
        }
      } catch (error) {
        console.error("Failed to fetch hall data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHallData();
  }, [hallId]);

  const refetchHallData = async () => {
    try {
      const [hallResponse, seatsResponse] = await Promise.all([
        fetch(`/api/halls/${hallId}`),
        fetch(`/api/halls/${hallId}/seats`),
      ]);

      const hallResult = await hallResponse.json();
      const seatsResult = await seatsResponse.json();

      if (hallResult.success) {
        setHall(hallResult.data);
      }

      if (seatsResult.success) {
        setSeats(seatsResult.data);
      }
    } catch (error) {
      console.error("Failed to fetch hall data:", error);
    }
  };

  const toggleSeat = (seatId: string, currentUsable: boolean) => {
    // Update local state immediately (optimistic update)
    setSeats((prevSeats) =>
      prevSeats.map((seat) =>
        seat.id === seatId ? { ...seat, is_usable: !currentUsable } : seat
      )
    );

    // Track pending update
    setPendingUpdates((prev) => {
      const existing = prev.find((u) => u.id === seatId);
      if (existing) {
        // Remove if toggling back to original state
        return prev.filter((u) => u.id !== seatId);
      }
      return [...prev, { id: seatId, is_usable: !currentUsable }];
    });
  };

  const markAllUsable = () => {
    const updates = seats
      .filter((seat) => !seat.is_usable)
      .map((seat) => ({ id: seat.id, is_usable: true }));

    if (updates.length === 0) {
      return;
    }

    // Update local state
    setSeats((prevSeats) =>
      prevSeats.map((seat) => ({ ...seat, is_usable: true }))
    );

    // Track all updates
    setPendingUpdates(updates);
  };

  const saveChanges = async () => {
    if (pendingUpdates.length === 0) {
      return;
    }

    setUpdating(true);

    try {
      const response = await fetch(`/api/halls/${hallId}/seats`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates: pendingUpdates }),
      });

      const result = await response.json();

      if (result.success) {
        setPendingUpdates([]);
        // Refresh data to ensure consistency
        await refetchHallData();
      } else {
        alert(result.error || "Failed to update seats");
        // Revert on error
        await refetchHallData();
      }
    } catch (error) {
      alert("An error occurred while updating seats");
      // Revert on error
      await refetchHallData();
    } finally {
      setUpdating(false);
    }
  };

  const groupSeatsByPosition = () => {
    if (!hall) return [];

    const seatsPerDesk = hall.layout_config?.seats_per_desk || 2;
    const grid: Seat[][][] = [];

    // Organize seats by row and column
    for (let row = 0; row < hall.rows; row++) {
      grid[row] = [];
      for (let col = 0; col < hall.columns; col++) {
        grid[row][col] = [];
      }
    }

    seats.forEach((seat) => {
      const rowIndex = seat.row_number - 1;
      const colIndex = seat.col_number - 1;
      if (grid[rowIndex] && grid[rowIndex][colIndex]) {
        grid[rowIndex][colIndex].push(seat);
      }
    });

    return grid;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!hall) {
    return <div>Hall not found</div>;
  }

  const grid = groupSeatsByPosition();
  const usableCount = seats.filter((s) => s.is_usable).length;
  const totalCount = seats.length;
  const hasChanges = pendingUpdates.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/halls">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Halls
            </Button>
          </Link>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={markAllUsable}
            disabled={updating || usableCount === totalCount}
          >
            Mark All Usable
          </Button>
          {hasChanges && (
            <Button onClick={saveChanges} disabled={updating}>
              {updating ? "Saving..." : `Save Changes (${pendingUpdates.length})`}
            </Button>
          )}
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold">{hall.name} - Layout Editor</h1>
        <p className="text-muted-foreground mt-2">
          Click any seat to toggle between usable (green) and unusable (red)
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Hall Layout</CardTitle>
            <CardDescription>
              {hall.rows} rows × {hall.columns} columns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-center mb-6 text-sm text-muted-foreground font-medium">
                [Front / Teacher / Supervisor]
              </div>

              <div className="space-y-4">
                {grid.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="flex justify-center items-center gap-8"
                  >
                    {row.map((deskSeats, colIndex) => (
                      <div key={colIndex} className="flex gap-2">
                        {deskSeats.map((seat) => (
                          <button
                            key={seat.id}
                            onClick={() => toggleSeat(seat.id, seat.is_usable)}
                            disabled={updating}
                            className={`
                              w-16 h-16 rounded border-2 flex flex-col items-center justify-center
                              font-semibold text-sm transition-all hover:scale-105 hover:shadow-lg
                              ${
                                seat.is_usable
                                  ? "bg-green-500 border-green-600 text-white hover:bg-green-600"
                                  : "bg-red-500 border-red-600 text-white hover:bg-red-600"
                              }
                              ${updating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                            `}
                          >
                            <span className="text-xs">
                              {seat.is_usable ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                            </span>
                            <span>{seat.seat_number}</span>
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="text-center mt-6 text-sm text-muted-foreground font-medium">
                [Back]
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Seat Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Usable Seats</span>
                  <span className="text-2xl font-bold text-green-600">
                    {usableCount}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Unusable Seats</span>
                  <span className="text-2xl font-bold text-red-600">
                    {totalCount - usableCount}
                  </span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Seats</span>
                    <span className="text-2xl font-bold">{totalCount}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-3 rounded text-sm">
                <p className="font-medium text-blue-900">Capacity</p>
                <p className="text-blue-700 mt-1">
                  {usableCount} / {totalCount} seats available for exams
                </p>
              </div>

              {hasChanges && (
                <div className="bg-orange-50 border border-orange-200 p-3 rounded text-sm">
                  <p className="font-medium text-orange-900">Unsaved Changes</p>
                  <p className="text-orange-700 mt-1">
                    {pendingUpdates.length} seat{pendingUpdates.length !== 1 ? "s" : ""} modified. Click &quot;Save Changes&quot; to apply.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 border-2 border-green-600 rounded flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span>Usable seat (available for exams)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 border-2 border-red-600 rounded flex items-center justify-center">
                  <X className="h-4 w-4 text-white" />
                </div>
                <span>Unusable seat (broken or reserved)</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• Click any seat to toggle its usability status</p>
              <p>• Green seats are available for exam seating</p>
              <p>• Red seats are marked as unusable</p>
              <p>• Use &quot;Mark All Usable&quot; to reset all seats</p>
              <p>• Changes are saved when you click &quot;Save Changes&quot;</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
