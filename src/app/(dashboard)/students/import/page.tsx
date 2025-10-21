"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { parseCSV } from "@/lib/parsers/csv-parser";
import { parseExcel } from "@/lib/parsers/excel-parser";
import type { StudentImportRow, StudentImportResult } from "@/types/api";
import { ArrowLeft, FileUp, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ImportStudentsPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [students, setStudents] = useState<StudentImportRow[]>([]);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [parseError, setParseError] = useState("");
  const [importResult, setImportResult] = useState<StudentImportResult | null>(null);
  const [updateExisting, setUpdateExisting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStudents([]);
      setParseError("");
      setImportResult(null);
    }
  };

  const handleParse = async () => {
    if (!file) return;

    setParsing(true);
    setParseError("");

    try {
      let parsedData: StudentImportRow[];

      if (file.name.endsWith(".csv")) {
        parsedData = await parseCSV(file);
      } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        parsedData = await parseExcel(file);
      } else {
        throw new Error("Unsupported file format. Please upload CSV or Excel file.");
      }

      setStudents(parsedData);
    } catch (error: any) {
      setParseError(error.message || "Failed to parse file");
    } finally {
      setParsing(false);
    }
  };

  const handleImport = async () => {
    if (students.length === 0) return;

    setImporting(true);
    setImportResult(null);

    try {
      const response = await fetch("/api/students/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          students,
          updateExisting,
        }),
      });

      const result = await response.json();
      setImportResult(result);

      if (result.success && result.imported > 0) {
        // Optionally redirect after a delay
        setTimeout(() => {
          router.push("/students");
        }, 3000);
      }
    } catch (error: any) {
      setParseError(error.message || "Failed to import students");
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent =
      "Roll Number,Name,Email,Department Code,Course Code,Year\n" +
      "2024001,John Doe,john@example.com,CS,CS101,1\n" +
      "2024002,Jane Smith,jane@example.com,MATH,MATH101,1\n";

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_import_template.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/students">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Students
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Import Students</h1>
        <p className="text-muted-foreground mt-2">
          Upload a CSV or Excel file to import multiple students at once
        </p>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Import Instructions</CardTitle>
          <CardDescription>
            Follow these steps to successfully import students
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                1
              </div>
              <div>
                <p className="font-medium">Download Template</p>
                <p className="text-sm text-muted-foreground">
                  Use our template to ensure correct formatting
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={downloadTemplate}
                >
                  Download Template
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                2
              </div>
              <div>
                <p className="font-medium">Required Columns</p>
                <p className="text-sm text-muted-foreground">
                  Your file must include: Roll Number, Name, Department Code,
                  Course Code, Year
                </p>
                <p className="text-sm text-muted-foreground">
                  Optional: Email
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                3
              </div>
              <div>
                <p className="font-medium">Upload & Preview</p>
                <p className="text-sm text-muted-foreground">
                  Upload your file and review the data before importing
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
          <CardDescription>
            Supports CSV (.csv) and Excel (.xlsx, .xls) files
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Select File</Label>
            <Input
              id="file"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
            />
          </div>

          {file && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </Badge>
              <Button onClick={handleParse} disabled={parsing}>
                {parsing ? "Parsing..." : "Parse File"}
              </Button>
            </div>
          )}

          {parseError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {parseError}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Data */}
      {students.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Preview Data</CardTitle>
            <CardDescription>
              Review the parsed data before importing ({students.length} students)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Dept Code</TableHead>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Year</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.slice(0, 10).map((student, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono">
                        {student.roll_number}
                      </TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email || "-"}</TableCell>
                      <TableCell>{student.department_code}</TableCell>
                      <TableCell>{student.course_code}</TableCell>
                      <TableCell>{student.year}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {students.length > 10 && (
              <p className="text-sm text-muted-foreground">
                Showing first 10 of {students.length} students
              </p>
            )}

            <div className="flex items-center gap-4 pt-4 border-t">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={updateExisting}
                  onChange={(e) => setUpdateExisting(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">
                  Update existing students with same roll number
                </span>
              </label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleImport} disabled={importing}>
                {importing ? "Importing..." : `Import ${students.length} Students`}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setStudents([]);
                  setFile(null);
                }}
                disabled={importing}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Results */}
      {importResult && (
        <Card>
          <CardHeader>
            <CardTitle>Import Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {importResult.imported}
                </div>
                <div className="text-sm text-muted-foreground">Imported</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {importResult.updated}
                </div>
                <div className="text-sm text-muted-foreground">Updated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {importResult.skipped}
                </div>
                <div className="text-sm text-muted-foreground">Skipped</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {importResult.failed}
                </div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
            </div>

            {importResult.errors.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium">Errors:</p>
                <div className="max-h-48 overflow-auto space-y-1">
                  {importResult.errors.map((error, index) => (
                    <div
                      key={index}
                      className="text-sm bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded"
                    >
                      Row {error.row}: {error.error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {importResult.imported > 0 && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
                Successfully imported {importResult.imported} students!
                Redirecting to students list...
              </div>
            )}

            <Link href="/students">
              <Button>View All Students</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
