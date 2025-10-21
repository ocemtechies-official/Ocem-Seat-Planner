# Staff Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Managing Students](#managing-students)
4. [Creating and Managing Exams](#creating-and-managing-exams)
5. [Seat Allocation](#seat-allocation)
6. [Hall Ticket Generation](#hall-ticket-generation)
7. [Best Practices](#best-practices)

---

## Introduction

Welcome to the Ocem Seat Planner Staff Guide. As a staff member, you can manage students and exams for the departments assigned to you by the administrator.

### Your Permissions

You have access to:
- **Students**: In your assigned departments only
- **Exams**: For courses in your assigned departments
- **Halls**: View all halls, assign to your exams
- **Seat Allocation**: For your exams
- **Hall Tickets**: Generate for your exams

You cannot:
- Create or modify departments/courses
- Access students from other departments
- Create user accounts
- Modify system settings

---

## Getting Started

### Logging In

1. Navigate to the application URL
2. Click **"Sign In"**
3. Enter your staff email and password
4. Click **"Sign In"**

You'll be redirected to the staff dashboard.

### Dashboard Overview

Your dashboard shows:
- Total students (in your departments)
- Total exams (you created or for your departments)
- Upcoming exams count
- Quick actions: Import Students, Create Exam
- Upcoming exams list
- Recent exams

---

## Managing Students

### Viewing Your Students

1. Navigate to **Students** from the sidebar
2. See all students in your assigned departments

**Note:** You can only see students from departments you have access to.

### Adding a Student

1. Navigate to **Students** → **"Add Student"**
2. Fill in the form:
   - **Roll Number**: Unique identifier (required)
   - **Name**: Full name (required)
   - **Email**: Contact email (optional)
   - **Department**: Select from your departments only
   - **Course**: Select course from chosen department
   - **Year**: 1, 2, 3, or 4
3. Click **"Add Student"**

**Validation:**
- Roll number must be unique across all departments
- All required fields must be filled
- Can only select departments you have access to

### Importing Students (CSV/Excel)

**Step 1: Prepare Your File**

Download the CSV template:
1. Navigate to **Students** → **"Import Students"**
2. Click **"Download CSV Template"**

**Required columns:**
```csv
roll_number,name,email,department_code,course_code,year
2024001,John Doe,john@example.com,CS,CS101,1
2024002,Jane Smith,jane@example.com,CS,CS101,1
```

**Step 2: Fill Template**

- **roll_number**: Unique student ID
- **name**: Full name
- **email**: Email address (can be empty)
- **department_code**: Must be from your assigned departments
- **course_code**: Must exist in system
- **year**: 1, 2, 3, or 4

**Step 3: Upload**

1. Click **"Choose File"** or drag-and-drop
2. Upload CSV or Excel file
3. System validates and shows preview
4. Check options:
   - ☑ Skip Invalid Rows
   - ☑ Update Existing Students
5. Click **"Import Students"**

**Step 4: Review Results**

After import, see:
- **Imported**: New students added
- **Updated**: Existing records updated
- **Skipped**: Duplicates (if not updating)
- **Failed**: Errors with details

**Common Errors:**
- "Cannot import for department XYZ: Permission denied" - Not your department
- "Invalid department code" - Department doesn't exist
- "Invalid course code" - Course doesn't exist
- "Duplicate roll number" - Roll number already exists

### Editing a Student

1. Go to **Students**
2. Click **Edit** icon next to student
3. Update details (can only edit students in your departments)
4. Click **"Save Changes"**

**Note:** Cannot change roll number after creation.

### Searching and Filtering

**Search:**
- Use search bar to find by roll number or name
- Results update in real-time

**Filters:**
- **Department**: Filter by specific department (yours only)
- **Course**: Filter by course
- **Year**: Filter by year
- Click **"Clear Filters"** to reset

### Deleting a Student

1. Go to **Students**
2. Click **Delete** icon next to student (only for your departments)
3. Confirm deletion

**Warning:** This removes all exam assignments and seat assignments for this student.

---

## Creating and Managing Exams

### Creating an Exam

1. Navigate to **Exams** → **"Create Exam"**
2. Fill in the form:
   - **Subject/Title**: e.g., "Programming Midterm Exam"
   - **Course**: Select course (from your departments only)
   - **Exam Date**: Select date (must be future date)
   - **Start Time**: e.g., "10:00 AM"
   - **Duration**: In minutes (e.g., 90 for 1.5 hours)
   - **Status**: Draft or Scheduled
3. Click **"Create Exam"**

**Status Options:**
- **Draft**: Planning stage, not finalized
- **Scheduled**: Confirmed and ready
- **Completed**: Exam finished
- **Cancelled**: Exam cancelled

**Best Practice:** Keep exams in "Draft" until everything is confirmed, then change to "Scheduled".

### Exam Management Workflow

Complete these steps for each exam:

**1. Create Exam** ✓
- Set subject, course, date, time

**2. Assign Students** ✓
- Add students who will take the exam

**3. Assign Halls** ✓
- Select exam halls

**4. Allocate Seats** ✓
- Run seating algorithm

**5. Review & Adjust** ✓
- Check seating chart, make manual changes if needed

**6. Generate Hall Tickets** ✓
- Create PDFs for students

### Assigning Students to Exam

**Option A: Bulk Assign by Course**

1. Go to exam details → **"Assign Students"**
2. Check **"Assign all students from [Course Name]"**
3. See count: "This will assign X students"
4. Click **"Assign All"**

This assigns ALL students enrolled in that course.

**Example:** If exam is for "CS101" and there are 50 students in CS101, all 50 will be assigned.

**Option B: Manual Selection**

1. Go to exam details → **"Assign Students"**
2. See list of students from the course
3. Use search/filters to find specific students
4. Check boxes next to students
5. Click **"Assign Selected Students"**

**Viewing Assigned Students:**
- See list below assignment section
- Shows roll number, name, department, year
- Remove students individually with **X** button
- See total count

### Assigning Halls to Exam

1. Go to exam details page
2. In **"Assigned Halls"** section, click **"Assign Halls"**
3. Select one or more halls from dropdown
4. System shows capacity check:
   - **Green text**: "Sufficient capacity" (students ≤ seats)
   - **Red text**: "Insufficient capacity" (students > seats)
5. Click **"Save Hall Assignments"**

**Example:**
```
Students assigned: 45
Hall A capacity: 30 usable seats
Hall B capacity: 20 usable seats
Total capacity: 50 seats ✓ Sufficient
```

**If capacity insufficient:**
- Assign more halls, or
- Reduce number of students, or
- Ask admin to enable more seats in halls

### Editing an Exam

1. Go to **Exams** → Select exam
2. Click **"Edit Exam"**
3. Update details:
   - Subject
   - Date/Time
   - Duration
   - Status
4. Click **"Save Changes"**

**Note:** Cannot change course after creation.

### Deleting an Exam

1. Go to **Exams**
2. Click **Delete** icon next to exam (only for exams you created)
3. Confirm deletion

**Warning:** This deletes:
- All student assignments
- All hall assignments
- All seat assignments
- Cannot be undone

---

## Seat Allocation

### Before Allocating Seats

**Check Prerequisites:**

1. ✓ Students assigned to exam
2. ✓ Halls assigned to exam
3. ✓ Sufficient capacity (students ≤ available seats)

If any prerequisite missing, allocation button will be disabled.

### Choosing an Allocation Pattern

Navigate to: **Exam Details** → **"Allocate Seats"**

**Pattern 1: Department Alternation (Recommended)**

- Desk-mates from different departments
- **Example:** CS student sits with Math student
- **Best for:** Preventing collaboration between same-department students
- **Use when:** Students from multiple departments taking exam

**Pattern 2: Course Alternation**

- Desk-mates from different courses
- **Example:** CS101 student sits with CS102 student
- **Best for:** Single department, multiple courses
- **Use when:** Different courses taking same exam

**Pattern 3: Year-Based Alternation**

- Mix different years (Year 1 with Year 3, Year 2 with Year 4)
- **Best for:** Common exams across years
- **Use when:** Multiple years taking same exam
- Different syllabus makes cheating harder

**Pattern 4: Random Placement**

- Completely random
- **Best for:** Low-stakes exams or when pattern doesn't matter
- **Use when:** Quick allocation needed

### Running the Allocation

1. Select your preferred pattern
2. Click **"Allocate Seats"**
3. System processes (may take a few seconds for large exams)
4. See success message: "Seats allocated for X students across Y halls"
5. Click **"View Seating Chart"**

**What happens:**
- Students grouped by selected pattern
- Paired at desks (2 per desk)
- Distributed across halls
- Unusable seats skipped
- Odd numbers handled (last student may sit alone)

### Viewing the Seating Chart

1. Go to exam → **"View Seating"**
2. See visual grid for each hall
3. Each seat shows:
   - Seat number (e.g., "3B")
   - Student name and roll number (if assigned)
   - Color coding:
     - **Blue**: Occupied (assigned)
     - **Gray**: Empty (available)
     - **Red**: Unusable (broken/reserved)

4. **If multiple halls:** Use dropdown to filter by hall

### Making Manual Adjustments

**To move a student:**

1. In seating chart, click on occupied seat
2. Dialog opens showing student details
3. Click **"Reassign Student"**
4. Search for new seat or select from list
5. Confirm: "Move [Student Name] from [Old Seat] to [New Seat]?"
6. Click **"Confirm"**

**Use Cases:**
- Student has special needs (needs front seat)
- Student has accessibility requirements
- Manual conflict resolution
- Correcting allocation errors

**Note:** Manual assignments are tracked (`is_manual = true`).

### Re-allocating All Seats

**To start over:**

1. In seating chart, click **"Clear All & Re-allocate"**
2. Warning: "This will delete all current assignments. Continue?"
3. Click **"Yes, Clear All"**
4. Return to allocation page
5. Select pattern and run allocation again

**When to re-allocate:**
- Changed student list significantly
- Changed hall assignments
- Want to try different pattern
- Manual overrides created conflicts

---

## Hall Ticket Generation

### Prerequisites

Before generating hall tickets:
- ✓ Seats allocated for exam
- ✓ All students have seat assignments

### Generating All Tickets (ZIP)

**Recommended for distribution:**

1. Go to exam → **"Hall Tickets"**
2. Click **"Download All as ZIP"**
3. Wait for generation (progress indicator shows)
4. ZIP file downloads automatically
5. Extract ZIP to access individual PDF files

**Each PDF is named:** `[RollNumber]_[StudentName].pdf`

**Example:** `2024001_JohnDoe.pdf`

### Generating Individual Tickets

**For specific student:**

1. Go to exam → **"Hall Tickets"**
2. See list of all students with seat assignments
3. Find student
4. Click **"Download"** button next to student
5. PDF downloads immediately

**Use Cases:**
- Student lost their ticket
- Last-minute student addition
- Seat reassignment correction

### Hall Ticket Content

Each ticket includes:

**Header Section:**
- Institution name
- "EXAMINATION HALL TICKET" title

**Student Details:**
- Roll Number
- Full Name
- Department
- Course Name

**Exam Information:**
- Subject/Title
- Date (formatted: Dec 15, 2024)
- Time (formatted: 10:00 AM - 12:00 PM)
- Duration (e.g., "120 minutes")

**Seating Assignment:**
- Hall Name (e.g., "Main Hall A")
- Seat Number (e.g., "3B")

**QR Code:**
- Contains student roll number
- For quick verification by supervisors

**Instructions:**
- Arrive 15 minutes before start time
- Bring valid ID card
- No electronic devices allowed
- Consult invigilator for issues

### Distributing Hall Tickets

**Method 1: Student Self-Download (Recommended)**

Students can:
1. Log in to their account
2. Go to "My Exams"
3. View exam details
4. Download their own hall ticket

**Advantages:**
- Saves staff time
- Students responsible for their tickets
- Can re-download if lost

**Method 2: Print and Distribute**

1. Download all tickets as ZIP
2. Extract PDF files
3. Print each ticket
4. Sort by roll number
5. Distribute to students in class

**Method 3: Email Distribution**

1. Download all tickets as ZIP
2. Email each student their specific PDF
3. Students print at home

**Recommendation:** Use Method 1 (self-download) combined with Method 2 (print backup copies) for best results.

---

## Best Practices

### Student Management

**Do:**
- Import students early (before exam season)
- Use CSV import for bulk additions
- Verify student data before importing
- Keep student records up-to-date
- Regularly check for duplicates

**Don't:**
- Add students from other departments
- Use duplicate roll numbers
- Delete students with upcoming exams without backup
- Import without validating file first

### Exam Management

**Do:**
- Create exams at least 2 weeks in advance
- Keep exams in Draft until finalized
- Verify student list before allocation
- Review seating chart after allocation
- Generate tickets early (1 week before exam)
- Keep exam details updated

**Don't:**
- Create exams for past dates
- Assign insufficient halls
- Skip seat allocation review
- Wait until last day to generate tickets
- Delete exams with active assignments

### Seat Allocation

**Do:**
- Choose appropriate pattern for exam type
- Review capacity before allocating
- Check seating chart thoroughly
- Make manual adjustments as needed
- Keep notes on pattern effectiveness

**Don't:**
- Allocate without checking capacity
- Skip seating review
- Make excessive manual changes (re-allocate instead)
- Use random for high-stakes exams

### Communication

**Do:**
- Inform students about exam details early
- Remind students to download hall tickets
- Provide clear instructions for exam day
- Have backup printed tickets
- Coordinate with other staff

**Don't:**
- Assume students check the system
- Wait until exam day to distribute tickets
- Make last-minute changes without notice

---

## Troubleshooting

### Cannot Create Exam

**Problem:** "Insufficient permissions" error

**Solution:**
- Verify course is from your assigned department
- Contact admin if you should have access
- Check you're selecting correct course

### Cannot Import Students

**Problem:** "Permission denied for department" error

**Solution:**
- Check CSV has correct department codes
- Only import students from your departments
- Contact admin to get access to other departments

### Insufficient Capacity

**Problem:** "Insufficient seating capacity" when assigning halls

**Solution:**
- **Option A:** Assign more halls
- **Option B:** Remove some students from exam
- **Option C:** Ask admin to enable more seats in halls

### Allocation Fails

**Problem:** Allocation button disabled or fails

**Solution:**
1. Check students assigned ✓
2. Check halls assigned ✓
3. Check capacity (students ≤ seats) ✓
4. Verify halls have usable seats ✓
5. Try refreshing page
6. Contact admin if still fails

### Hall Tickets Missing Students

**Problem:** Some students don't have tickets

**Solution:**
- Go to **View Seating**
- Check if all students have seat assignments
- Manually assign missing students
- Regenerate hall tickets

### Student Cannot Find Their Seat

**Problem:** Student says they can't see seat assignment

**Solution:**
1. Verify student is assigned to exam
2. Check seat allocation completed
3. Verify student has user account and is logged in
4. Check student looking at correct exam
5. If needed, send them PDF directly

---

## Tips for Success

### Time Management

- **2-3 weeks before exam:** Create exam, assign students
- **1-2 weeks before exam:** Assign halls, allocate seats
- **1 week before exam:** Generate and distribute hall tickets
- **Day before exam:** Print backup tickets, review arrangements
- **Exam day:** Have digital and printed copies ready

### Organization

- Create exams in batches for same period
- Use consistent naming (e.g., "CS101 - Midterm - Fall 2024")
- Keep notes on allocation patterns that work
- Maintain backup of student lists
- Document any special seating arrangements

### Quality Control

- Always preview before finalizing
- Double-check student counts match
- Verify all seats assigned before generating tickets
- Review seating for any obvious issues
- Test with small exam first if new to system

---

## Getting Help

### For Technical Issues

1. Check this guide first
2. Review error message carefully
3. Try logging out and back in
4. Contact your administrator
5. Report bugs to IT support

### For Process Questions

- Consult with other staff members
- Ask administrator for best practices
- Review example exams in system
- Refer to institutional policies

---

**Version**: 1.0.0
**Last Updated**: 2025-01-21

**For additional support, contact your system administrator.**
