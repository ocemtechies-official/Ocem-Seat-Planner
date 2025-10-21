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
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Department {
  id: string;
  name: string;
  code: string;
}

export default function CreateUserPage() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
    role: "staff",
  });
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  useEffect(() => {
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

    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match");
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    // Validate staff has at least one department
    if (formData.role === "staff" && selectedDepartments.length === 0) {
      alert("Staff users must have at least one department assigned");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role,
          department_ids:
            formData.role === "staff" ? selectedDepartments : undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        router.push("/admin/users");
      } else {
        alert(result.error || "Failed to create user");
      }
    } catch (error) {
      alert("An error occurred while creating user");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDepartment = (departmentId: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(departmentId)
        ? prev.filter((id) => id !== departmentId)
        : [...prev, departmentId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Create New User</h1>
        <p className="text-muted-foreground mt-2">
          Add a new user to the system
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>User Details</CardTitle>
              <CardDescription>
                Enter the basic information for the new user
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  minLength={8}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="confirm_password"
                  type="password"
                  placeholder="Re-enter password"
                  value={formData.confirm_password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirm_password: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">
                  Role <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {formData.role === "admin" &&
                    "Full system access"}
                  {formData.role === "staff" &&
                    "Can manage students, exams, and halls"}
                  {formData.role === "supervisor" &&
                    "View-only access"}
                  {formData.role === "student" &&
                    "Can view own exam assignments"}
                </p>
              </div>

              {formData.role === "staff" && (
                <div className="space-y-2">
                  <Label>
                    Department Access <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Select departments this staff member can access
                  </p>
                  <div className="border rounded-lg p-4 space-y-3 max-h-60 overflow-y-auto">
                    {departments.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No departments available
                      </p>
                    ) : (
                      departments.map((dept) => (
                        <div
                          key={dept.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={dept.id}
                            checked={selectedDepartments.includes(dept.id)}
                            onCheckedChange={() =>
                              handleToggleDepartment(dept.id)
                            }
                          />
                          <label
                            htmlFor={dept.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {dept.name} ({dept.code})
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                  {selectedDepartments.length > 0 && (
                    <p className="text-sm text-blue-600">
                      {selectedDepartments.length} department(s) selected
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Important Notes</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• The user will receive their login credentials via email</p>
                <p>• They can change their password after first login</p>
                <p>• Staff members need at least one department assigned</p>
                <p>• Student users should be linked to student records</p>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Link href="/admin/users" className="flex-1">
                <Button variant="outline" className="w-full" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Creating..." : "Create User"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
