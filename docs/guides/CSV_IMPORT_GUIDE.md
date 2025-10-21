# CSV Import Guide

## Table of Contents

1. [Introduction](#introduction)
2. [CSV Template](#csv-template)
3. [Preparing Your Data](#preparing-your-data)
4. [Import Process](#import-process)
5. [Troubleshooting](#troubleshooting)
6. [Best Practices](#best-practices)

---

## Introduction

This guide explains how to import student data using CSV (Comma-Separated Values) or Excel files. This is the recommended method for adding multiple students at once.

### When to Use CSV Import

**Use CSV import when:**
- Adding 10+ students at once
- Migrating from another system
- Bulk enrollment for new semester
- Updating multiple student records

**Use manual entry when:**
- Adding single student
- Quick correction needed
- Testing the system

### Supported File Formats

- **CSV** (.csv) - Recommended
- **Excel** (.xlsx, .xls)

---

## CSV Template

### Downloading the Template

1. Log in to the system
2. Navigate to **Students** → **"Import Students"**
3. Click **"Download CSV Template"**
4. Save the file to your computer

### Template Structure

The template contains the following columns:

| Column | Required | Type | Description | Example |
|--------|----------|------|-------------|---------|
| roll_number | Yes | Text | Unique student identifier | 2024001 |
| name | Yes | Text | Full student name | John Doe |
| email | No | Email | Student email address | john@example.com |
| department_code | Yes | Text | Department code (must exist in system) | CS |
| course_code | Yes | Text | Course code (must exist in system) | CS101 |
| year | Yes | Number | Academic year (1, 2, 3, or 4) | 1 |

### Example CSV File

```csv
roll_number,name,email,department_code,course_code,year
2024001,John Doe,john@example.com,CS,CS101,1
2024002,Jane Smith,jane@example.com,CS,CS101,1
2024003,Bob Johnson,bob@example.com,MATH,MATH101,1
2024004,Alice Williams,,CS,CS102,2
2024005,Charlie Brown,charlie@example.com,PHY,PHY101,1
```

**Note:** Alice Williams has no email (empty field is allowed).

---

## Preparing Your Data

### Step 1: Gather Information

Before creating your CSV, collect:
- Student roll numbers
- Full names
- Email addresses (if available)
- Department codes (from system)
- Course codes (from system)
- Academic years

### Step 2: Get Department and Course Codes

**To find department codes:**
1. Log in to system
2. Go to **Departments**
3. Note the "Code" column (e.g., "CS", "MATH", "PHY")

**To find course codes:**
1. Go to **Courses**
2. Note the "Course Code" column (e.g., "CS101", "MATH201")

**Important:** Codes are case-sensitive!

### Step 3: Create Your CSV File

**Option A: Using Excel/Google Sheets**

1. Open the template in Excel or Google Sheets
2. Fill in your data starting from row 2 (row 1 is headers)
3. Do not modify header row
4. Save As → CSV (Comma delimited) (*.csv)

**Option B: Using Text Editor**

1. Open template in Notepad/TextEdit
2. Add data lines following the format
3. Separate values with commas
4. Save with .csv extension

### Step 4: Validate Your Data

**Before importing, check:**

✓ **Roll Numbers:**
- Unique for each student
- No spaces or special characters
- Consistent format (e.g., all 7 digits)

✓ **Names:**
- Complete names
- Proper capitalization
- No special characters that might cause issues

✓ **Emails:**
- Valid email format (name@domain.com)
- Can be left empty
- No duplicate emails

✓ **Department Codes:**
- Exact match with system (case-sensitive)
- Check spelling

✓ **Course Codes:**
- Exact match with system (case-sensitive)
- Course belongs to specified department

✓ **Years:**
- Only values: 1, 2, 3, or 4
- No other numbers

---

## Import Process

### Step 1: Upload File

1. Navigate to **Students** → **"Import Students"**
2. Click **"Choose File"** button
   OR
   Drag and drop your CSV/Excel file
3. File uploads and system begins validation

### Step 2: Review Preview

System displays:

**Preview Table:**
- First 10 rows of your data
- Shows how system interprets each field
- Invalid rows highlighted in red
- Error messages shown for each issue

**Summary Statistics:**
- **Valid Rows**: Number of rows that will import successfully
- **Invalid Rows**: Number of rows with errors
- **Total Rows**: Total in your file

**Example:**
```
Valid: 45 students
Invalid: 3 students
Total: 48 students
```

### Step 3: Review Errors

**If invalid rows exist:**

Each error shows:
- Row number in your file
- Specific error message
- Which field has the issue

**Common Errors:**
- "Duplicate roll number: 2024001" - Roll number used twice in file
- "Invalid department code: CSE" - Department doesn't exist
- "Invalid course code: CS999" - Course doesn't exist
- "Invalid year: 5" - Year must be 1-4
- "Invalid email format: notanemail" - Email format wrong
- "Roll number already exists in system" - Duplicate in database

### Step 4: Choose Import Options

**Option 1: Skip Invalid Rows**

☑ **Skip invalid rows**
- Only valid students will be imported
- Invalid rows will be skipped
- You can fix and re-import later

**Option 2: Update Existing Students**

☑ **Update existing students**
- If roll number already exists, update the record
- If unchecked, duplicates will be skipped
- Useful for updating student information

**Recommendation:** Check both options for most imports.

### Step 5: Import

1. Review settings
2. Click **"Import Students"**
3. Wait for processing (progress bar shows)
4. Do not close browser during import

### Step 6: Review Results

After import completes, see:

**Success Summary:**
- **Imported**: New students added (e.g., 45)
- **Updated**: Existing students updated (e.g., 0)
- **Skipped**: Duplicate roll numbers skipped (e.g., 2)
- **Failed**: Rows that couldn't be imported (e.g., 1)

**Error Details:**
If any failures, see:
- Row number
- Error message
- Data from that row

**Example Results:**
```
✓ Successfully imported 45 students
✓ Updated 0 existing students
⚠ Skipped 2 duplicate students
✗ Failed to import 1 student

Errors:
Row 48: Invalid department code: XYZ
```

### Step 7: Verify Import

After successful import:

1. Go to **Students** list
2. Use filters to find your imported students
3. Verify data is correct
4. Check a few random entries

---

## Troubleshooting

### File Upload Issues

**"Invalid file format"**

- Check file extension (.csv, .xlsx, or .xls)
- Try saving as CSV instead of Excel
- Make sure file is not corrupted

**"File too large"**

- Maximum file size: 10MB
- Split large imports into smaller batches
- Remove unnecessary columns

**"Cannot read file"**

- File may be open in Excel - close it
- Save as CSV (not CSV UTF-8)
- Try different browser

### Validation Errors

**"Duplicate roll number in file"**

- Search your CSV for the roll number
- Remove or correct duplicate entry
- Each roll number must be unique

**"Invalid department code: XXX"**

- Check department exists in system
- Verify spelling exactly (case-sensitive)
- No extra spaces before/after code

**"Invalid course code: YYY"**

- Check course exists in system
- Verify spelling exactly (case-sensitive)
- Ensure course belongs to specified department

**"Invalid email format"**

- Check email follows format: name@domain.com
- Remove if email not available (leave empty)
- No spaces in email addresses

**"Invalid year"**

- Must be 1, 2, 3, or 4 only
- Not: "First Year" or "1st" - use just "1"
- Remove any extra characters

### Permission Issues

**"Cannot import for department XXX: Permission denied"**

- Staff users: Can only import for assigned departments
- Check your department access with admin
- Import students in smaller department-specific batches

### Import Failures

**"Roll number already exists"**

- Option 1: Check "Update existing students" to update instead
- Option 2: Change roll number if it's a different student
- Option 3: Remove from CSV if truly duplicate

**"Failed to import X students"**

- Review error details carefully
- Fix issues in your CSV
- Re-import failed rows only

---

## Best Practices

### Before Import

1. **Backup first** - Export existing students before large import
2. **Test small** - Try importing 5-10 students first
3. **Verify codes** - Double-check all department and course codes
4. **Clean data** - Remove extra spaces, fix formatting
5. **Use template** - Always start with downloaded template

### During Import

1. **Check preview** - Review data before importing
2. **Read errors** - Don't ignore validation messages
3. **Use options** - Enable "Skip invalid" and "Update existing"
4. **Monitor progress** - Wait for completion message
5. **Don't refresh** - Let import finish completely

### After Import

1. **Verify results** - Check imported students in system
2. **Fix failures** - Address any failed imports
3. **Keep records** - Save your CSV file for reference
4. **Document** - Note any issues for future imports
5. **Communicate** - Inform relevant staff of new students

### Data Quality

**Do:**
- Use consistent roll number format
- Include complete names
- Verify emails before importing
- Double-check department/course codes
- Keep data organized and clean

**Don't:**
- Mix different data formats
- Include extra columns (remove them)
- Use special characters in names unnecessarily
- Leave required fields empty
- Import without validating first

---

## Common Scenarios

### Scenario 1: New Semester Enrollment

**Task:** Import 200 new first-year students

**Steps:**
1. Get student list from registrar
2. Download CSV template
3. Fill in student data
4. Verify department and course codes
5. Import in batches of 50 students
6. Verify each batch before next

### Scenario 2: Updating Student Information

**Task:** Update email addresses for 50 students

**Steps:**
1. Export current students
2. Add/update email column
3. Enable "Update existing students"
4. Import with updated data
5. Verify emails updated

### Scenario 3: Migrating from Old System

**Task:** Import 500 students from previous system

**Steps:**
1. Export data from old system
2. Map old fields to new template format
3. Add department and course codes
4. Split into manageable batches (100 each)
5. Test import with first batch
6. Import remaining batches
7. Verify totals match

### Scenario 4: Fixing Import Errors

**Task:** 3 students failed to import

**Steps:**
1. Review error messages
2. Fix issues in original CSV
3. Create new CSV with only failed rows
4. Re-import corrected data
5. Verify all imported successfully

---

## Appendix

### CSV Format Specification

**Character Encoding:** UTF-8
**Delimiter:** Comma (,)
**Text Qualifier:** None (or double quotes for names with commas)
**Line Endings:** LF or CRLF
**Header Row:** Required (first line)

### Excel Tips

**Saving as CSV:**
1. File → Save As
2. Choose "CSV (Comma delimited) (*.csv)"
3. Click Save
4. If warned about features, click Yes

**Avoiding Format Issues:**
- Format roll number cells as Text (not Number)
- Prevents Excel from modifying values
- Right-click column → Format Cells → Text

### Special Characters

**Safe to use:**
- Letters (A-Z, a-z)
- Numbers (0-9)
- Spaces
- Hyphens (-)
- Apostrophes (')
- Periods (.)

**Avoid:**
- Commas in names (causes CSV parsing issues)
- Quotes (unless escaping properly)
- Tabs
- Newlines within fields

**If name has comma:**
```csv
roll_number,name,email,department_code,course_code,year
2024001,"Doe, John",john@example.com,CS,CS101,1
```
(Wrap name in quotes)

---

## Quick Reference

### Required Columns

| Column | Example | Rules |
|--------|---------|-------|
| roll_number | 2024001 | Unique, no spaces |
| name | John Doe | Full name |
| email | john@example.com | Valid format or empty |
| department_code | CS | Exact match, case-sensitive |
| course_code | CS101 | Exact match, case-sensitive |
| year | 1 | Only: 1, 2, 3, or 4 |

### Import Checklist

- ☐ Downloaded template
- ☐ Gathered all data
- ☐ Verified department codes
- ☐ Verified course codes
- ☐ Checked for duplicates
- ☐ Validated email formats
- ☐ Tested with small batch
- ☐ Reviewed preview
- ☐ Imported successfully
- ☐ Verified in system

---

**Version**: 1.0.0
**Last Updated**: 2025-01-21

**For additional support, contact your system administrator.**
