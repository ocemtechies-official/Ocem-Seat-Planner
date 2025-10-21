/**
 * OCEM Seat Planner - Student User Creation Script (Node.js)
 * ===========================================================
 *
 * Purpose: Create a student with roll number 22530193 (BCA) and user account
 *
 * Requirements:
 * - Node.js 18+
 * - @supabase/supabase-js installed
 * - Environment variables configured
 *
 * Usage:
 *   node docs/scripts/create_student_user.js
 */

import { createClient } from '@supabase/supabase-js'

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-project-url'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-key'

// Student data
const STUDENT_DATA = {
  rollNumber: '22530193',
  name: 'John Doe',                    // Replace with actual name
  email: 'student22530193@example.com', // Replace with actual email
  password: 'SecurePassword123!',       // Replace with secure password
  departmentCode: 'BCA',
  departmentName: 'Computer Applications',
  courseCode: 'BCA101',
  courseName: 'Bachelor of Computer Applications',
  year: 1,
  semester: 1
}

// Initialize Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

/**
 * Main function to create student and user
 */
async function createStudentUser() {
  try {
    console.log('🚀 Starting student user creation...')
    console.log(`📋 Roll Number: ${STUDENT_DATA.rollNumber}`)
    console.log(`👤 Name: ${STUDENT_DATA.name}`)
    console.log(`📧 Email: ${STUDENT_DATA.email}`)
    console.log('')

    // Step 1: Create or get department
    console.log('📂 Step 1: Creating/checking department...')
    const department = await createOrGetDepartment()
    console.log(`✓ Department: ${department.name} (${department.code})`)
    console.log('')

    // Step 2: Create or get course
    console.log('📚 Step 2: Creating/checking course...')
    const course = await createOrGetCourse(department.id)
    console.log(`✓ Course: ${course.name} (${course.code})`)
    console.log('')

    // Step 3: Check if student already exists
    console.log('🔍 Step 3: Checking if student exists...')
    const existingStudent = await checkStudentExists()
    if (existingStudent) {
      console.log(`⚠️  Student with roll number ${STUDENT_DATA.rollNumber} already exists`)
      console.log('ℹ️  Student details:')
      console.log(`   - ID: ${existingStudent.id}`)
      console.log(`   - Name: ${existingStudent.name}`)
      console.log(`   - Email: ${existingStudent.email}`)
      console.log(`   - Linked to user: ${existingStudent.user_id ? 'Yes' : 'No'}`)

      if (existingStudent.user_id) {
        console.log('')
        console.log('✓ Student already has a user account. Login credentials:')
        console.log(`   Email: ${existingStudent.email}`)
        console.log(`   Password: [Set during account creation]`)
        console.log('')
        console.log('🎉 Setup complete! Student can now login.')
        return
      } else {
        console.log('')
        console.log('ℹ️  Student exists but not linked to user. Creating user account...')
        const user = await createUserAccount()
        await linkStudentToUser(existingStudent.id, user.id)
        console.log('')
        console.log('✓ Student linked to user account')
        console.log('🎉 Setup complete!')
        return
      }
    }
    console.log('✓ Student does not exist, proceeding with creation')
    console.log('')

    // Step 4: Create student record
    console.log('👨‍🎓 Step 4: Creating student record...')
    const student = await createStudent(department.id, course.id)
    console.log(`✓ Student created with ID: ${student.id}`)
    console.log('')

    // Step 5: Create user account
    console.log('🔐 Step 5: Creating user account...')
    const user = await createUserAccount()
    console.log(`✓ User account created with ID: ${user.id}`)
    console.log('')

    // Step 6: Link student to user
    console.log('🔗 Step 6: Linking student to user account...')
    await linkStudentToUser(student.id, user.id)
    console.log('✓ Student linked to user account')
    console.log('')

    // Step 7: Verify setup
    console.log('✅ Step 7: Verifying setup...')
    await verifySetup()
    console.log('')

    // Success message
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🎉 SUCCESS! Student user created successfully')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    console.log('📝 Student can now login with:')
    console.log(`   Email: ${STUDENT_DATA.email}`)
    console.log(`   Password: ${STUDENT_DATA.password}`)
    console.log('')
    console.log('🔗 Next steps:')
    console.log('   1. Student should login and change password')
    console.log('   2. Assign student to exams')
    console.log('   3. Allocate seats when exam is ready')
    console.log('   4. Student can download hall ticket')
    console.log('')

  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error('Details:', error)
    process.exit(1)
  }
}

/**
 * Create or get department
 */
async function createOrGetDepartment() {
  // Check if exists
  const { data: existing } = await supabase
    .from('departments')
    .select('*')
    .eq('code', STUDENT_DATA.departmentCode)
    .single()

  if (existing) {
    return existing
  }

  // Create new
  const { data, error } = await supabase
    .from('departments')
    .insert({
      name: STUDENT_DATA.departmentName,
      code: STUDENT_DATA.departmentCode
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Create or get course
 */
async function createOrGetCourse(departmentId) {
  // Check if exists
  const { data: existing } = await supabase
    .from('courses')
    .select('*')
    .eq('code', STUDENT_DATA.courseCode)
    .single()

  if (existing) {
    return existing
  }

  // Create new
  const { data, error } = await supabase
    .from('courses')
    .insert({
      department_id: departmentId,
      name: STUDENT_DATA.courseName,
      code: STUDENT_DATA.courseCode,
      year: STUDENT_DATA.year,
      semester: STUDENT_DATA.semester
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Check if student exists
 */
async function checkStudentExists() {
  const { data } = await supabase
    .from('students')
    .select('*')
    .eq('roll_number', STUDENT_DATA.rollNumber)
    .single()

  return data
}

/**
 * Create student record
 */
async function createStudent(departmentId, courseId) {
  const { data, error } = await supabase
    .from('students')
    .insert({
      roll_number: STUDENT_DATA.rollNumber,
      name: STUDENT_DATA.name,
      email: STUDENT_DATA.email,
      department_id: departmentId,
      course_id: courseId,
      year: STUDENT_DATA.year,
      user_id: null // Will be linked later
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Create user account in Supabase Auth
 */
async function createUserAccount() {
  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: STUDENT_DATA.email,
    password: STUDENT_DATA.password,
    email_confirm: true, // Auto-confirm email
    user_metadata: {
      roll_number: STUDENT_DATA.rollNumber,
      name: STUDENT_DATA.name
    }
  })

  if (authError) throw authError

  // Create user record in users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert({
      id: authData.user.id,
      email: STUDENT_DATA.email,
      role: 'student'
    })
    .select()
    .single()

  if (userError) throw userError

  return authData.user
}

/**
 * Link student record to user account
 */
async function linkStudentToUser(studentId, userId) {
  const { error } = await supabase
    .from('students')
    .update({ user_id: userId })
    .eq('id', studentId)

  if (error) throw error
}

/**
 * Verify complete setup
 */
async function verifySetup() {
  const { data, error } = await supabase
    .from('students')
    .select(`
      id,
      roll_number,
      name,
      email,
      year,
      user_id,
      departments (name, code),
      courses (name, code)
    `)
    .eq('roll_number', STUDENT_DATA.rollNumber)
    .single()

  if (error) throw error

  console.log('✓ Verification successful:')
  console.log(`   - Student ID: ${data.id}`)
  console.log(`   - Roll Number: ${data.roll_number}`)
  console.log(`   - Name: ${data.name}`)
  console.log(`   - Email: ${data.email}`)
  console.log(`   - Department: ${data.departments.name}`)
  console.log(`   - Course: ${data.courses.name}`)
  console.log(`   - Year: ${data.year}`)
  console.log(`   - User ID: ${data.user_id}`)
  console.log(`   - User Linked: ${data.user_id ? 'Yes ✓' : 'No ✗'}`)
}

// Run the script
createStudentUser()
