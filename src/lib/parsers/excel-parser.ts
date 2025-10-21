import * as XLSX from "xlsx";
import type { StudentImportRow } from "@/types/api";

export async function parseExcel(file: File): Promise<StudentImportRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });

        // Get the first worksheet
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

        // Convert to JSON
        const rows = XLSX.utils.sheet_to_json(firstSheet);

        const students = rows.map((row: any) => {
          // Map Excel columns to expected format
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
            roll_number: rollNumber.toString().trim(),
            name: name.toString().trim(),
            email: email?.toString().trim(),
            department_code: departmentCode.toString().trim(),
            course_code: courseCode.toString().trim(),
            year,
          };
        });

        resolve(students);
      } catch (error: any) {
        reject(new Error(`Failed to parse Excel: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsBinaryString(file);
  });
}
