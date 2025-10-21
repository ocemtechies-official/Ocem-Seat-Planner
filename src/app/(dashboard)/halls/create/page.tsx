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
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateHallPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    rows: "5",
    columns: "2",
    seats_per_desk: "2",
  });

  const totalSeats =
    parseInt(formData.rows) *
    parseInt(formData.columns) *
    parseInt(formData.seats_per_desk);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        rows: parseInt(formData.rows),
        columns: parseInt(formData.columns),
        seats_per_desk: parseInt(formData.seats_per_desk),
      };

      const response = await fetch("/api/halls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        router.push(`/halls/${result.data.id}/layout`);
      } else {
        setError(result.error || "Failed to create hall");
      }
    } catch (error: any) {
      setError(error.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/halls">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Halls
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Create Exam Hall</h1>
        <p className="text-muted-foreground mt-2">
          Configure a new exam hall with seating layout
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Hall Configuration</CardTitle>
            <CardDescription>
              Define the hall layout and seating capacity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Hall Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Main Hall A, Room 101"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rows">Number of Rows *</Label>
                  <Select
                    value={formData.rows}
                    onValueChange={(value) =>
                      setFormData({ ...formData, rows: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(20)].map((_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Number of desk rows (1-20)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="columns">Desk Columns *</Label>
                  <Select
                    value={formData.columns}
                    onValueChange={(value) =>
                      setFormData({ ...formData, columns: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4].map((num) => (
                        <SelectItem key={num} value={String(num)}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Usually 2 (left/right)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seats_per_desk">Seats per Desk *</Label>
                  <Select
                    value={formData.seats_per_desk}
                    onValueChange={(value) =>
                      setFormData({ ...formData, seats_per_desk: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4].map((num) => (
                        <SelectItem key={num} value={String(num)}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Usually 2 per desk
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
                  <p className="font-medium">Total Capacity</p>
                  <p className="text-2xl font-bold mt-1">
                    {totalSeats} seats
                  </p>
                  <p className="text-sm mt-2">
                    {formData.rows} rows × {formData.columns} columns ×{" "}
                    {formData.seats_per_desk} seats per desk
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Creating..." : "Create Hall"}
                </Button>
                <Link href="/halls">
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
              <CardTitle>Typical Layout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">Nepal Classroom Standard</p>
                  <ul className="mt-2 space-y-1 text-muted-foreground">
                    <li>• 5 rows of desks</li>
                    <li>• 2 columns (left/right)</li>
                    <li>• 2 students per desk</li>
                    <li>• Total: 20 students</li>
                  </ul>
                </div>

                <div className="border-t pt-3">
                  <p className="font-medium">Visual Layout Example</p>
                  <div className="mt-2 bg-gray-50 p-3 rounded text-xs font-mono">
                    <div className="text-center mb-2 text-muted-foreground">
                      [Front / Teacher]
                    </div>
                    <div className="space-y-1">
                      {[1, 2, 3, 4, 5].map((row) => (
                        <div key={row} className="flex justify-between">
                          <span>[1A 1B]</span>
                          <span className="text-muted-foreground">|</span>
                          <span>[1C 1D]</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What&apos;s Next?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              After creating the hall, you&apos;ll be able to:
              <ul className="mt-2 space-y-1">
                <li>• View the visual layout</li>
                <li>• Mark specific seats as unusable</li>
                <li>• Use this hall for exam seating</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
