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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { Building2, Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ExamHall {
  id: string;
  name: string;
  total_seats: number;
  rows: number;
  columns: number;
  layout_config: any;
  created_at: string;
}

export default function HallsPage() {
  const { role } = useAuth();
  const router = useRouter();
  const [halls, setHalls] = useState<ExamHall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role && !["admin", "staff"].includes(role)) {
      router.push("/dashboard");
      return;
    }
    fetchHalls();
  }, [role, router]);

  const fetchHalls = async () => {
    try {
      const response = await fetch("/api/halls");
      const result = await response.json();
      if (result.success) {
        setHalls(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch halls:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete hall "${name}"? This action cannot be undone and will delete all associated seats.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/halls/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        fetchHalls();
      } else {
        alert(result.error || "Failed to delete hall");
      }
    } catch (error) {
      alert("An error occurred while deleting the hall");
    }
  };

  if (!["admin", "staff"].includes(role || "")) {
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exam Halls</h1>
          <p className="text-muted-foreground mt-2">
            Manage exam halls and seating layouts
          </p>
        </div>
        <Link href="/halls/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Hall
          </Button>
        </Link>
      </div>

      {halls.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Exam Halls</CardTitle>
            <CardDescription>
              Create your first exam hall to start organizing seating arrangements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/halls/create">
              <Button>
                <Building2 className="mr-2 h-4 w-4" />
                Create First Hall
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {halls.map((hall) => (
            <Card key={hall.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {hall.name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Capacity: {hall.total_seats} seats
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Rows:</span>{" "}
                    <span className="font-medium">{hall.rows}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Columns:</span>{" "}
                    <span className="font-medium">{hall.columns}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Layout:</span>{" "}
                    <span className="font-medium">
                      {hall.rows} × {hall.columns} grid
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/halls/${hall.id}/layout`} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Layout
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(hall.id, hall.name)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {halls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Hall Details</CardTitle>
            <CardDescription>
              Detailed view of all exam halls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hall Name</TableHead>
                  <TableHead>Total Seats</TableHead>
                  <TableHead>Rows</TableHead>
                  <TableHead>Columns</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {halls.map((hall) => (
                  <TableRow key={hall.id}>
                    <TableCell className="font-medium">{hall.name}</TableCell>
                    <TableCell>{hall.total_seats}</TableCell>
                    <TableCell>{hall.rows}</TableCell>
                    <TableCell>{hall.columns}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/halls/${hall.id}/layout`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(hall.id, hall.name)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
