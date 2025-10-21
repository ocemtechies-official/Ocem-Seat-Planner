# Quick Reference: Create Student User (Roll No: 22530193, BCA)

## 🚀 Quickest Method: Use Supabase Dashboard + SQL

### Step 1: Create BCA Department & Course (One-time setup)

Run this in **Supabase SQL Editor**:

```sql
-- Create BCA Department
INSERT INTO departments (id, name, code)
VALUES (gen_random_uuid(), 'Computer Applications', 'BCA')
ON CONFLICT (code) DO NOTHING;

-- Create BCA Course
INSERT INTO courses (id, department_id, name, code, year, semester)
SELECT
  gen_random_uuid(),
  d.id,
  'Bachelor of Computer Applications',
  'BCA101',
  1,
  1
FROM departments d
WHERE d.code = 'BCA'
ON CONFLICT (code) DO NOTHING;
```

---

### Step 2: Create Student Record

Run this in **Supabase SQL Editor**:

```sql
-- Create student with roll number 22530193
INSERT INTO students (
  id,
  roll_number,
  name,
  email,
  department_id,
  course_id,
  year
)
SELECT
  gen_random_uuid(),
  '22530193',                              -- Roll number
  'John Doe',                              -- Replace with actual name
  'student22530193@example.com',           -- Replace with actual email
  d.id,
  c.id,
  1                                        -- Year 1
FROM departments d
JOIN courses c ON c.department_id = d.id
WHERE d.code = 'BCA' AND c.code = 'BCA101';
```

---

### Step 3: Create User Account

**Via Supabase Dashboard** (Recommended):

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add User"** → **"Create new user"**
3. Fill in:
   - **Email**: `student22530193@example.com`
   - **Password**: `BCA22530193!` (or any secure password)
   - **Auto Confirm User**: ✓ (Checked)
4. Click **"Create User"**
5. **Copy the User UUID** from the users list

---

### Step 4: Link Student to User

Run this in **Supabase SQL Editor** (replace `USER_UUID_HERE` with the UUID you copied):

```sql
-- Link student to user account
UPDATE students
SET user_id = 'USER_UUID_HERE'  -- Paste UUID from Step 3
WHERE roll_number = '22530193';

-- Create user record in users table
INSERT INTO users (id, email, role)
VALUES (
  'USER_UUID_HERE',              -- Same UUID
  'student22530193@example.com',
  'student'
);
```

---

### Step 5: Verify Setup

Run this to verify everything is correct:

```sql
SELECT
  s.roll_number,
  s.name,
  s.email,
  d.name as department,
  c.name as course,
  s.year,
  u.role,
  CASE WHEN s.user_id IS NOT NULL THEN '✓ Linked' ELSE '✗ Not Linked' END as status
FROM students s
JOIN departments d ON d.id = s.department_id
JOIN courses c ON c.id = s.course_id
LEFT JOIN users u ON u.id = s.user_id
WHERE s.roll_number = '22530193';
```

**Expected output:**
```
roll_number | name     | email                        | department             | course                          | year | role    | status
------------|----------|------------------------------|------------------------|----------------------------------|------|---------|--------
22530193    | John Doe | student22530193@example.com  | Computer Applications  | Bachelor of Computer Applications| 1    | student | ✓ Linked
```

---

### Step 6: Login & Test

1. Go to your application: `http://localhost:3000` (or your deployment URL)
2. Click **"Sign In"**
3. Enter:
   - **Email**: `student22530193@example.com`
   - **Password**: `BCA22530193!` (the password you set)
4. Click **"Sign In"**
5. Should redirect to **"My Exams"** page

**Success!** Student can now:
- View assigned exams
- Check seat assignments
- Download hall tickets

---

## 🔄 Alternative Method: Student Self-Registration

If you've already created the student record (Step 2 above), the student can register themselves:

1. Student goes to application URL
2. Clicks **"Sign In"** → **"Register"**
3. Fills in registration form:
   - **Roll Number**: `22530193`
   - **Email**: `student22530193@example.com`
   - **Password**: `BCA22530193!`
   - **Confirm Password**: `BCA22530193!`
4. Clicks **"Register"**
5. System automatically links to existing student record
6. Student is logged in

---

## 📝 Complete Copy-Paste Script

If you want to do everything in one go, copy and paste this entire script:

```sql
-- ============================================================================
-- COMPLETE SETUP - Roll Number 22530193 (BCA)
-- ============================================================================

-- 1. Create BCA Department
INSERT INTO departments (id, name, code)
VALUES (gen_random_uuid(), 'Computer Applications', 'BCA')
ON CONFLICT (code) DO NOTHING;

-- 2. Create BCA Course
INSERT INTO courses (id, department_id, name, code, year, semester)
SELECT gen_random_uuid(), d.id, 'Bachelor of Computer Applications', 'BCA101', 1, 1
FROM departments d WHERE d.code = 'BCA'
ON CONFLICT (code) DO NOTHING;

-- 3. Create Student Record
INSERT INTO students (id, roll_number, name, email, department_id, course_id, year)
SELECT
  gen_random_uuid(),
  '22530193',
  'John Doe',                              -- CHANGE THIS
  'student22530193@example.com',           -- CHANGE THIS
  d.id,
  c.id,
  1
FROM departments d
JOIN courses c ON c.department_id = d.id
WHERE d.code = 'BCA' AND c.code = 'BCA101'
ON CONFLICT (roll_number) DO NOTHING;

-- 4. NOW: Go to Supabase Dashboard and create auth user
--    Then come back and run Step 4 from above
```

---

## 🛠️ Using Node.js Script

If you prefer automation:

```bash
# Navigate to project directory
cd Ocem-Seat-Planner

# Set environment variables
export NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
export SUPABASE_SERVICE_ROLE_KEY="your-service-key"

# Run the script
node docs/scripts/create_student_user.js
```

The script will:
- Create department and course if they don't exist
- Create student record
- Create user account
- Link them together
- Verify setup

---

## 📊 Bulk Creation (Multiple Students)

If you need to create multiple BCA students:

```sql
-- Bulk insert students
INSERT INTO students (id, roll_number, name, email, department_id, course_id, year)
SELECT
  gen_random_uuid(),
  roll_num,
  student_name,
  student_email,
  d.id,
  c.id,
  1
FROM departments d
JOIN courses c ON c.department_id = d.id
CROSS JOIN (VALUES
  ('22530193', 'John Doe', 'student22530193@example.com'),
  ('22530194', 'Jane Smith', 'student22530194@example.com'),
  ('22530195', 'Bob Johnson', 'student22530195@example.com')
) AS students(roll_num, student_name, student_email)
WHERE d.code = 'BCA' AND c.code = 'BCA101'
ON CONFLICT (roll_number) DO NOTHING;
```

Then use **CSV Import** feature in the application for even easier bulk creation!

---

## ❓ Troubleshooting

### Student can't login

**Check 1: Does auth user exist?**
```sql
SELECT id, email, email_confirmed_at
FROM auth.users
WHERE email = 'student22530193@example.com';
```

**Check 2: Is student linked to user?**
```sql
SELECT roll_number, user_id
FROM students
WHERE roll_number = '22530193';
```

**Check 3: Does user record exist in users table?**
```sql
SELECT id, email, role
FROM users
WHERE email = 'student22530193@example.com';
```

### "Roll number not found" during self-registration

**Solution:** Student record must exist first. Run Step 2 from the main guide.

### "Roll number already linked"

**Solution:** This roll number is already linked to another account. Contact admin to unlink or use different email.

---

## 📞 Need Help?

- **SQL Scripts**: See `docs/scripts/create_student_user.sql`
- **Node.js Script**: See `docs/scripts/create_student_user.js`
- **Full Documentation**: See `docs/guides/ADMIN_GUIDE.md`
- **CSV Import**: See `docs/guides/CSV_IMPORT_GUIDE.md`

---

## ✅ Quick Checklist

Before student can login, ensure:

- [ ] BCA department exists
- [ ] BCA course exists
- [ ] Student record created (roll_number: 22530193)
- [ ] Auth user created in Supabase
- [ ] User record created in users table
- [ ] Student linked to user (user_id set)
- [ ] Email confirmed (if using email verification)

Once all checked, student can login! 🎉

---

**Last Updated**: 2025-01-21
