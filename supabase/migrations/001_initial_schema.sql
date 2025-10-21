-- OCEM Seat Planner Database Schema
-- Initial Migration: Create all tables, indexes, and RLS policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. DEPARTMENTS TABLE
-- ============================================
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 2. COURSES TABLE
-- ============================================
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  year INTEGER NOT NULL CHECK (year >= 1 AND year <= 4),
  semester INTEGER NOT NULL CHECK (semester IN (1, 2)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_courses_department_id ON courses(department_id);

-- ============================================
-- 3. USERS TABLE (extends Supabase auth.users)
-- ============================================
CREATE TYPE user_role AS ENUM ('admin', 'staff', 'supervisor', 'student');

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 4. STUDENTS TABLE
-- ============================================
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  roll_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT,
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  year INTEGER NOT NULL CHECK (year >= 1 AND year <= 4),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_students_roll_number ON students(roll_number);
CREATE INDEX idx_students_department_id ON students(department_id);
CREATE INDEX idx_students_course_id ON students(course_id);
CREATE INDEX idx_students_user_id ON students(user_id);

-- ============================================
-- 5. EXAM HALLS TABLE
-- ============================================
CREATE TABLE exam_halls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  total_seats INTEGER NOT NULL,
  rows INTEGER NOT NULL,
  columns INTEGER NOT NULL,
  layout_config JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 6. SEATS TABLE
-- ============================================
CREATE TABLE seats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hall_id UUID NOT NULL REFERENCES exam_halls(id) ON DELETE CASCADE,
  seat_number TEXT NOT NULL,
  row_number INTEGER NOT NULL,
  col_number INTEGER NOT NULL,
  is_usable BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(hall_id, seat_number)
);

CREATE INDEX idx_seats_hall_id ON seats(hall_id);

-- ============================================
-- 7. EXAMS TABLE
-- ============================================
CREATE TYPE exam_status AS ENUM ('draft', 'scheduled', 'completed', 'cancelled');

CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT NOT NULL,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  exam_date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  status exam_status NOT NULL DEFAULT 'draft',
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_exams_course_id ON exams(course_id);
CREATE INDEX idx_exams_exam_date ON exams(exam_date);
CREATE INDEX idx_exams_status ON exams(status);

-- ============================================
-- 8. EXAM_STUDENTS TABLE (Many-to-Many)
-- ============================================
CREATE TABLE exam_students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(exam_id, student_id)
);

CREATE INDEX idx_exam_students_exam_id ON exam_students(exam_id);
CREATE INDEX idx_exam_students_student_id ON exam_students(student_id);

-- ============================================
-- 9. EXAM_HALLS_ASSIGNMENTS TABLE
-- ============================================
CREATE TABLE exam_halls_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  hall_id UUID NOT NULL REFERENCES exam_halls(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(exam_id, hall_id)
);

CREATE INDEX idx_exam_halls_assignments_exam_id ON exam_halls_assignments(exam_id);

-- ============================================
-- 10. SEAT_ASSIGNMENTS TABLE
-- ============================================
CREATE TABLE seat_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  seat_id UUID NOT NULL REFERENCES seats(id) ON DELETE CASCADE,
  hall_id UUID NOT NULL REFERENCES exam_halls(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  assigned_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_manual BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(exam_id, student_id),
  UNIQUE(exam_id, seat_id)
);

CREATE INDEX idx_seat_assignments_exam_id ON seat_assignments(exam_id);
CREATE INDEX idx_seat_assignments_student_id ON seat_assignments(student_id);

-- ============================================
-- 11. STAFF_PERMISSIONS TABLE
-- ============================================
CREATE TABLE staff_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, department_id)
);

CREATE INDEX idx_staff_permissions_user_id ON staff_permissions(user_id);

-- ============================================
-- TRIGGERS: Auto-update updated_at timestamps
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exam_halls_updated_at BEFORE UPDATE ON exam_halls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seats_updated_at BEFORE UPDATE ON seats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON exams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seat_assignments_updated_at BEFORE UPDATE ON seat_assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_halls ENABLE ROW LEVEL SECURITY;
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_halls_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE seat_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_permissions ENABLE ROW LEVEL SECURITY;

-- USERS TABLE POLICIES
CREATE POLICY "Users can read their own record"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- STUDENTS TABLE POLICIES
CREATE POLICY "Students can read their own record"
  ON students FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all students"
  ON students FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Staff can read students in their departments"
  ON students FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      INNER JOIN staff_permissions ON staff_permissions.user_id = users.id
      WHERE users.id = auth.uid()
        AND users.role = 'staff'
        AND staff_permissions.department_id = students.department_id
    )
  );

CREATE POLICY "Admins and staff can insert students"
  ON students FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Admins and staff can update students"
  ON students FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Admins can delete students"
  ON students FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- DEPARTMENTS TABLE POLICIES
CREATE POLICY "All authenticated users can read departments"
  ON departments FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can insert departments"
  ON departments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update departments"
  ON departments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete departments"
  ON departments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- COURSES TABLE POLICIES
CREATE POLICY "All authenticated users can read courses"
  ON courses FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can insert courses"
  ON courses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update courses"
  ON courses FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete courses"
  ON courses FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- EXAM_HALLS TABLE POLICIES
CREATE POLICY "All authenticated users can read exam halls"
  ON exam_halls FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and staff can insert exam halls"
  ON exam_halls FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Admins and staff can update exam halls"
  ON exam_halls FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Only admins can delete exam halls"
  ON exam_halls FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- SEATS TABLE POLICIES
CREATE POLICY "All authenticated users can read seats"
  ON seats FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and staff can modify seats"
  ON seats FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'staff')
    )
  );

-- EXAMS TABLE POLICIES
CREATE POLICY "All authenticated users can read exams"
  ON exams FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and staff can create exams"
  ON exams FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Admins and exam creators can update exams"
  ON exams FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
        AND (users.role = 'admin' OR exams.created_by = users.id)
    )
  );

CREATE POLICY "Only admins can delete exams"
  ON exams FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- EXAM_STUDENTS TABLE POLICIES
CREATE POLICY "All authenticated users can read exam students"
  ON exam_students FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and staff can manage exam students"
  ON exam_students FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'staff')
    )
  );

-- EXAM_HALLS_ASSIGNMENTS TABLE POLICIES
CREATE POLICY "All authenticated users can read exam hall assignments"
  ON exam_halls_assignments FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and staff can manage exam hall assignments"
  ON exam_halls_assignments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'staff')
    )
  );

-- SEAT_ASSIGNMENTS TABLE POLICIES
CREATE POLICY "Students can read their own seat assignments"
  ON seat_assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = seat_assignments.student_id
        AND students.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins and staff can read all seat assignments"
  ON seat_assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'staff', 'supervisor')
    )
  );

CREATE POLICY "Admins and staff can manage seat assignments"
  ON seat_assignments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Admins and staff can update seat assignments"
  ON seat_assignments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'staff')
    )
  );

-- STAFF_PERMISSIONS TABLE POLICIES
CREATE POLICY "Staff can read their own permissions"
  ON staff_permissions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all staff permissions"
  ON staff_permissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage staff permissions"
  ON staff_permissions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- ============================================
-- FUNCTIONS: Helper functions for auth
-- ============================================

-- Function to automatically create user record on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, 'student');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user record on auth signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SEED DATA: Initial admin user and sample data
-- ============================================
-- Note: Admin user should be created manually via Supabase dashboard
-- Then their role can be updated to 'admin' in the users table
