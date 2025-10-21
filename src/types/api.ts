// API Request and Response Types

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Student Import Types
export interface StudentImportRow {
  roll_number: string;
  name: string;
  email?: string;
  department_code: string;
  course_code: string;
  year: number;
}

export interface StudentImportResult {
  success: boolean;
  imported: number;
  updated: number;
  skipped: number;
  failed: number;
  errors: Array<{
    row: number;
    error: string;
  }>;
}

// Seat Allocation Types
export type AllocationPattern =
  | 'department_alternation'
  | 'course_alternation'
  | 'year_based'
  | 'random';

export interface SeatAllocationRequest {
  examId: string;
  pattern: AllocationPattern;
}

export interface SeatAllocationResult {
  success: boolean;
  assigned: number;
  message: string;
}

// Hall Ticket Types
export interface HallTicketData {
  studentName: string;
  rollNumber: string;
  department: string;
  course: string;
  examSubject: string;
  examDate: string;
  examTime: string;
  duration: number;
  hallName: string;
  seatNumber: string;
}

// Search and Filter Types
export interface StudentFilters {
  department_id?: string;
  course_id?: string;
  year?: number;
  has_user_account?: boolean;
  search?: string;
}

export interface ExamFilters {
  status?: string;
  course_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}
