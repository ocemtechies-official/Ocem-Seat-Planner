"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Users, ClipboardList, Building2, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { role } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard/stats");
        const result = await response.json();

        if (result.success) {
          setDashboardData(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  // Role-specific dashboard content
  if (role === "admin" || role === "staff") {
    const stats = dashboardData?.stats || {};
    const upcomingExams = dashboardData?.upcomingExams || [];
    const recentExams = dashboardData?.recentExams || [];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage exam seating arrangements efficiently
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/students">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.students || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.students === 0 ? "No students added yet" : "Registered students"}
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/exams">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.exams || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.exams === 0 ? "No exams created" : "All exams"}
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/halls">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Exam Halls</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.halls || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.halls === 0 ? "No halls configured" : "Available halls"}
                </p>
              </CardContent>
            </Card>
          </Link>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcoming || 0}</div>
              <p className="text-xs text-muted-foreground">
                Scheduled exams
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/students/import"
              className="flex items-center gap-3 rounded-lg border p-4 hover:bg-gray-50 transition-colors"
            >
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Import Students</p>
                <p className="text-sm text-muted-foreground">
                  Upload CSV or Excel file
                </p>
              </div>
            </Link>

            <Link
              href="/halls/create"
              className="flex items-center gap-3 rounded-lg border p-4 hover:bg-gray-50 transition-colors"
            >
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Create Exam Hall</p>
                <p className="text-sm text-muted-foreground">
                  Configure seating layout
                </p>
              </div>
            </Link>

            <Link
              href="/exams/create"
              className="flex items-center gap-3 rounded-lg border p-4 hover:bg-gray-50 transition-colors"
            >
              <ClipboardList className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Create Exam</p>
                <p className="text-sm text-muted-foreground">
                  Schedule a new exam
                </p>
              </div>
            </Link>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Upcoming Exams */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Exams</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingExams.length === 0 ? (
                <p className="text-muted-foreground text-sm">No upcoming exams scheduled</p>
              ) : (
                <div className="space-y-3">
                  {upcomingExams.map((exam: any) => (
                    <Link
                      key={exam.id}
                      href={`/exams/${exam.id}`}
                      className="flex items-start justify-between p-3 border rounded hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{exam.subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {exam.course?.code} - {exam.course?.name}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(exam.exam_date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(exam.start_time)}
                          </span>
                        </div>
                      </div>
                      <Badge variant="default">{exam.status}</Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Exams</CardTitle>
            </CardHeader>
            <CardContent>
              {recentExams.length === 0 ? (
                <p className="text-muted-foreground text-sm">No recent exams</p>
              ) : (
                <div className="space-y-3">
                  {recentExams.map((exam: any) => (
                    <Link
                      key={exam.id}
                      href={`/exams/${exam.id}`}
                      className="flex items-start justify-between p-3 border rounded hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{exam.subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {exam.course?.code}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(exam.exam_date)}
                        </p>
                      </div>
                      <Badge
                        variant={
                          exam.status === "completed"
                            ? "secondary"
                            : exam.status === "scheduled"
                            ? "default"
                            : "outline"
                        }
                      >
                        {exam.status}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Getting Started Guide - Only show if no data */}
        {stats.students === 0 && stats.exams === 0 && stats.halls === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                  1
                </div>
                <div>
                  <p className="font-medium">Setup Departments and Courses</p>
                  <p className="text-sm text-muted-foreground">
                    Configure your institution&apos;s academic structure
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                  2
                </div>
                <div>
                  <p className="font-medium">Import Student Data</p>
                  <p className="text-sm text-muted-foreground">
                    Upload student list with roll numbers and courses
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                  3
                </div>
                <div>
                  <p className="font-medium">Create Exam Halls</p>
                  <p className="text-sm text-muted-foreground">
                    Define hall layouts with seating capacity
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                  4
                </div>
                <div>
                  <p className="font-medium">Schedule Exams</p>
                  <p className="text-sm text-muted-foreground">
                    Create exams and allocate seats automatically
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (role === "supervisor") {
    const upcomingExams = dashboardData?.upcomingExams || [];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Supervisor Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            View exam schedules and seating arrangements
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Exams</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingExams.length === 0 ? (
              <p className="text-muted-foreground">No upcoming exams scheduled</p>
            ) : (
              <div className="space-y-3">
                {upcomingExams.map((exam: any) => (
                  <Link
                    key={exam.id}
                    href={`/exams/${exam.id}/seating`}
                    className="flex items-start justify-between p-3 border rounded hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{exam.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {exam.course?.code} - {exam.course?.name}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(exam.exam_date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(exam.start_time)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (role === "student") {
    const stats = dashboardData?.stats || {};
    const upcomingExams = dashboardData?.upcomingExams || [];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            View your exam schedule and seating assignments
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/my-exams">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Exams</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.myExams || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Total assigned exams
                </p>
              </CardContent>
            </Card>
          </Link>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcoming || 0}</div>
              <p className="text-xs text-muted-foreground">
                Scheduled exams
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Exams</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingExams.length === 0 ? (
              <p className="text-muted-foreground">No upcoming exams</p>
            ) : (
              <div className="space-y-3">
                {upcomingExams.map((exam: any) => (
                  <Link
                    key={exam.id}
                    href={`/my-exams/${exam.id}`}
                    className="flex items-start justify-between p-3 border rounded hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{exam.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {exam.course?.code}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(exam.exam_date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(exam.start_time)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
