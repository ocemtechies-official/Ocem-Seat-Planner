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
import { useEffect, useState } from "react";

interface Course {
  id: string;
  name: string;
  code: string;
  department: {
    name: string;
  };
}

export default function CreateExamPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    course_id: "",
    exam_date: "",
    start_time: "",
    duration_minutes: "120",
    status: "draft",
  });

  useEffect(() => {
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

    fetchCourses();
  }, []);

  const calculateEndTime = () => {
    if (!formData.start_time || !formData.duration_minutes) return "";

    const [hours, minutes] = formData.start_time.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + parseInt(formData.duration_minutes);
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    const ampm = endHours >= 12 ? "PM" : "AM";
    const displayHour = endHours % 12 || 12;
    return `${displayHour}:${endMinutes.toString().padStart(2, "0")} ${ampm}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        router.push(`/exams/${result.data.id}`);
      } else {
        alert(result.error || "Failed to create exam");
      }
    } catch (error) {
      alert("An error occurred while creating the exam");
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/exams">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Exams
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Create New Exam</h1>
        <p className="text-muted-foreground mt-2">
          Schedule a new exam and configure its details
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Exam Details</CardTitle>
              <CardDescription>
                Enter the basic information about the exam
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">
                  Subject/Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="subject"
                  placeholder="e.g., Programming Fundamentals Final Exam"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">
                  Course <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.course_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, course_id: value })
                  }
                  required
                >
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.code} - {course.name} ({course.department.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="exam_date">
                    Exam Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="exam_date"
                    type="date"
                    min={getTodayDate()}
                    value={formData.exam_date}
                    onChange={(e) =>
                      setFormData({ ...formData, exam_date: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start_time">
                    Start Time <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={(e) =>
                      setFormData({ ...formData, start_time: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">
                  Duration (minutes) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="30"
                  max="300"
                  step="15"
                  value={formData.duration_minutes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration_minutes: e.target.value,
                    })
                  }
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Common durations: 60, 90, 120, 180 minutes
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Draft exams can be edited later before scheduling
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {formData.start_time && formData.duration_minutes && (
              <Card>
                <CardHeader>
                  <CardTitle>Calculated End Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Exam will end at
                    </p>
                    <p className="text-3xl font-bold">{calculateEndTime()}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>After creating the exam, you&apos;ll need to:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Assign students to the exam</li>
                  <li>Assign exam halls</li>
                  <li>Run seat allocation algorithm</li>
                  <li>Generate hall tickets</li>
                </ol>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Link href="/exams" className="flex-1">
                <Button variant="outline" className="w-full" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Creating..." : "Create Exam"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
