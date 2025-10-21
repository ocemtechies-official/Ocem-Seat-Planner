-- ============================================================================
-- OCEM Seat Planner - Student User Creation Script
-- ============================================================================
-- Purpose: Create a student record and link it to a user account
-- Roll Number: 22530193
-- Course: BCA (Bachelor of Computer Applications)
-- ============================================================================

-- Prerequisites:
-- 1. BCA department must exist
-- 2. BCA course must exist
-- 3. Run this in Supabase SQL Editor

-- ============================================================================
-- STEP 1: Check if BCA Department and Course Exist
-- ============================================================================

-- Check departments
SELECT id, name, code FROM departments WHERE code = 'BCA' OR name ILIKE '%computer application%';

-- Check courses
SELECT id, name, code, department_id FROM courses WHERE code ILIKE 'BCA%';

-- ============================================================================
-- STEP 2: Create BCA Department (if it doesn't exist)
-- ============================================================================

-- Only run this if BCA department doesn't exist
INSERT INTO departments (id, name, code)
VALUES (
  gen_random_uuid(),
  'Computer Applications',
  'BCA'
)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- STEP 3: Create BCA Course (if it doesn't exist)
-- ============================================================================

-- Only run this if BCA course doesn't exist
-- Note: Update year and semester as needed
INSERT INTO courses (id, department_id, name, code, year, semester)
SELECT
  gen_random_uuid(),
  d.id,
  'Bachelor of Computer Applications',
  'BCA101',
  1,  -- Year 1
  1   -- Semester 1
FROM departments d
WHERE d.code = 'BCA'
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- STEP 4: Create Student Record
-- ============================================================================

-- Insert student record
-- Replace the email with actual student email
INSERT INTO students (
  id,
  roll_number,
  name,
  email,
  department_id,
  course_id,
  year,
  user_id,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  '22530193',                              -- Roll number
  'Student Name',                          -- Replace with actual name
  'student22530193@example.com',           -- Replace with actual email
  d.id,                                    -- Department ID (BCA)
  c.id,                                    -- Course ID (BCA101)
  1,                                       -- Year (1, 2, 3, or 4)
  NULL,                                    -- user_id will be linked later
  NOW(),
  NOW()
FROM departments d
JOIN courses c ON c.department_id = d.id
WHERE d.code = 'BCA' AND c.code = 'BCA101'
ON CONFLICT (roll_number) DO NOTHING;

-- Verify student created
SELECT
  s.id,
  s.roll_number,
  s.name,
  s.email,
  d.name as department,
  c.name as course,
  s.year,
  s.user_id
FROM students s
JOIN departments d ON d.id = s.department_id
JOIN courses c ON c.id = s.course_id
WHERE s.roll_number = '22530193';

-- ============================================================================
-- STEP 5: Create User Account in Supabase Auth
-- ============================================================================

-- Option A: Using Supabase Dashboard (Recommended)
-- -------------------------------------------------
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add User" > "Create new user"
-- 3. Enter:
--    - Email: student22530193@example.com
--    - Password: SecurePassword123! (give this to student)
--    - Auto Confirm User: ✓ (checked)
-- 4. Click "Create User"
-- 5. Copy the user UUID from the users list
-- 6. Continue to STEP 6 below

-- Option B: Using SQL (Advanced - requires admin privileges)
-- -----------------------------------------------------------
-- WARNING: This creates a user directly in auth.users table
-- Only use if you understand Supabase auth internals

-- Generate a secure password hash (replace 'SecurePassword123!' with desired password)
-- Note: Supabase uses bcrypt for password hashing

-- This is a simplified version - in production, use Supabase Dashboard
-- or Admin API to create users properly

-- ============================================================================
-- STEP 6: Link Student Record to User Account
-- ============================================================================

-- First, get the student ID
-- SELECT id FROM students WHERE roll_number = '22530193';

-- Get the auth user ID
-- SELECT id, email FROM auth.users WHERE email = 'student22530193@example.com';

-- Link student to user account
-- Replace 'USER_UUID_HERE' with the actual UUID from auth.users
UPDATE students
SET user_id = 'USER_UUID_HERE',  -- Replace with actual user UUID
    updated_at = NOW()
WHERE roll_number = '22530193';

-- Create user record in users table
INSERT INTO users (id, email, role, created_at, updated_at)
VALUES (
  'USER_UUID_HERE',                    -- Same UUID as auth.users
  'student22530193@example.com',       -- Student email
  'student',                           -- Role
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STEP 7: Verify Complete Setup
-- ============================================================================

-- Check everything is linked correctly
SELECT
  s.roll_number,
  s.name,
  s.email,
  s.year,
  d.name as department,
  c.name as course,
  u.role,
  au.email as auth_email,
  au.email_confirmed_at,
  CASE
    WHEN s.user_id IS NOT NULL THEN '✓ Linked'
    ELSE '✗ Not Linked'
  END as link_status
FROM students s
LEFT JOIN departments d ON d.id = s.department_id
LEFT JOIN courses c ON c.id = s.course_id
LEFT JOIN users u ON u.id = s.user_id
LEFT JOIN auth.users au ON au.id = s.user_id
WHERE s.roll_number = '22530193';

-- ============================================================================
-- STEP 8: Test Login (Student Portal Access)
-- ============================================================================

-- After setup, the student can:
-- 1. Go to application URL
-- 2. Click "Sign In"
-- 3. Enter:
--    - Email: student22530193@example.com
--    - Password: [the password you set]
-- 4. Should redirect to "My Exams" page
-- 5. Can view assigned exams and download hall tickets

-- ============================================================================
-- TROUBLESHOOTING
-- ============================================================================

-- If student cannot login:

-- 1. Check if auth user exists
SELECT id, email, email_confirmed_at, created_at
FROM auth.users
WHERE email = 'student22530193@example.com';

-- 2. Check if student record exists
SELECT * FROM students WHERE roll_number = '22530193';

-- 3. Check if user record exists in users table
SELECT * FROM users WHERE email = 'student22530193@example.com';

-- 4. Check if student is linked to user
SELECT
  s.roll_number,
  s.email,
  s.user_id,
  u.email as user_email
FROM students s
LEFT JOIN users u ON u.id = s.user_id
WHERE s.roll_number = '22530193';

-- 5. Check RLS policies are not blocking
-- Run as postgres/service_role:
SET ROLE postgres;
SELECT * FROM students WHERE roll_number = '22530193';
SELECT * FROM users WHERE email = 'student22530193@example.com';
RESET ROLE;

-- ============================================================================
-- QUICK CLEANUP (Use only if you need to start over)
-- ============================================================================

-- WARNING: This will delete the student and user
-- Only use for testing/development

-- Delete student record
-- DELETE FROM students WHERE roll_number = '22530193';

-- Delete user record
-- DELETE FROM users WHERE email = 'student22530193@example.com';

-- Delete auth user (requires admin)
-- DELETE FROM auth.users WHERE email = 'student22530193@example.com';

-- ============================================================================
-- COMPLETE EXAMPLE - ALL STEPS COMBINED
-- ============================================================================

-- This is a complete script that you can run in one go
-- Just replace placeholders with actual values

/*
BEGIN;

-- 1. Create/verify department
INSERT INTO departments (id, name, code)
VALUES (gen_random_uuid(), 'Computer Applications', 'BCA')
ON CONFLICT (code) DO NOTHING;

-- 2. Create/verify course
INSERT INTO courses (id, department_id, name, code, year, semester)
SELECT gen_random_uuid(), d.id, 'Bachelor of Computer Applications', 'BCA101', 1, 1
FROM departments d WHERE d.code = 'BCA'
ON CONFLICT (code) DO NOTHING;

-- 3. Create student record
INSERT INTO students (id, roll_number, name, email, department_id, course_id, year)
SELECT
  gen_random_uuid(),
  '22530193',
  'Student Name',
  'student22530193@example.com',
  d.id,
  c.id,
  1
FROM departments d
JOIN courses c ON c.department_id = d.id
WHERE d.code = 'BCA' AND c.code = 'BCA101'
ON CONFLICT (roll_number) DO NOTHING;

-- 4. Create auth user (do this via Supabase Dashboard)
-- Then get the user UUID and run:

-- UPDATE students
-- SET user_id = 'USER_UUID_HERE'
-- WHERE roll_number = '22530193';

-- INSERT INTO users (id, email, role)
-- VALUES ('USER_UUID_HERE', 'student22530193@example.com', 'student');

COMMIT;
*/

-- ============================================================================
-- NOTES
-- ============================================================================

-- 1. Always use Supabase Dashboard to create auth users
--    This ensures proper password hashing and email verification
--
-- 2. Student can also self-register:
--    - Go to /register page
--    - Enter roll number (22530193)
--    - Enter email and password
--    - System will automatically link to existing student record
--
-- 3. For bulk user creation, use the Admin User Management page
--    or write a custom script using Supabase Admin API
--
-- 4. Default password should be changed on first login
--    Implement password change in /profile/security page

-- ============================================================================
-- END OF SCRIPT
-- ============================================================================
