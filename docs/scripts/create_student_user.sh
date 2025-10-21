#!/bin/bash

# ============================================================================
# OCEM Seat Planner - Student User Creation Script (Bash)
# ============================================================================
# Purpose: Create student with roll number 22530193 (BCA) and user account
# Requirements: curl, jq (optional for pretty output)
# Usage: ./docs/scripts/create_student_user.sh
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration - UPDATE THESE VALUES
SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-https://your-project.supabase.co}"
SUPABASE_SERVICE_KEY="${SUPABASE_SERVICE_ROLE_KEY:-your-service-role-key}"

# Student data - UPDATE THESE VALUES
ROLL_NUMBER="22530193"
STUDENT_NAME="John Doe"
STUDENT_EMAIL="student22530193@example.com"
STUDENT_PASSWORD="BCA22530193!"
DEPARTMENT_CODE="BCA"
DEPARTMENT_NAME="Computer Applications"
COURSE_CODE="BCA101"
COURSE_NAME="Bachelor of Computer Applications"
YEAR=1
SEMESTER=1

# ============================================================================
# Helper Functions
# ============================================================================

print_header() {
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

print_info() {
  echo -e "${YELLOW}ℹ $1${NC}"
}

check_requirements() {
  print_header "Checking Requirements"

  # Check if curl is installed
  if ! command -v curl &> /dev/null; then
    print_error "curl is not installed. Please install curl first."
    exit 1
  fi
  print_success "curl is installed"

  # Check if environment variables are set
  if [[ "$SUPABASE_URL" == "https://your-project.supabase.co" ]]; then
    print_error "SUPABASE_URL is not set. Please update the script or set environment variable."
    exit 1
  fi
  print_success "Supabase URL is configured"

  if [[ "$SUPABASE_SERVICE_KEY" == "your-service-role-key" ]]; then
    print_error "SUPABASE_SERVICE_KEY is not set. Please update the script or set environment variable."
    exit 1
  fi
  print_success "Supabase service key is configured"

  # Check if jq is installed (optional)
  if command -v jq &> /dev/null; then
    print_success "jq is installed (will use for pretty output)"
    USE_JQ=true
  else
    print_info "jq is not installed (output will be raw JSON)"
    USE_JQ=false
  fi

  echo ""
}

# ============================================================================
# Main Functions
# ============================================================================

create_department() {
  print_header "Step 1: Creating/Checking Department"

  # Check if department exists
  RESPONSE=$(curl -s -X GET \
    "${SUPABASE_URL}/rest/v1/departments?code=eq.${DEPARTMENT_CODE}" \
    -H "apikey: ${SUPABASE_SERVICE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}")

  if [[ "$USE_JQ" == true ]]; then
    DEPT_COUNT=$(echo "$RESPONSE" | jq 'length')
  else
    DEPT_COUNT=$(echo "$RESPONSE" | grep -c "id" || echo "0")
  fi

  if [[ "$DEPT_COUNT" -gt 0 ]]; then
    print_info "Department ${DEPARTMENT_CODE} already exists"
    if [[ "$USE_JQ" == true ]]; then
      DEPARTMENT_ID=$(echo "$RESPONSE" | jq -r '.[0].id')
    else
      print_info "Department exists but jq not installed - cannot extract ID automatically"
      print_info "Please install jq or manually get department ID from Supabase dashboard"
      exit 1
    fi
  else
    # Create department
    RESPONSE=$(curl -s -X POST \
      "${SUPABASE_URL}/rest/v1/departments" \
      -H "apikey: ${SUPABASE_SERVICE_KEY}" \
      -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
      -H "Content-Type: application/json" \
      -H "Prefer: return=representation" \
      -d "{\"name\":\"${DEPARTMENT_NAME}\",\"code\":\"${DEPARTMENT_CODE}\"}")

    if [[ "$USE_JQ" == true ]]; then
      DEPARTMENT_ID=$(echo "$RESPONSE" | jq -r '.[0].id')
    fi
    print_success "Created department: ${DEPARTMENT_NAME} (${DEPARTMENT_CODE})"
  fi

  print_success "Department ID: ${DEPARTMENT_ID}"
  echo ""
}

create_course() {
  print_header "Step 2: Creating/Checking Course"

  # Check if course exists
  RESPONSE=$(curl -s -X GET \
    "${SUPABASE_URL}/rest/v1/courses?code=eq.${COURSE_CODE}" \
    -H "apikey: ${SUPABASE_SERVICE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}")

  if [[ "$USE_JQ" == true ]]; then
    COURSE_COUNT=$(echo "$RESPONSE" | jq 'length')
  else
    COURSE_COUNT=$(echo "$RESPONSE" | grep -c "id" || echo "0")
  fi

  if [[ "$COURSE_COUNT" -gt 0 ]]; then
    print_info "Course ${COURSE_CODE} already exists"
    if [[ "$USE_JQ" == true ]]; then
      COURSE_ID=$(echo "$RESPONSE" | jq -r '.[0].id')
    fi
  else
    # Create course
    RESPONSE=$(curl -s -X POST \
      "${SUPABASE_URL}/rest/v1/courses" \
      -H "apikey: ${SUPABASE_SERVICE_KEY}" \
      -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
      -H "Content-Type: application/json" \
      -H "Prefer: return=representation" \
      -d "{\"department_id\":\"${DEPARTMENT_ID}\",\"name\":\"${COURSE_NAME}\",\"code\":\"${COURSE_CODE}\",\"year\":${YEAR},\"semester\":${SEMESTER}}")

    if [[ "$USE_JQ" == true ]]; then
      COURSE_ID=$(echo "$RESPONSE" | jq -r '.[0].id')
    fi
    print_success "Created course: ${COURSE_NAME} (${COURSE_CODE})"
  fi

  print_success "Course ID: ${COURSE_ID}"
  echo ""
}

create_student() {
  print_header "Step 3: Creating Student Record"

  # Check if student exists
  RESPONSE=$(curl -s -X GET \
    "${SUPABASE_URL}/rest/v1/students?roll_number=eq.${ROLL_NUMBER}" \
    -H "apikey: ${SUPABASE_SERVICE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}")

  if [[ "$USE_JQ" == true ]]; then
    STUDENT_COUNT=$(echo "$RESPONSE" | jq 'length')
  else
    STUDENT_COUNT=$(echo "$RESPONSE" | grep -c "id" || echo "0")
  fi

  if [[ "$STUDENT_COUNT" -gt 0 ]]; then
    print_info "Student with roll number ${ROLL_NUMBER} already exists"
    if [[ "$USE_JQ" == true ]]; then
      STUDENT_ID=$(echo "$RESPONSE" | jq -r '.[0].id')
      EXISTING_USER_ID=$(echo "$RESPONSE" | jq -r '.[0].user_id')

      if [[ "$EXISTING_USER_ID" != "null" && "$EXISTING_USER_ID" != "" ]]; then
        print_success "Student already linked to user account"
        print_info "Login with: ${STUDENT_EMAIL}"
        echo ""
        exit 0
      fi
    fi
  else
    # Create student
    RESPONSE=$(curl -s -X POST \
      "${SUPABASE_URL}/rest/v1/students" \
      -H "apikey: ${SUPABASE_SERVICE_KEY}" \
      -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
      -H "Content-Type: application/json" \
      -H "Prefer: return=representation" \
      -d "{\"roll_number\":\"${ROLL_NUMBER}\",\"name\":\"${STUDENT_NAME}\",\"email\":\"${STUDENT_EMAIL}\",\"department_id\":\"${DEPARTMENT_ID}\",\"course_id\":\"${COURSE_ID}\",\"year\":${YEAR}}")

    if [[ "$USE_JQ" == true ]]; then
      STUDENT_ID=$(echo "$RESPONSE" | jq -r '.[0].id')
    fi
    print_success "Created student: ${STUDENT_NAME} (${ROLL_NUMBER})"
  fi

  print_success "Student ID: ${STUDENT_ID}"
  echo ""
}

create_user() {
  print_header "Step 4: Creating User Account"

  print_info "Creating auth user via Supabase Admin API..."

  # Create user in Supabase Auth
  RESPONSE=$(curl -s -X POST \
    "${SUPABASE_URL}/auth/v1/admin/users" \
    -H "apikey: ${SUPABASE_SERVICE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${STUDENT_EMAIL}\",\"password\":\"${STUDENT_PASSWORD}\",\"email_confirm\":true,\"user_metadata\":{\"roll_number\":\"${ROLL_NUMBER}\",\"name\":\"${STUDENT_NAME}\"}}")

  if [[ "$USE_JQ" == true ]]; then
    USER_ID=$(echo "$RESPONSE" | jq -r '.id')

    if [[ "$USER_ID" == "null" || -z "$USER_ID" ]]; then
      print_error "Failed to create auth user"
      echo "$RESPONSE" | jq .
      exit 1
    fi
  else
    print_info "User created but jq not installed - cannot extract ID automatically"
    echo "$RESPONSE"
    exit 1
  fi

  print_success "Created auth user"
  print_success "User ID: ${USER_ID}"

  # Create user record in users table
  RESPONSE=$(curl -s -X POST \
    "${SUPABASE_URL}/rest/v1/users" \
    -H "apikey: ${SUPABASE_SERVICE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=representation" \
    -d "{\"id\":\"${USER_ID}\",\"email\":\"${STUDENT_EMAIL}\",\"role\":\"student\"}")

  print_success "Created user record in users table"
  echo ""
}

link_student_to_user() {
  print_header "Step 5: Linking Student to User"

  # Update student with user_id
  RESPONSE=$(curl -s -X PATCH \
    "${SUPABASE_URL}/rest/v1/students?id=eq.${STUDENT_ID}" \
    -H "apikey: ${SUPABASE_SERVICE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=representation" \
    -d "{\"user_id\":\"${USER_ID}\"}")

  print_success "Linked student to user account"
  echo ""
}

verify_setup() {
  print_header "Step 6: Verifying Setup"

  # Get student with relations
  RESPONSE=$(curl -s -X GET \
    "${SUPABASE_URL}/rest/v1/students?roll_number=eq.${ROLL_NUMBER}&select=*,departments(name,code),courses(name,code)" \
    -H "apikey: ${SUPABASE_SERVICE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}")

  if [[ "$USE_JQ" == true ]]; then
    echo "$RESPONSE" | jq '.[0]'
  else
    echo "$RESPONSE"
  fi

  print_success "Setup verified successfully"
  echo ""
}

print_final_message() {
  print_header "🎉 SUCCESS!"

  echo -e "${GREEN}Student user created successfully!${NC}"
  echo ""
  echo -e "${BLUE}Login Credentials:${NC}"
  echo "  Email:    ${STUDENT_EMAIL}"
  echo "  Password: ${STUDENT_PASSWORD}"
  echo ""
  echo -e "${BLUE}Student Details:${NC}"
  echo "  Roll Number: ${ROLL_NUMBER}"
  echo "  Name:        ${STUDENT_NAME}"
  echo "  Department:  ${DEPARTMENT_NAME} (${DEPARTMENT_CODE})"
  echo "  Course:      ${COURSE_NAME} (${COURSE_CODE})"
  echo "  Year:        ${YEAR}"
  echo ""
  echo -e "${YELLOW}Next Steps:${NC}"
  echo "  1. Student can login at your application URL"
  echo "  2. Student should change password after first login"
  echo "  3. Assign student to exams"
  echo "  4. Allocate seats when ready"
  echo "  5. Student can download hall ticket"
  echo ""
}

# ============================================================================
# Main Execution
# ============================================================================

main() {
  print_header "OCEM Seat Planner - Student User Creation"
  echo "Roll Number: ${ROLL_NUMBER}"
  echo "Name: ${STUDENT_NAME}"
  echo "Email: ${STUDENT_EMAIL}"
  echo ""

  read -p "Continue with this configuration? (y/n) " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "Cancelled by user"
    exit 0
  fi
  echo ""

  check_requirements
  create_department
  create_course
  create_student
  create_user
  link_student_to_user
  verify_setup
  print_final_message
}

# Run main function
main
