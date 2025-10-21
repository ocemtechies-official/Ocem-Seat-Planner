# API Documentation

## Base URL

**Development**: `http://localhost:3000/api`
**Production**: `https://yourdomain.com/api`

## Authentication

All API endpoints (except public auth endpoints) require authentication via session cookie. The cookie is automatically set upon successful login and included in subsequent requests.

### Authentication Headers

No additional headers needed - authentication is handled via HTTP-only cookies set by Supabase Auth.

### Error Responses

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Authentication Endpoints

### Register Student

**POST** `/api/auth/register`

Register a new student account with roll number validation.

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "securepassword123",
  "roll_number": "2024001"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email for verification."
}
```

**Response (Error - Roll Number Not Found):**
```json
{
  "success": false,
  "error": "Roll number not found in student records"
}
```

---

### Login

Handled by Supabase Auth client-side. No custom API endpoint needed.

---

### Logout

Handled by Supabase Auth client-side. No custom API endpoint needed.

---

## Department Endpoints

### List Departments

**GET** `/api/departments`

Get all departments.

**Permissions:** Authenticated users

**Query Parameters:** None

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "name": "Computer Science",
      "code": "CS",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": "uuid-here",
      "name": "Mathematics",
      "code": "MATH",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### Create Department

**POST** `/api/departments`

Create a new department.

**Permissions:** Admin only

**Request Body:**
```json
{
  "name": "Physics",
  "code": "PHY"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "Physics",
    "code": "PHY",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### Get Department

**GET** `/api/departments/[id]`

Get a single department by ID.

**Permissions:** Authenticated users

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "Computer Science",
    "code": "CS",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### Update Department

**PATCH** `/api/departments/[id]`

Update an existing department.

**Permissions:** Admin only

**Request Body:**
```json
{
  "name": "Computer Science & Engineering"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "Computer Science & Engineering",
    "code": "CS",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T10:30:00Z"
  }
}
```

---

### Delete Department

**DELETE** `/api/departments/[id]`

Delete a department.

**Permissions:** Admin only

**Response:**
```json
{
  "success": true,
  "message": "Department deleted successfully"
}
```

---

## Course Endpoints

### List Courses

**GET** `/api/courses`

Get all courses.

**Permissions:** Authenticated users

**Query Parameters:**
- `department_id` (optional) - Filter by department

**Example:** `/api/courses?department_id=uuid-here`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "department_id": "uuid-here",
      "name": "Programming Fundamentals",
      "code": "CS101",
      "year": 1,
      "semester": 1,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### Create Course

**POST** `/api/courses`

Create a new course.

**Permissions:** Admin only

**Request Body:**
```json
{
  "department_id": "uuid-here",
  "name": "Data Structures",
  "code": "CS201",
  "year": 2,
  "semester": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "department_id": "uuid-here",
    "name": "Data Structures",
    "code": "CS201",
    "year": 2,
    "semester": 1,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### Get Course

**GET** `/api/courses/[id]`

Get a single course by ID.

**Permissions:** Authenticated users

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "department_id": "uuid-here",
    "name": "Programming Fundamentals",
    "code": "CS101",
    "year": 1,
    "semester": 1,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### Update Course

**PATCH** `/api/courses/[id]`

Update an existing course.

**Permissions:** Admin only

**Request Body:**
```json
{
  "name": "Introduction to Programming",
  "year": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "department_id": "uuid-here",
    "name": "Introduction to Programming",
    "code": "CS101",
    "year": 1,
    "semester": 1,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T10:30:00Z"
  }
}
```

---

### Delete Course

**DELETE** `/api/courses/[id]`

Delete a course.

**Permissions:** Admin only

**Response:**
```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

---

## Student Endpoints

### List Students

**GET** `/api/students`

Get all students (with permission filtering).

**Permissions:** Admin (all students), Staff (department students), Students (own record)

**Query Parameters:**
- `department_id` (optional) - Filter by department
- `course_id` (optional) - Filter by course
- `year` (optional) - Filter by year
- `search` (optional) - Search by roll number or name
- `user_id` (optional) - Get student by linked user ID

**Example:** `/api/students?department_id=uuid-here&year=1`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "roll_number": "2024001",
      "name": "John Doe",
      "email": "john@example.com",
      "department_id": "uuid-here",
      "course_id": "uuid-here",
      "year": 1,
      "user_id": "uuid-here",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### Create Student

**POST** `/api/students`

Create a new student record.

**Permissions:** Admin, Staff (for their departments)

**Request Body:**
```json
{
  "roll_number": "2024002",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "department_id": "uuid-here",
  "course_id": "uuid-here",
  "year": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "roll_number": "2024002",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "department_id": "uuid-here",
    "course_id": "uuid-here",
    "year": 1,
    "user_id": null,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### Import Students (CSV/Excel)

**POST** `/api/students/import`

Import students from CSV or Excel file.

**Permissions:** Admin, Staff (for their departments)

**Content-Type:** `multipart/form-data`

**Request Body:**
- `file` - CSV or Excel file
- `update_existing` (optional) - Boolean, update existing students if roll number matches

**CSV Format:**
```csv
roll_number,name,email,department_code,course_code,year
2024001,John Doe,john@example.com,CS,CS101,1
2024002,Jane Smith,jane@example.com,CS,CS101,1
```

**Response:**
```json
{
  "success": true,
  "imported": 45,
  "updated": 3,
  "skipped": 2,
  "failed": 1,
  "errors": [
    {
      "row": 48,
      "error": "Invalid department code: XYZ"
    }
  ]
}
```

---

### Get Student

**GET** `/api/students/[id]`

Get a single student by ID.

**Permissions:** Admin, Staff (for their department), Student (own record)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "roll_number": "2024001",
    "name": "John Doe",
    "email": "john@example.com",
    "department_id": "uuid-here",
    "course_id": "uuid-here",
    "year": 1,
    "user_id": "uuid-here",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### Update Student

**PATCH** `/api/students/[id]`

Update an existing student.

**Permissions:** Admin, Staff (for their department)

**Request Body:**
```json
{
  "name": "John Michael Doe",
  "year": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "roll_number": "2024001",
    "name": "John Michael Doe",
    "email": "john@example.com",
    "department_id": "uuid-here",
    "course_id": "uuid-here",
    "year": 2,
    "user_id": "uuid-here",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T10:30:00Z"
  }
}
```

---

### Delete Student

**DELETE** `/api/students/[id]`

Delete a student.

**Permissions:** Admin, Staff (for their department)

**Response:**
```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

---

### Get Student's Exams

**GET** `/api/students/[id]/exams`

Get all exams assigned to a specific student.

**Permissions:** Admin, Staff, Student (own exams)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "subject": "Programming Final Exam",
      "course_id": "uuid-here",
      "exam_date": "2024-12-15",
      "start_time": "10:00:00",
      "duration_minutes": 120,
      "status": "scheduled",
      "seat_assignment": {
        "hall_name": "Main Hall A",
        "seat_number": "3B",
        "assigned_at": "2024-12-01T00:00:00Z"
      }
    }
  ]
}
```

---

## Exam Hall Endpoints

### List Halls

**GET** `/api/halls`

Get all exam halls.

**Permissions:** Authenticated users

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "name": "Main Hall A",
      "total_seats": 40,
      "rows": 10,
      "columns": 4,
      "layout_config": {
        "type": "grid",
        "seats_per_desk": 2
      },
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### Create Hall

**POST** `/api/halls`

Create a new exam hall.

**Permissions:** Admin, Staff

**Request Body:**
```json
{
  "name": "Room 101",
  "rows": 5,
  "columns": 2,
  "seats_per_desk": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "Room 101",
    "total_seats": 20,
    "rows": 5,
    "columns": 2,
    "layout_config": {
      "type": "grid",
      "seats_per_desk": 2
    },
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

**Note:** Seats are automatically generated after hall creation.

---

### Get Hall

**GET** `/api/halls/[id]`

Get a single hall by ID.

**Permissions:** Authenticated users

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "Main Hall A",
    "total_seats": 40,
    "rows": 10,
    "columns": 4,
    "layout_config": {},
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### Update Hall

**PATCH** `/api/halls/[id]`

Update an existing hall.

**Permissions:** Admin, Staff

**Request Body:**
```json
{
  "name": "Main Hall A (Renovated)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "Main Hall A (Renovated)",
    "total_seats": 40,
    "rows": 10,
    "columns": 4,
    "layout_config": {},
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T10:30:00Z"
  }
}
```

---

### Delete Hall

**DELETE** `/api/halls/[id]`

Delete a hall (only if no future exams assigned).

**Permissions:** Admin, Staff

**Response:**
```json
{
  "success": true,
  "message": "Hall deleted successfully"
}
```

**Error (Has Future Exams):**
```json
{
  "success": false,
  "error": "Cannot delete hall with scheduled or future exams. Please reassign or delete those exams first."
}
```

---

### Get Hall Seats

**GET** `/api/halls/[id]/seats`

Get all seats in a hall.

**Permissions:** Authenticated users

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "hall_id": "uuid-here",
      "seat_number": "1A",
      "row_number": 1,
      "col_number": 1,
      "is_usable": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### Update Seat

**PATCH** `/api/halls/[id]/seats/[seatId]`

Update a seat (toggle usable status).

**Permissions:** Admin, Staff

**Request Body:**
```json
{
  "is_usable": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "hall_id": "uuid-here",
    "seat_number": "1A",
    "row_number": 1,
    "col_number": 1,
    "is_usable": false,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T10:30:00Z"
  }
}
```

---

## Exam Endpoints

### List Exams

**GET** `/api/exams`

Get all exams (with permission filtering).

**Permissions:** Authenticated users

**Query Parameters:**
- `status` (optional) - Filter by status (draft, scheduled, completed, cancelled)
- `date_from` (optional) - Filter by date range start
- `date_to` (optional) - Filter by date range end

**Example:** `/api/exams?status=scheduled&date_from=2024-12-01`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "subject": "Programming Final Exam",
      "course_id": "uuid-here",
      "exam_date": "2024-12-15",
      "start_time": "10:00:00",
      "duration_minutes": 120,
      "status": "scheduled",
      "created_by": "uuid-here",
      "created_at": "2024-11-01T00:00:00Z",
      "updated_at": "2024-11-01T00:00:00Z"
    }
  ]
}
```

---

### Create Exam

**POST** `/api/exams`

Create a new exam.

**Permissions:** Admin, Staff (for their courses)

**Request Body:**
```json
{
  "subject": "Data Structures Midterm",
  "course_id": "uuid-here",
  "exam_date": "2024-12-20",
  "start_time": "14:00",
  "duration_minutes": 90,
  "status": "draft"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "subject": "Data Structures Midterm",
    "course_id": "uuid-here",
    "exam_date": "2024-12-20",
    "start_time": "14:00:00",
    "duration_minutes": 90,
    "status": "draft",
    "created_by": "uuid-here",
    "created_at": "2024-11-15T00:00:00Z",
    "updated_at": "2024-11-15T00:00:00Z"
  }
}
```

---

### Get Exam

**GET** `/api/exams/[id]`

Get a single exam by ID.

**Permissions:** Authenticated users

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "subject": "Programming Final Exam",
    "course_id": "uuid-here",
    "exam_date": "2024-12-15",
    "start_time": "10:00:00",
    "duration_minutes": 120,
    "status": "scheduled",
    "created_by": "uuid-here",
    "created_at": "2024-11-01T00:00:00Z",
    "updated_at": "2024-11-01T00:00:00Z"
  }
}
```

---

### Update Exam

**PATCH** `/api/exams/[id]`

Update an existing exam.

**Permissions:** Admin, Staff (creator or same department)

**Request Body:**
```json
{
  "status": "scheduled",
  "exam_date": "2024-12-16"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "subject": "Programming Final Exam",
    "course_id": "uuid-here",
    "exam_date": "2024-12-16",
    "start_time": "10:00:00",
    "duration_minutes": 120,
    "status": "scheduled",
    "created_by": "uuid-here",
    "created_at": "2024-11-01T00:00:00Z",
    "updated_at": "2024-11-10T10:30:00Z"
  }
}
```

---

### Delete Exam

**DELETE** `/api/exams/[id]`

Delete an exam.

**Permissions:** Admin, Staff (creator)

**Response:**
```json
{
  "success": true,
  "message": "Exam deleted successfully"
}
```

---

### Assign Students to Exam

**POST** `/api/exams/[id]/students`

Assign students to an exam (bulk or individual).

**Permissions:** Admin, Staff (creator)

**Request Body (Bulk by Course):**
```json
{
  "assign_all": true,
  "course_id": "uuid-here"
}
```

**Request Body (Individual Students):**
```json
{
  "student_ids": ["uuid-1", "uuid-2", "uuid-3"]
}
```

**Response:**
```json
{
  "success": true,
  "assigned": 45,
  "message": "45 students assigned to exam"
}
```

---

### Get Exam Students

**GET** `/api/exams/[id]/students`

Get all students assigned to an exam.

**Permissions:** Admin, Staff, Supervisor

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "roll_number": "2024001",
      "name": "John Doe",
      "department_id": "uuid-here",
      "course_id": "uuid-here",
      "year": 1
    }
  ]
}
```

---

### Remove Student from Exam

**DELETE** `/api/exams/[id]/students/[studentId]`

Remove a student from an exam.

**Permissions:** Admin, Staff (creator)

**Response:**
```json
{
  "success": true,
  "message": "Student removed from exam"
}
```

---

### Assign Halls to Exam

**POST** `/api/exams/[id]/assign-halls`

Assign one or more halls to an exam.

**Permissions:** Admin, Staff (creator)

**Request Body:**
```json
{
  "hall_ids": ["uuid-1", "uuid-2"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Halls assigned to exam successfully",
  "total_capacity": 80
}
```

---

### Get Exam Halls

**GET** `/api/exams/[id]/halls`

Get all halls assigned to an exam.

**Permissions:** Authenticated users

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "name": "Main Hall A",
      "total_seats": 40,
      "available_seats": 40
    }
  ]
}
```

---

### Allocate Seats

**POST** `/api/exams/[id]/allocate`

Run seat allocation algorithm for an exam.

**Permissions:** Admin, Staff (creator)

**Request Body:**
```json
{
  "pattern": "department_alternation"
}
```

**Pattern Options:**
- `department_alternation` - Different departments at same desk
- `course_alternation` - Different courses at same desk
- `year_alternation` - Different years at same desk
- `random` - Random placement

**Response:**
```json
{
  "success": true,
  "message": "Seats allocated successfully",
  "allocated": 45,
  "pattern": "department_alternation",
  "halls_used": 2
}
```

---

### Get Seating Assignments

**GET** `/api/exams/[id]/seating`

Get all seat assignments for an exam.

**Permissions:** Admin, Staff, Supervisor

**Query Parameters:**
- `hall_id` (optional) - Filter by specific hall

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "student": {
        "id": "uuid-here",
        "roll_number": "2024001",
        "name": "John Doe"
      },
      "hall": {
        "id": "uuid-here",
        "name": "Main Hall A"
      },
      "seat": {
        "id": "uuid-here",
        "seat_number": "3B",
        "row_number": 3,
        "col_number": 2
      },
      "is_manual": false,
      "assigned_at": "2024-12-01T00:00:00Z"
    }
  ]
}
```

---

### Update Seat Assignment (Manual Override)

**PATCH** `/api/exams/[id]/seating/[assignmentId]`

Manually reassign a student to a different seat.

**Permissions:** Admin, Staff (creator)

**Request Body:**
```json
{
  "seat_id": "new-seat-uuid",
  "hall_id": "hall-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "student_id": "uuid-here",
    "seat_id": "new-seat-uuid",
    "hall_id": "hall-uuid",
    "is_manual": true,
    "assigned_at": "2024-12-01T10:30:00Z"
  }
}
```

---

### Clear Seat Assignments

**DELETE** `/api/exams/[id]/seating`

Clear all seat assignments for an exam (for re-allocation).

**Permissions:** Admin, Staff (creator)

**Response:**
```json
{
  "success": true,
  "message": "All seat assignments cleared"
}
```

---

### Generate Hall Tickets

**GET** `/api/exams/[id]/hall-tickets`

Generate hall tickets for an exam.

**Permissions:** Admin, Staff (creator)

**Query Parameters:**
- `student_id` (optional) - Generate for specific student
- `format` (optional) - `pdf` (default) or `zip` (all students)

**Example (Single Student):** `/api/exams/[id]/hall-tickets?student_id=uuid-here`

**Example (All Students as ZIP):** `/api/exams/[id]/hall-tickets?format=zip`

**Response:**
- Single PDF: `Content-Type: application/pdf`
- ZIP archive: `Content-Type: application/zip`

**PDF Contains:**
- Institution header
- Student information (roll number, name, department)
- Exam details (subject, date, time, duration)
- Seating assignment (hall name, seat number)
- QR code with roll number
- Exam instructions

---

## User Management Endpoints

### List Users

**GET** `/api/admin/users`

Get all users in the system.

**Permissions:** Admin only

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "email": "admin@example.com",
      "role": "admin",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### Create User

**POST** `/api/admin/users`

Create a new user account.

**Permissions:** Admin only

**Request Body:**
```json
{
  "email": "newstaff@example.com",
  "password": "temporarypass123",
  "role": "staff",
  "department_ids": ["uuid-1", "uuid-2"]
}
```

**Role Options:** `admin`, `staff`, `supervisor`, `student`

**Note:** `department_ids` only applicable for staff role.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "email": "newstaff@example.com",
    "role": "staff",
    "created_at": "2024-01-15T00:00:00Z",
    "updated_at": "2024-01-15T00:00:00Z"
  }
}
```

---

### Get User

**GET** `/api/admin/users/[id]`

Get a single user by ID.

**Permissions:** Admin only

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "email": "staff@example.com",
    "role": "staff",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "permissions": [
      {
        "department_id": "uuid-here",
        "department_name": "Computer Science"
      }
    ]
  }
}
```

---

### Update User

**PATCH** `/api/admin/users/[id]`

Update an existing user.

**Permissions:** Admin only

**Request Body:**
```json
{
  "role": "admin",
  "department_ids": []
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "email": "staff@example.com",
    "role": "admin",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

---

### Delete User

**DELETE** `/api/admin/users/[id]`

Delete a user account.

**Permissions:** Admin only

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Dashboard Endpoints

### Get Dashboard Statistics

**GET** `/api/dashboard/stats`

Get role-specific dashboard statistics.

**Permissions:** Authenticated users

**Response (Admin/Staff):**
```json
{
  "success": true,
  "data": {
    "stats": {
      "students": 450,
      "exams": 12,
      "halls": 5,
      "upcoming": 3
    },
    "recentExams": [
      {
        "id": "uuid-here",
        "subject": "Programming Final",
        "exam_date": "2024-12-10",
        "status": "completed"
      }
    ],
    "upcomingExams": [
      {
        "id": "uuid-here",
        "subject": "Data Structures Midterm",
        "exam_date": "2024-12-20",
        "start_time": "14:00:00"
      }
    ]
  }
}
```

**Response (Student):**
```json
{
  "success": true,
  "data": {
    "stats": {
      "myExams": 5,
      "upcoming": 2
    },
    "upcomingExams": [
      {
        "id": "uuid-here",
        "subject": "Programming Final",
        "exam_date": "2024-12-15",
        "start_time": "10:00:00",
        "seat_assignment": {
          "hall_name": "Main Hall A",
          "seat_number": "3B"
        }
      }
    ]
  }
}
```

---

## Rate Limiting

Supabase implements rate limiting on the database level:
- **Free tier**: 500 requests per second
- **Pro tier**: 1000+ requests per second

No additional API-level rate limiting is implemented.

---

## Pagination

Endpoints that return lists support pagination via query parameters:

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50, max: 100)

**Example:** `/api/students?page=2&limit=25`

**Response includes pagination metadata:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 25,
    "total": 450,
    "totalPages": 18
  }
}
```

---

## Webhooks

Currently not implemented. Future feature for real-time notifications.

---

## API Versioning

Current version: **v1** (implicit, no version prefix in URLs)

Future versions will use URL prefixing: `/api/v2/...`

---

**Last Updated**: 2025-01-21
