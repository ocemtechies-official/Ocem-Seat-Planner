"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Users, ClipboardList, Building2, Calendar } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { role } = useAuth();

  // Role-specific dashboard content
  if (role === "admin" || role === "staff") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome to OCEM Seat Planner</h1>
          <p className="text-muted-foreground mt-2">
            Manage exam seating arrangements efficiently
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                No students added yet
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled Exams</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                No exams scheduled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Exam Halls</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                No halls configured
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Next 7 days
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

        {/* Getting Started Guide */}
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
      </div>
    );
  }

  if (role === "supervisor") {
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
            <p className="text-muted-foreground">No upcoming exams scheduled</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // This shouldn't be reached as students go to /my-exams
  return null;
}
