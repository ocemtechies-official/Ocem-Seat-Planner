# Database Schema Documentation

## Overview

The Ocem Seat Planner database consists of 11 tables organized to support student management, exam scheduling, hall configuration, and seat allocation. The database uses PostgreSQL with Row Level Security (RLS) for fine-grained access control.

## Entity Relationship Diagram

```
┌──────────────┐         ┌──────────────┐
│ departments  │◄────────│   courses    │
└──────┬───────┘         └──────┬───────┘
       │                        │
       │                        │
       │                 ┌──────▼───────┐         ┌──────────────┐
       │                 │   students   │◄────────│    users     │
       │                 └──────┬───────┘         └──────────────┘
       │                        │                          │
       │                        │                          │
       │                 ┌──────▼───────┐                 │
       │                 │exam_students │                 │
       │                 └──────┬───────┘                 │
       │                        │                          │
       │                 ┌──────▼───────┐                 │
       │                 │    exams     │◄────────────────┘
       │                 └──────┬───────┘
       │                        │
       │              ┌─────────┴────────┐
       │              │                  │
       │       ┌──────▼──────────┐  ┌───▼──────────────┐
       │       │exam_halls_      │  │  seat_          │
       │       │assignments      │  │  assignments    │
       │       └──────┬──────────┘  └───┬────────────┘
       │              │                  │
       │       ┌──────▼──────────┐  ┌───▼────────┐
       │       │  exam_halls     │  │   seats    │
       │       └─────────────────┘  └────────────┘
       │
       │        ┌──────────────────┐
       └────────►staff_permissions │
                └──────────────────┘
```

## Tables

### 1. users

**Purpose**: User authentication and role management (integrates with Supabase Auth)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Unique user identifier (from Supabase Auth) |
| email | text | UNIQUE, NOT NULL | User email address |
| role | user_role | NOT NULL | User role (admin, staff, supervisor, student) |
| created_at | timestamp | DEFAULT now() | Account creation time |
| updated_at | timestamp | DEFAULT now() | Last update time |

**Enums:**
```sql
CREATE TYPE user_role AS ENUM ('admin', 'staff', 'supervisor', 'student');
```

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE index on `email`
- Index on `role`

**Row Level Security:**
```sql
-- Users can read their own record
CREATE POLICY "Users can read own record" ON users
  FOR SELECT USING (auth.uid() = id);

-- Admins can read all users
CREATE POLICY "Admins can read all users" ON users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );
```

---

### 2. departments

**Purpose**: Academic departments (Computer Science, Mathematics, etc.)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Unique department identifier |
| name | text | UNIQUE, NOT NULL | Department name |
| code | text | UNIQUE, NOT NULL | Short code (e.g., "CS", "MATH") |
| created_at | timestamp | DEFAULT now() | Creation time |
| updated_at | timestamp | DEFAULT now() | Last update time |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE index on `name`
- UNIQUE index on `code`

**Row Level Security:**
```sql
-- All authenticated users can read departments
CREATE POLICY "Authenticated users can read departments" ON departments
  FOR SELECT TO authenticated USING (true);

-- Only admins can insert/update/delete departments
CREATE POLICY "Admins can manage departments" ON departments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );
```

---

### 3. courses

**Purpose**: Individual courses within departments

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Unique course identifier |
| department_id | uuid | FK → departments, NOT NULL | Parent department |
| name | text | NOT NULL | Course name |
| code | text | UNIQUE, NOT NULL | Course code (e.g., "CS101") |
| year | integer | NOT NULL, CHECK (year BETWEEN 1 AND 4) | Academic year level |
| semester | integer | NOT NULL, CHECK (semester IN (1, 2)) | Semester number |
| created_at | timestamp | DEFAULT now() | Creation time |
| updated_at | timestamp | DEFAULT now() | Last update time |

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY on `department_id` → departments(id) ON DELETE CASCADE
- UNIQUE index on `code`
- Index on `department_id`

**Row Level Security:**
```sql
-- All authenticated users can read courses
CREATE POLICY "Authenticated users can read courses" ON courses
  FOR SELECT TO authenticated USING (true);

-- Only admins can insert/update/delete courses
CREATE POLICY "Admins can manage courses" ON courses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );
```

---

### 4. students

**Purpose**: Student records (can exist without user account)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Unique student identifier |
| roll_number | text | UNIQUE, NOT NULL | Student roll/ID number |
| name | text | NOT NULL | Full name |
| email | text | | Contact email (nullable) |
| department_id | uuid | FK → departments, NOT NULL | Student's department |
| course_id | uuid | FK → courses, NOT NULL | Current course |
| year | integer | NOT NULL, CHECK (year BETWEEN 1 AND 4) | Current year |
| user_id | uuid | FK → users, UNIQUE | Linked user account (nullable) |
| created_at | timestamp | DEFAULT now() | Creation time |
| updated_at | timestamp | DEFAULT now() | Last update time |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE index on `roll_number`
- UNIQUE index on `user_id` (one student per user)
- Index on `department_id`
- Index on `course_id`
- Index on `email`

**Row Level Security:**
```sql
-- Students can read only their own record
CREATE POLICY "Students can read own record" ON students
  FOR SELECT USING (user_id = auth.uid());

-- Staff can read students in their assigned departments
CREATE POLICY "Staff can read assigned students" ON students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM staff_permissions sp
      JOIN users u ON u.id = auth.uid()
      WHERE sp.user_id = auth.uid()
        AND sp.department_id = students.department_id
        AND u.role = 'staff'
    )
  );

-- Admins can read all students
CREATE POLICY "Admins can read all students" ON students
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Staff and admins can insert/update students
CREATE POLICY "Staff and admins can manage students" ON students
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'staff')
    )
  );
```

---

### 5. exam_halls

**Purpose**: Physical exam halls/rooms

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Unique hall identifier |
| name | text | UNIQUE, NOT NULL | Hall name (e.g., "Main Hall A") |
| total_seats | integer | NOT NULL | Total seating capacity |
| rows | integer | NOT NULL | Number of rows |
| columns | integer | NOT NULL | Number of columns per row |
| layout_config | jsonb | | Custom layout configuration |
| created_at | timestamp | DEFAULT now() | Creation time |
| updated_at | timestamp | DEFAULT now() | Last update time |

**Layout Config JSON Structure:**
```json
{
  "type": "grid",
  "rows": 10,
  "columns": 8,
  "seats_per_desk": 2,
  "unusable_seats": ["A1", "C5", "J8"]
}
```

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE index on `name`

**Row Level Security:**
```sql
-- All authenticated users can read halls
CREATE POLICY "Authenticated users can read halls" ON exam_halls
  FOR SELECT TO authenticated USING (true);

-- Only admins and staff can manage halls
CREATE POLICY "Admins and staff can manage halls" ON exam_halls
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'staff')
    )
  );
```

---

### 6. seats

**Purpose**: Individual seats within halls

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Unique seat identifier |
| hall_id | uuid | FK → exam_halls, NOT NULL | Parent hall |
| seat_number | text | NOT NULL | Display name (e.g., "A1", "B12") |
| row_number | integer | NOT NULL | Physical row position |
| col_number | integer | NOT NULL | Physical column position |
| is_usable | boolean | DEFAULT true | Can seat be used? |
| created_at | timestamp | DEFAULT now() | Creation time |
| updated_at | timestamp | DEFAULT now() | Last update time |

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY on `hall_id` → exam_halls(id) ON DELETE CASCADE
- UNIQUE constraint on (`hall_id`, `seat_number`)
- Index on `hall_id`
- Index on (`row_number`, `col_number`)

**Row Level Security:**
```sql
-- All authenticated users can read seats
CREATE POLICY "Authenticated users can read seats" ON seats
  FOR SELECT TO authenticated USING (true);

-- Only admins and staff can update seats (usable status)
CREATE POLICY "Admins and staff can update seats" ON seats
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'staff')
    )
  );
```

---

### 7. exams

**Purpose**: Exam events

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Unique exam identifier |
| subject | text | NOT NULL | Exam subject/title |
| course_id | uuid | FK → courses, NOT NULL | Related course |
| exam_date | date | NOT NULL | Date of exam |
| start_time | time | NOT NULL | Start time |
| duration_minutes | integer | NOT NULL | Exam duration in minutes |
| status | exam_status | DEFAULT 'draft' | Exam status |
| created_by | uuid | FK → users, NOT NULL | User who created exam |
| created_at | timestamp | DEFAULT now() | Creation time |
| updated_at | timestamp | DEFAULT now() | Last update time |

**Enums:**
```sql
CREATE TYPE exam_status AS ENUM ('draft', 'scheduled', 'completed', 'cancelled');
```

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY on `course_id` → courses(id) ON DELETE RESTRICT
- FOREIGN KEY on `created_by` → users(id)
- Index on `course_id`
- Index on `exam_date`
- Index on `status`
- Index on `created_by`

**Row Level Security:**
```sql
-- All authenticated users can read exams
CREATE POLICY "Authenticated users can read exams" ON exams
  FOR SELECT TO authenticated USING (true);

-- Staff can create exams for their assigned departments
CREATE POLICY "Staff can create exams" ON exams
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      JOIN staff_permissions sp ON sp.user_id = u.id
      JOIN courses c ON c.id = exams.course_id
      WHERE u.id = auth.uid()
        AND u.role = 'staff'
        AND sp.department_id = c.department_id
    )
  );

-- Admins can create any exam
CREATE POLICY "Admins can create any exam" ON exams
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );
```

---

### 8. exam_students

**Purpose**: Many-to-many relationship between exams and students

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Unique assignment identifier |
| exam_id | uuid | FK → exams, NOT NULL | Related exam |
| student_id | uuid | FK → students, NOT NULL | Related student |
| created_at | timestamp | DEFAULT now() | Assignment time |

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY on `exam_id` → exams(id) ON DELETE CASCADE
- FOREIGN KEY on `student_id` → students(id) ON DELETE CASCADE
- UNIQUE constraint on (`exam_id`, `student_id`)
- Index on `exam_id`
- Index on `student_id`

**Row Level Security:**
```sql
-- Students can read only their own exam assignments
CREATE POLICY "Students can read own exam assignments" ON exam_students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = exam_students.student_id
      AND students.user_id = auth.uid()
    )
  );

-- Staff and admins can read all exam assignments
CREATE POLICY "Staff and admins can read exam assignments" ON exam_students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'staff', 'supervisor')
    )
  );

-- Staff and admins can manage exam assignments
CREATE POLICY "Staff and admins can manage exam assignments" ON exam_students
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'staff')
    )
  );
```

---

### 9. exam_halls_assignments

**Purpose**: Track which halls are used for which exams (supports multiple halls per exam)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Unique assignment identifier |
| exam_id | uuid | FK → exams, NOT NULL | Related exam |
| hall_id | uuid | FK → exam_halls, NOT NULL | Related hall |
| created_at | timestamp | DEFAULT now() | Assignment time |

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY on `exam_id` → exams(id) ON DELETE CASCADE
- FOREIGN KEY on `hall_id` → exam_halls(id) ON DELETE RESTRICT
- UNIQUE constraint on (`exam_id`, `hall_id`)
- Index on `exam_id`
- Index on `hall_id`

**Row Level Security:**
```sql
-- All authenticated users can read hall assignments
CREATE POLICY "Authenticated users can read hall assignments" ON exam_halls_assignments
  FOR SELECT TO authenticated USING (true);

-- Staff and admins can manage hall assignments
CREATE POLICY "Staff and admins can manage hall assignments" ON exam_halls_assignments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'staff')
    )
  );
```

---

### 10. seat_assignments

**Purpose**: Final seat allocations for students in exams

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Unique assignment identifier |
| exam_id | uuid | FK → exams, NOT NULL | Related exam |
| student_id | uuid | FK → students, NOT NULL | Related student |
| seat_id | uuid | FK → seats, NOT NULL | Assigned seat |
| hall_id | uuid | FK → exam_halls, NOT NULL | Assigned hall |
| assigned_at | timestamp | DEFAULT now() | When allocation was made |
| assigned_by | uuid | FK → users, NOT NULL | Who made the assignment |
| is_manual | boolean | DEFAULT false | Manual override or auto-generated |
| created_at | timestamp | DEFAULT now() | Creation time |
| updated_at | timestamp | DEFAULT now() | Last update time |

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY on `exam_id` → exams(id) ON DELETE CASCADE
- FOREIGN KEY on `student_id` → students(id) ON DELETE CASCADE
- FOREIGN KEY on `seat_id` → seats(id) ON DELETE RESTRICT
- FOREIGN KEY on `hall_id` → exam_halls(id) ON DELETE RESTRICT
- FOREIGN KEY on `assigned_by` → users(id)
- UNIQUE constraint on (`exam_id`, `student_id`) - One seat per student per exam
- UNIQUE constraint on (`exam_id`, `seat_id`) - One student per seat per exam
- Index on `exam_id`
- Index on `student_id`
- Index on `hall_id`

**Row Level Security:**
```sql
-- Students can read only their own seat assignments
CREATE POLICY "Students can read own seat assignments" ON seat_assignments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = seat_assignments.student_id
      AND students.user_id = auth.uid()
    )
  );

-- Staff can read seat assignments for exams they created
CREATE POLICY "Staff can read exam seat assignments" ON seat_assignments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN exams e ON e.id = seat_assignments.exam_id
      WHERE u.id = auth.uid()
        AND u.role IN ('staff', 'supervisor')
    )
  );

-- Admins can read all seat assignments
CREATE POLICY "Admins can read all seat assignments" ON seat_assignments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Staff and admins can manage seat assignments
CREATE POLICY "Staff and admins can manage seat assignments" ON seat_assignments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'staff')
    )
  );
```

---

### 11. staff_permissions

**Purpose**: Department access control for staff users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Unique permission identifier |
| user_id | uuid | FK → users, NOT NULL | Staff user |
| department_id | uuid | FK → departments, NOT NULL | Accessible department |
| created_at | timestamp | DEFAULT now() | Permission granted time |

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY on `user_id` → users(id) ON DELETE CASCADE
- FOREIGN KEY on `department_id` → departments(id) ON DELETE CASCADE
- UNIQUE constraint on (`user_id`, `department_id`)
- Index on `user_id`
- Index on `department_id`

**Row Level Security:**
```sql
-- Staff can read their own permissions
CREATE POLICY "Staff can read own permissions" ON staff_permissions
  FOR SELECT USING (user_id = auth.uid());

-- Admins can read all permissions
CREATE POLICY "Admins can read all permissions" ON staff_permissions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Only admins can insert/update/delete permissions
CREATE POLICY "Admins can manage permissions" ON staff_permissions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );
```

---

## Relationships Summary

### One-to-Many Relationships

1. **departments → courses**: One department has many courses
2. **departments → students**: One department has many students
3. **courses → students**: One course has many students
4. **courses → exams**: One course has many exams
5. **exam_halls → seats**: One hall has many seats
6. **exams → exam_students**: One exam has many student assignments
7. **exams → exam_halls_assignments**: One exam can use many halls
8. **exams → seat_assignments**: One exam has many seat assignments
9. **students → exam_students**: One student can be in many exams
10. **students → seat_assignments**: One student has many seat assignments
11. **users → staff_permissions**: One staff user can have many department permissions

### One-to-One Relationships

1. **users → students**: One user can link to one student (nullable)

### Many-to-Many Relationships

1. **exams ↔ students**: Via `exam_students` table
2. **exams ↔ exam_halls**: Via `exam_halls_assignments` table
3. **users ↔ departments** (staff): Via `staff_permissions` table

---

## Common Queries

### Get all students in a department

```sql
SELECT s.*
FROM students s
JOIN departments d ON d.id = s.department_id
WHERE d.code = 'CS'
ORDER BY s.roll_number;
```

### Get all exams for a student

```sql
SELECT e.*, c.name as course_name
FROM exams e
JOIN exam_students es ON es.exam_id = e.id
JOIN courses c ON c.id = e.course_id
WHERE es.student_id = 'student-uuid-here'
ORDER BY e.exam_date;
```

### Get seat assignment for a student in an exam

```sql
SELECT
  s.roll_number,
  s.name as student_name,
  e.subject as exam_subject,
  eh.name as hall_name,
  st.seat_number
FROM seat_assignments sa
JOIN students s ON s.id = sa.student_id
JOIN exams e ON e.id = sa.exam_id
JOIN exam_halls eh ON eh.id = sa.hall_id
JOIN seats st ON st.id = sa.seat_id
WHERE sa.exam_id = 'exam-uuid-here'
  AND sa.student_id = 'student-uuid-here';
```

### Get all students assigned to an exam with their seats

```sql
SELECT
  s.roll_number,
  s.name as student_name,
  eh.name as hall_name,
  st.seat_number,
  sa.is_manual
FROM seat_assignments sa
JOIN students s ON s.id = sa.student_id
JOIN exam_halls eh ON eh.id = sa.hall_id
JOIN seats st ON st.id = sa.seat_id
WHERE sa.exam_id = 'exam-uuid-here'
ORDER BY eh.name, st.row_number, st.col_number;
```

### Get available seats in a hall (not assigned for an exam)

```sql
SELECT s.*
FROM seats s
WHERE s.hall_id = 'hall-uuid-here'
  AND s.is_usable = true
  AND s.id NOT IN (
    SELECT seat_id
    FROM seat_assignments
    WHERE exam_id = 'exam-uuid-here'
  )
ORDER BY s.row_number, s.col_number;
```

### Get staff permissions (departments accessible by a staff user)

```sql
SELECT d.*
FROM departments d
JOIN staff_permissions sp ON sp.department_id = d.id
WHERE sp.user_id = 'staff-user-uuid-here'
ORDER BY d.name;
```

---

## Migration File

The complete database schema is defined in the migration file located at:
```
supabase/migrations/001_initial_schema.sql
```

This file includes:
- All table definitions
- All indexes and constraints
- All Row Level Security policies
- Enum type definitions

To apply the migration to a new Supabase project:
1. Navigate to Supabase SQL Editor
2. Copy and execute the contents of `001_initial_schema.sql`
3. Verify all tables and policies are created

---

## Database Maintenance

### Regular Tasks

**Weekly:**
- Monitor table sizes
- Review slow query logs

**Monthly:**
- Analyze query patterns
- Update indexes if needed
- Review RLS policy performance

**Quarterly:**
- Archive old exam data (completed exams older than 2 years)
- Vacuum and analyze tables
- Review and optimize storage

### Performance Monitoring

**Key Metrics:**
- Query execution time
- Connection pool usage
- Table scan ratios
- Index hit ratios

**Tools:**
- Supabase Dashboard (built-in monitoring)
- PostgreSQL pg_stat_statements
- EXPLAIN ANALYZE for slow queries

---

**Last Updated**: 2025-01-21
