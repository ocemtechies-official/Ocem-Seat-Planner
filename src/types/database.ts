export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'admin' | 'staff' | 'supervisor' | 'student'
export type ExamStatus = 'draft' | 'scheduled' | 'completed' | 'cancelled'

export interface Database {
  public: {
    Tables: {
      departments: {
        Row: {
          id: string
          name: string
          code: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          department_id: string
          name: string
          code: string
          year: number
          semester: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          department_id: string
          name: string
          code: string
          year: number
          semester: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          department_id?: string
          name?: string
          code?: string
          year?: number
          semester?: number
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          role: UserRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          roll_number: string
          name: string
          email: string | null
          department_id: string
          course_id: string
          year: number
          user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          roll_number: string
          name: string
          email?: string | null
          department_id: string
          course_id: string
          year: number
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          roll_number?: string
          name?: string
          email?: string | null
          department_id?: string
          course_id?: string
          year?: number
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      exam_halls: {
        Row: {
          id: string
          name: string
          total_seats: number
          rows: number
          columns: number
          layout_config: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          total_seats: number
          rows: number
          columns: number
          layout_config?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          total_seats?: number
          rows?: number
          columns?: number
          layout_config?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      seats: {
        Row: {
          id: string
          hall_id: string
          seat_number: string
          row_number: number
          col_number: number
          is_usable: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          hall_id: string
          seat_number: string
          row_number: number
          col_number: number
          is_usable?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          hall_id?: string
          seat_number?: string
          row_number?: number
          col_number?: number
          is_usable?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      exams: {
        Row: {
          id: string
          subject: string
          course_id: string
          exam_date: string
          start_time: string
          duration_minutes: number
          status: ExamStatus
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subject: string
          course_id: string
          exam_date: string
          start_time: string
          duration_minutes: number
          status?: ExamStatus
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          subject?: string
          course_id?: string
          exam_date?: string
          start_time?: string
          duration_minutes?: number
          status?: ExamStatus
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      exam_students: {
        Row: {
          id: string
          exam_id: string
          student_id: string
          created_at: string
        }
        Insert: {
          id?: string
          exam_id: string
          student_id: string
          created_at?: string
        }
        Update: {
          id?: string
          exam_id?: string
          student_id?: string
          created_at?: string
        }
      }
      exam_halls_assignments: {
        Row: {
          id: string
          exam_id: string
          hall_id: string
          created_at: string
        }
        Insert: {
          id?: string
          exam_id: string
          hall_id: string
          created_at?: string
        }
        Update: {
          id?: string
          exam_id?: string
          hall_id?: string
          created_at?: string
        }
      }
      seat_assignments: {
        Row: {
          id: string
          exam_id: string
          student_id: string
          seat_id: string
          hall_id: string
          assigned_at: string
          assigned_by: string
          is_manual: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          exam_id: string
          student_id: string
          seat_id: string
          hall_id: string
          assigned_at?: string
          assigned_by: string
          is_manual?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          exam_id?: string
          student_id?: string
          seat_id?: string
          hall_id?: string
          assigned_at?: string
          assigned_by?: string
          is_manual?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      staff_permissions: {
        Row: {
          id: string
          user_id: string
          department_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          department_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          department_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: UserRole
      exam_status: ExamStatus
    }
  }
}

// Convenience types for common usage
export type Department = Database['public']['Tables']['departments']['Row']
export type Course = Database['public']['Tables']['courses']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type Student = Database['public']['Tables']['students']['Row']
export type ExamHall = Database['public']['Tables']['exam_halls']['Row']
export type Seat = Database['public']['Tables']['seats']['Row']
export type Exam = Database['public']['Tables']['exams']['Row']
export type ExamStudent = Database['public']['Tables']['exam_students']['Row']
export type ExamHallAssignment = Database['public']['Tables']['exam_halls_assignments']['Row']
export type SeatAssignment = Database['public']['Tables']['seat_assignments']['Row']
export type StaffPermission = Database['public']['Tables']['staff_permissions']['Row']

// Extended types with relations
export type StudentWithRelations = Student & {
  department?: Department
  course?: Course
  user?: User
}

export type ExamWithRelations = Exam & {
  course?: Course
  created_by_user?: User
  exam_students?: ExamStudent[]
  exam_halls_assignments?: ExamHallAssignment[]
}

export type SeatAssignmentWithRelations = SeatAssignment & {
  student?: Student
  seat?: Seat
  hall?: ExamHall
  exam?: Exam
}
