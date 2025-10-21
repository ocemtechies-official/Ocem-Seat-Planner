# Administrator Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Initial System Setup](#initial-system-setup)
4. [Department & Course Management](#department--course-management)
5. [User Management](#user-management)
6. [Exam Hall Management](#exam-hall-management)
7. [Student Management](#student-management)
8. [Exam Management](#exam-management)
9. [Seat Allocation](#seat-allocation)
10. [Hall Ticket Generation](#hall-ticket-generation)
11. [Dashboard & Reports](#dashboard--reports)
12. [Troubleshooting](#troubleshooting)

---

## Introduction

Welcome to the Ocem Seat Planner Administrator Guide. As an administrator, you have full access to all system features and are responsible for the initial setup and ongoing management of the exam seating system.

### Your Responsibilities

- Setting up departments and courses
- Creating and managing user accounts
- Configuring exam halls
- Overseeing the entire exam scheduling process
- Managing student records
- Generating reports and analytics

---

## Getting Started

### Logging In

1. Navigate to the application URL
2. Click **"Sign In"**
3. Enter your admin email and password
4. Click **"Sign In"**

You'll be redirected to the admin dashboard upon successful login.

### Dashboard Overview

Your admin dashboard shows:
- Total students in the system
- Total exams (all statuses)
- Total exam halls
- Upcoming exams count
- Recent exams list
- Quick action buttons

---

## Initial System Setup

When setting up the system for the first time, follow these steps in order:

### Step 1: Create Departments

1. Navigate to **Departments** from the sidebar
2. Click **"Create Department"**
3. Fill in the form:
   - **Name**: Full department name (e.g., "Computer Science")
   - **Code**: Short code (e.g., "CS")
4. Click **"Create Department"**

**Repeat** for all departments in your institution.

**Example Departments:**
- Computer Science (CS)
- Mathematics (MATH)
- Physics (PHY)
- English (ENG)

### Step 2: Create Courses

1. Navigate to **Courses** from the sidebar
2. Click **"Create Course"**
3. Fill in the form:
   - **Department**: Select parent department
   - **Course Name**: Full course name
   - **Course Code**: Unique code (e.g., "CS101")
   - **Year**: Academic year (1-4)
   - **Semester**: 1 or 2
4. Click **"Create Course"**

**Repeat** for all courses in each department.

**Example Courses for CS Department:**
- Programming Fundamentals (CS101) - Year 1, Semester 1
- Data Structures (CS201) - Year 2, Semester 1
- Database Systems (CS301) - Year 3, Semester 1

### Step 3: Create Exam Halls

1. Navigate to **Halls** → **"Create Hall"**
2. Fill in the form:
   - **Hall Name**: e.g., "Main Hall A"
   - **Number of Rows**: Number of desk rows (e.g., 5)
   - **Number of Columns**: Number of desk columns (usually 2)
   - **Seats per Desk**: Usually 2 for bench seating
3. Click **"Create Hall"**

The system will automatically generate seats based on your configuration.

**Total Capacity** = Rows × Columns × Seats per Desk

**Example:** 5 rows × 2 columns × 2 seats = **20 total seats**

### Step 4: Configure Hall Layouts

After creating a hall:

1. Go to **Halls** → Select hall → **"Edit Layout"**
2. View the visual grid of all seats
3. Click any seat to toggle between usable/unusable
   - **Green** = Usable
   - **Red** = Unusable (broken/reserved)
4. Changes save automatically

### Step 5: Create User Accounts

1. Navigate to **Admin** → **"Users"** → **"Create User"**
2. Fill in the form:
   - **Email**: User's email address
   - **Password**: Temporary password (min 8 characters)
   - **Role**: Select role (Admin, Staff, Supervisor)
   - **Department Access** (for Staff only): Select departments

3. Click **"Create User"**

The user will receive an email and can change their password after first login.

### Step 6: Import or Add Students

**Option A: CSV/Excel Import (Recommended for bulk)**

1. Navigate to **Students** → **"Import Students"**
2. Download the CSV template
3. Fill in student data
4. Upload the file
5. Review preview and fix any errors
6. Click **"Import Students"**

**Option B: Manual Entry**

1. Navigate to **Students** → **"Add Student"**
2. Fill in student details
3. Click **"Add Student"**

---

## Department & Course Management

### Viewing Departments

1. Navigate to **Departments**
2. View list of all departments with:
   - Department name
   - Department code
   - Number of courses
   - Actions (Edit, Delete)

### Editing a Department

1. Click **Edit** icon next to the department
2. Update name or code
3. Click **"Save Changes"**

**Warning:** Changing the department code may affect existing records.

### Deleting a Department

1. Click **Delete** icon next to the department
2. Confirm deletion in the dialog

**Note:** You cannot delete a department that has:
- Existing students
- Existing courses
- Active exams

Remove or reassign these first.

### Managing Courses

**To Add a Course:**
1. Navigate to **Courses** → **"Create Course"**
2. Fill in course details
3. Click **"Create Course"**

**To Edit a Course:**
1. Click **Edit** icon next to the course
2. Update details
3. Click **"Save Changes"**

**To Delete a Course:**
1. Click **Delete** icon
2. Confirm deletion

**Note:** Cannot delete courses with active exams.

---

## User Management

### User Roles

**Admin**
- Full system access
- Can manage all data
- Can create other admins

**Staff**
- Limited to assigned departments
- Can create exams for their courses
- Can manage students in their departments

**Supervisor**
- View-only access
- Can view exam schedules and seating
- Cannot modify data

**Student**
- Can view own exam assignments
- Can download own hall tickets
- Cannot access management features

### Creating User Accounts

1. Navigate to **Admin** → **"Users"** → **"Create User"**
2. Enter email address
3. Set temporary password
4. Select role
5. **For Staff**: Select department access
6. Click **"Create User"**

### Assigning Department Access to Staff

When creating or editing a staff user:

1. In the user form, find **"Department Access"**
2. Select one or more departments from the dropdown
3. Click **"Save"**

Staff will only see and manage:
- Students in assigned departments
- Courses in assigned departments
- Exams for assigned courses

### Editing Users

1. Go to **Admin** → **"Users"**
2. Click **Edit** next to the user
3. Update details:
   - Change role
   - Update department access
   - Reset password (not available - user must use forgot password)
4. Click **"Save Changes"**

### Deleting Users

1. Go to **Admin** → **"Users"**
2. Click **Delete** next to the user
3. Confirm deletion

**Warning:** Deleting a user:
- Removes their access immediately
- Does not delete associated student records
- Does not delete exams they created

---

## Exam Hall Management

### Creating a New Hall

1. Navigate to **Halls** → **"Create Hall"**
2. Enter hall details:
   - **Hall Name**: Unique identifier
   - **Desk Rows**: Number of rows
   - **Desk Columns**: Number of columns (usually 2 for left/right)
   - **Seats per Desk**: Usually 2 for bench seating
3. Click **"Create Hall"**

Seats will be auto-generated with labels like: 1A, 1B, 2A, 2B, etc.

### Understanding Seat Numbering

**Format:** Row Number + Position Letter

**Example for 5 rows, 2 columns, 2 seats per desk:**
```
Column 1 (Left):
Row 1: 1A, 1B
Row 2: 2A, 2B
Row 3: 3A, 3B
Row 4: 4A, 4B
Row 5: 5A, 5B

Column 2 (Right):
Row 1: 1C, 1D
Row 2: 2C, 2D
Row 3: 3C, 3D
Row 4: 4C, 4D
Row 5: 5C, 5D
```

### Editing Hall Layout

1. Navigate to **Halls** → Select hall → **"Edit Layout"**
2. View visual grid of all seats
3. **To mark a seat as unusable:**
   - Click the seat (it turns red)
   - Click again to make it usable (turns green)
4. Changes save immediately

**Use Cases for Unusable Seats:**
- Broken furniture
- Reserved for supervisors
- Blocked for safety/emergency exits
- Damaged desks

### Editing Hall Details

1. Go to **Halls** → Click **Edit** next to hall
2. Update hall name
3. Click **"Save Changes"**

**Note:** You cannot change rows/columns after creation as it would break existing seat assignments.

### Deleting a Hall

1. Go to **Halls** → Click **Delete** next to hall
2. Confirm deletion

**Restrictions:**
- Cannot delete halls with future or scheduled exams
- Must first reassign or delete those exams

**Error Message:**
> "Cannot delete hall with scheduled or future exams. Please reassign or delete those exams first."

---

## Student Management

### Viewing Students

1. Navigate to **Students**
2. View list with columns:
   - Roll Number
   - Name
   - Department
   - Course
   - Year
   - Actions

### Searching Students

Use the search bar at the top:
- Search by **roll number**
- Search by **name**
- Results filter in real-time

### Filtering Students

Use filter dropdowns:
- **Department**: Filter by specific department
- **Course**: Filter by specific course
- **Year**: Filter by year (1, 2, 3, 4)
- **Has User Account**: Show only students with linked accounts

Click **"Clear Filters"** to reset.

### Adding a Student Manually

1. Navigate to **Students** → **"Add Student"**
2. Fill in the form:
   - **Roll Number**: Unique identifier (required)
   - **Name**: Full name (required)
   - **Email**: Contact email (optional)
   - **Department**: Select department (required)
   - **Course**: Select course (required)
   - **Year**: Select year 1-4 (required)
3. Click **"Add Student"**

**Validation:**
- Roll number must be unique
- Email format must be valid
- All required fields must be filled

### Importing Students from CSV/Excel

**Step 1: Download Template**

1. Navigate to **Students** → **"Import Students"**
2. Click **"Download CSV Template"**

**Step 2: Fill Template**

Required columns:
- `roll_number` - Unique student ID
- `name` - Full name
- `email` - Email address (can be empty)
- `department_code` - Department code (e.g., "CS")
- `course_code` - Course code (e.g., "CS101")
- `year` - Academic year (1, 2, 3, or 4)

**Example CSV:**
```csv
roll_number,name,email,department_code,course_code,year
2024001,John Doe,john@example.com,CS,CS101,1
2024002,Jane Smith,jane@example.com,CS,CS101,1
2024003,Bob Johnson,bob@example.com,MATH,MATH101,1
```

**Step 3: Upload File**

1. Click **"Choose File"** or drag-and-drop
2. Select your CSV or Excel file
3. Click **"Upload"**

**Step 4: Review Preview**

- System shows first 10 rows
- **Valid rows**: Shown in normal style
- **Invalid rows**: Highlighted in red with error message
- Review summary: "X valid, Y invalid"

**Step 5: Import Options**

- ☑ **Skip Invalid Rows**: Import only valid students
- ☑ **Update Existing**: If roll number exists, update the record instead of skipping

**Step 6: Complete Import**

1. Click **"Import Students"**
2. Wait for processing (progress bar shows)
3. Review results:
   - **Imported**: New students added
   - **Updated**: Existing students updated
   - **Skipped**: Duplicates (if update not checked)
   - **Failed**: Errors with details

**Common Import Errors:**
- "Roll number already exists" - Duplicate roll number
- "Invalid department code: XYZ" - Department doesn't exist
- "Invalid course code: ABC123" - Course doesn't exist
- "Invalid year: 5" - Year must be 1-4
- "Invalid email format" - Email not valid

### Editing a Student

1. Navigate to **Students**
2. Click **Edit** icon next to student
3. Update details
4. Click **"Save Changes"**

**Note:** Roll number cannot be changed after creation.

### Deleting a Student

1. Navigate to **Students**
2. Click **Delete** icon next to student
3. Confirm deletion

**Warning:** Deleting a student:
- Removes all exam assignments
- Removes all seat assignments
- Does NOT delete linked user account (unlink only)

---

## Exam Management

### Creating an Exam

1. Navigate to **Exams** → **"Create Exam"**
2. Fill in the form:
   - **Subject/Title**: e.g., "Programming Final Exam"
   - **Course**: Select course
   - **Exam Date**: Select date (cannot be past date)
   - **Start Time**: e.g., "10:00 AM"
   - **Duration**: In minutes (e.g., 120 for 2 hours)
   - **Status**: Draft or Scheduled
3. Click **"Create Exam"**

**Status Options:**
- **Draft**: Exam in planning stage
- **Scheduled**: Exam confirmed and ready
- **Completed**: Exam finished
- **Cancelled**: Exam cancelled

### Exam Workflow

**Complete workflow for an exam:**

1. **Create Exam** → Set basic details
2. **Assign Students** → Add students who will take the exam
3. **Assign Halls** → Select exam halls
4. **Allocate Seats** → Run allocation algorithm
5. **Review Seating** → Check and make manual adjustments
6. **Generate Hall Tickets** → Create PDFs for distribution

### Assigning Students to Exam

**Option A: Bulk Assign by Course**

1. Go to exam details → **"Assign Students"**
2. Check **"Assign all students from [Course Name]"**
3. Review count: "This will assign X students"
4. Click **"Assign All"**

This assigns ALL students enrolled in the exam's course.

**Option B: Manual Selection**

1. Go to exam details → **"Assign Students"**
2. Use search and filters to find students
3. Check boxes next to students to assign
4. Click **"Assign Selected Students"**

**Viewing Assigned Students**

- See list of assigned students below the assignment form
- Remove individual students with **X** button
- See total count

### Assigning Halls to Exam

1. Go to exam details
2. In **"Assigned Halls"** section, click **"Assign Halls"**
3. Select one or more halls from dropdown
4. Review capacity:
   - **Green**: Sufficient capacity (students ≤ seats)
   - **Red**: Insufficient capacity (students > seats)
5. Click **"Save Hall Assignments"**

**Example:**
- Students assigned: 45
- Hall A capacity: 30 seats
- Hall B capacity: 20 seats
- Total capacity: 50 seats ✓ (Sufficient)

---

## Seat Allocation

### Before Allocating Seats

**Prerequisites:**
1. ✓ Students assigned to exam
2. ✓ Halls assigned to exam
3. ✓ Capacity check passed (students ≤ available seats)

If prerequisites not met, allocation button will be disabled.

### Running Seat Allocation

1. Go to exam details → **"Allocate Seats"**
2. Select an **Allocation Pattern**:

   **Option 1: Department Alternation (Recommended)**
   - Desk-mates from different departments
   - Minimizes collaboration between same-department students
   - Best for preventing academic dishonesty

   **Option 2: Course Alternation**
   - Desk-mates from different courses
   - More granular than department alternation
   - Good for multi-course exams

   **Option 3: Year-Based Alternation**
   - Mix different academic years (1st with 3rd, 2nd with 4th)
   - Different syllabus makes cheating harder
   - Good for common exams across years

   **Option 4: Random Placement**
   - Completely random allocation
   - Fastest method
   - Use for low-stakes exams

3. Click **"Allocate Seats"**
4. Wait for processing
5. See success message: "Seats allocated for X students across Y halls"
6. Click **"View Seating Chart"**

### Understanding the Allocation Algorithm

**How it works:**

1. Groups students by selected pattern (department, course, year)
2. Creates desk pairs (2 students per desk)
3. Ensures each desk has students from different groups
4. Distributes across multiple halls if needed
5. Respects unusable seats (skips them)
6. Handles odd numbers gracefully (last student may sit alone)

**Example (Department Alternation):**
```
Desk 1: [CS Student] [Math Student]
Desk 2: [Physics Student] [English Student]
Desk 3: [CS Student] [Math Student]
...
```

### Viewing Seating Chart

1. Go to exam details → **"View Seating"**
2. See visual grid for each hall
3. Each seat shows:
   - Seat number
   - Student name and roll number (if assigned)
   - Color coding:
     - **Blue**: Occupied
     - **Gray**: Empty (available)
     - **Red**: Unusable

4. Filter by hall if multiple halls used

### Manual Seat Override

**To move a student to a different seat:**

1. Go to **"View Seating"**
2. Click on the occupied seat
3. In dialog, click **"Reassign Student"**
4. Search for or select new seat
5. Confirm: "Move [Student] from [Old Seat] to [New Seat]?"
6. Click **"Confirm"**

The assignment is marked as **manual override** (`is_manual = true`).

### Re-allocating Seats

**To clear all assignments and start over:**

1. Go to **"View Seating"**
2. Click **"Clear All & Re-allocate"**
3. Confirm warning: "This will delete all current assignments. Continue?"
4. Click **"Yes, Clear All"**
5. Return to allocation page
6. Select pattern and allocate again

**Use Cases:**
- Changed hall assignments
- Changed student list
- Want to try different allocation pattern
- Manual overrides created issues

---

## Hall Ticket Generation

### Generating Hall Tickets

**Prerequisites:**
- Seats allocated for exam
- All students have seat assignments

**Option A: Download All Tickets (ZIP)**

1. Go to exam details → **"Hall Tickets"**
2. Click **"Download All as ZIP"**
3. Wait for generation (may take time for large exams)
4. ZIP file downloads automatically
5. Extract ZIP to get individual PDF files
6. Each PDF named: `[RollNumber]_[StudentName].pdf`

**Option B: Download Individual Ticket**

1. Go to exam details → **"Hall Tickets"**
2. See list of all students
3. Click **"Download"** next to specific student
4. PDF downloads immediately

### Hall Ticket Content

Each ticket includes:

**Header:**
- Institution name/logo
- "EXAMINATION HALL TICKET" title

**Student Information:**
- Roll Number
- Full Name
- Department
- Course

**Exam Details:**
- Subject/Title
- Date
- Start Time - End Time
- Duration

**Seating Assignment:**
- Hall Name
- Seat Number

**QR Code:**
- Contains student roll number
- For quick verification

**Instructions:**
- Arrive 15 minutes early
- Bring valid ID card
- No electronic devices allowed
- Consult supervisor for issues

### Distributing Hall Tickets

**Method 1: Print and Distribute**
1. Download all tickets as ZIP
2. Extract PDF files
3. Print each ticket
4. Distribute to students before exam day

**Method 2: Email Distribution**
1. Download all tickets as ZIP
2. Use email automation or manually email each student their ticket
3. Students can print at home

**Method 3: Student Self-Download**
- Students log in to their portal
- View their exams
- Download their own hall tickets

**Recommendation:** Use Method 3 (student self-download) to save time and paper.

---

## Dashboard & Reports

### Admin Dashboard

Your dashboard shows:

**Statistics Cards:**
- **Total Students**: All students in system
- **Total Exams**: All exams (all statuses)
- **Exam Halls**: Total halls configured
- **Upcoming Exams**: Exams with future dates

**Quick Actions:**
- Import Students
- Create Exam Hall
- Create Exam

**Upcoming Exams List:**
- Next 5 exams chronologically
- Shows subject, date, time, status
- Click to view details

**Recent Exams:**
- Last 5 completed exams
- Shows subject, date, status

### Viewing Reports

**Student Report:**
1. Navigate to **Students**
2. Apply filters (department, course, year)
3. Click **"Export CSV"** to download filtered list

**Exam Report:**
1. Navigate to **Exams**
2. Filter by status, date range
3. View details for each exam
4. Export seating chart (print view)

**Hall Utilization Report:**
1. Navigate to **Halls**
2. View each hall
3. See usage statistics (manually review assigned exams)

---

## Troubleshooting

### Common Issues and Solutions

#### Cannot Delete Department

**Error:** "Cannot delete department with existing students or courses"

**Solution:**
1. Go to **Students** → Filter by this department
2. Delete or reassign all students
3. Go to **Courses** → Filter by this department
4. Delete all courses
5. Try deleting department again

#### Cannot Delete Hall

**Error:** "Cannot delete hall with scheduled or future exams"

**Solution:**
1. Go to **Exams** → Find exams using this hall
2. Either delete the exams or reassign to different halls
3. Try deleting hall again

#### Insufficient Capacity for Exam

**Error:** "Insufficient seating capacity. Need X seats, only Y available"

**Solution:**
- **Option A**: Assign additional halls
- **Option B**: Remove some students from exam
- **Option C**: Enable more seats in existing halls (mark unusable seats as usable)

#### CSV Import Fails

**Error:** Various validation errors

**Solution:**
1. Download template again
2. Ensure all required columns present
3. Check department codes match exactly (case-sensitive)
4. Check course codes match exactly
5. Check year values are 1, 2, 3, or 4 only
6. Remove duplicate roll numbers
7. Ensure email addresses are valid format
8. Save as CSV (not Excel) and re-upload

#### Student Cannot Register

**Error:** "Roll number not found"

**Solution:**
- Verify student record exists in system
- Check roll number entered correctly
- Ensure roll number not already linked to another account

#### Seat Allocation Fails

**Error:** Various allocation errors

**Solution:**
1. Verify students assigned to exam
2. Verify halls assigned to exam
3. Check capacity sufficient
4. Ensure at least some usable seats in halls
5. If still fails, contact technical support

#### Hall Tickets Missing Students

**Problem:** Some students don't have tickets

**Solution:**
- Check seat allocation completed
- Verify all students have seat assignments
- Go to **View Seating** and check for unassigned students
- Manually assign missing students
- Regenerate hall tickets

---

## Best Practices

### General Management

1. **Set up structure first**: Departments → Courses → Halls → Users
2. **Import students early**: Complete before exam season
3. **Test with small exam first**: Practice workflow with small group
4. **Regular backups**: Export student lists regularly
5. **Maintain hall layouts**: Update unusable seats regularly

### Exam Management

1. **Create exams early**: At least 2 weeks before exam date
2. **Verify student lists**: Check assigned students before allocation
3. **Review seating charts**: Manually check after allocation
4. **Distribute tickets early**: Give students time to review
5. **Keep exams in draft**: Until finalized, then change to scheduled

### Security

1. **Use strong passwords**: For all admin accounts
2. **Limit admin access**: Create staff accounts with limited permissions
3. **Regular password changes**: Change admin passwords quarterly
4. **Monitor user activity**: Review who's creating/modifying data
5. **Backup regularly**: Export critical data monthly

### Performance

1. **Archive old exams**: After semester ends, change status to completed
2. **Limit search results**: Use filters to narrow down lists
3. **Batch operations**: Import students in bulk vs. one-by-one
4. **Schedule allocations**: Run during off-peak hours for large exams

---

## Support and Help

### Getting Help

**For technical issues:**
- Check this documentation first
- Review error messages carefully
- Contact system administrator or IT support

**For feature requests:**
- Document your requirement
- Submit to development team

### System Maintenance

**Weekly Tasks:**
- Review user accounts
- Check for duplicate student records
- Update hall layouts if needed

**Monthly Tasks:**
- Export student database backup
- Review exam statistics
- Archive completed exams

**Quarterly Tasks:**
- Review and update departments/courses
- Clean up old user accounts
- System security audit

---

**Version**: 1.0.0
**Last Updated**: 2025-01-21

**For additional support, contact your system administrator.**
