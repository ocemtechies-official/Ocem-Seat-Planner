import Papa from "papaparse";
import type { StudentImportRow } from "@/types/api";

export async function parseCSV(file: File): Promise<StudentImportRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const students = results.data.map((row: any, index: number) => {
            // Map CSV columns to expected format
            // Support both "Roll Number" and "roll_number" variations
            const rollNumber =
              row["Roll Number"] ||
              row["roll_number"] ||
              row["Roll_Number"] ||
              "";
            const name = row["Name"] || row["name"] || "";
            const email = row["Email"] || row["email"] || undefined;
            const departmentCode =
              row["Department Code"] ||
              row["department_code"] ||
              row["Department_Code"] ||
              "";
            const courseCode =
              row["Course Code"] ||
              row["course_code"] ||
              row["Course_Code"] ||
              "";
            const year = parseInt(row["Year"] || row["year"] || "0");

            return {
              roll_number: rollNumber.trim(),
              name: name.trim(),
              email: email?.trim(),
              department_code: departmentCode.trim(),
              course_code: courseCode.trim(),
              year,
            };
          });

          resolve(students);
        } catch (error: any) {
          reject(new Error(`Failed to parse CSV: ${error.message}`));
        }
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      },
    });
  });
}
