# System Overview

## Architecture

Ocem Seat Planner is built as a modern full-stack web application using Next.js with a PostgreSQL database.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
│  (React Components, Tailwind CSS, Client-side Logic)   │
└─────────────────────┬───────────────────────────────────┘
                      │
                      │ HTTPS
                      │
┌─────────────────────▼───────────────────────────────────┐
│                  Next.js Server                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  App Router (React Server Components)         │    │
│  └────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────┐    │
│  │  API Routes (REST Endpoints)                   │    │
│  └────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────┐    │
│  │  Middleware (Authentication & Authorization)   │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────┬───────────────────────────────────┘
                      │
                      │ Supabase Client
                      │
┌─────────────────────▼───────────────────────────────────┐
│                  Supabase Platform                       │
│  ┌────────────────────────────────────────────────┐    │
│  │  PostgreSQL Database                           │    │
│  │  - Tables with Row Level Security (RLS)       │    │
│  │  - Indexes for performance                     │    │
│  └────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────┐    │
│  │  Authentication Service                        │    │
│  │  - Email/Password                              │    │
│  │  - Google OAuth                                │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend

**Core Framework**
- **Next.js 15**: React framework with App Router
  - Server-side rendering (SSR)
  - Client-side navigation
  - API routes
  - Middleware for route protection

**UI & Styling**
- **React 18**: UI component library
- **TypeScript**: Type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React component library
  - Built on Radix UI primitives
  - Fully accessible components
  - Customizable with Tailwind

**State Management**
- **React Hooks**: Built-in state management (useState, useEffect)
- **Server State**: Cached on client, fetched from API
- **Form State**: React Hook Form for complex forms

**Data Fetching**
- Server Components: Direct database queries
- Client Components: Fetch API with async/await

### Backend

**Server Framework**
- **Next.js API Routes**: RESTful API endpoints
- **Supabase Client**: Database operations
  - Server-side client with cookie handling
  - Client-side client for browser operations

**Database**
- **PostgreSQL 14+**: Relational database via Supabase
  - Row Level Security (RLS) policies
  - Foreign key constraints
  - Indexes for query performance
  - JSON columns for flexible data

**Authentication**
- **Supabase Auth**: Built-in authentication service
  - Email/Password authentication
  - Google OAuth integration
  - Session management with JWT tokens
  - HTTP-only cookie storage

### Libraries & Tools

**File Processing**
- **Papa Parse**: CSV file parsing and validation
- **xlsx**: Excel file reading and parsing

**PDF Generation**
- **jsPDF**: PDF document creation
- **qrcode**: QR code generation for hall tickets

**Compression**
- **jszip**: Create ZIP archives for bulk downloads

**Icons**
- **lucide-react**: Beautiful, consistent icon set

**Date/Time**
- **date-fns**: Date manipulation and formatting

## Application Structure

```
Ocem-Seat-Planner/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Authentication pages (login, register)
│   │   ├── (dashboard)/              # Main application (protected routes)
│   │   ├── api/                      # API routes
│   │   └── auth/callback/            # OAuth callback handler
│   ├── components/                   # React components
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── layout/                   # Layout components (Sidebar, Header)
│   │   ├── auth/                     # Authentication components
│   │   ├── students/                 # Student management components
│   │   ├── exams/                    # Exam management components
│   │   ├── halls/                    # Hall management components
│   │   ├── seating/                  # Seating chart components
│   │   └── hall-tickets/             # Hall ticket components
│   ├── lib/                          # Utility functions & business logic
│   │   ├── supabase/                 # Supabase client configuration
│   │   ├── db/                       # Database query functions
│   │   ├── algorithms/               # Seat allocation algorithms
│   │   ├── parsers/                  # CSV/Excel parsing logic
│   │   ├── pdf/                      # PDF generation logic
│   │   ├── auth.ts                   # Authentication helpers
│   │   └── utils.ts                  # Generic utilities
│   ├── hooks/                        # Custom React hooks
│   ├── types/                        # TypeScript type definitions
│   └── middleware.ts                 # Route protection middleware
├── supabase/
│   └── migrations/                   # Database schema migrations
├── public/                           # Static assets
├── docs/                             # Documentation
└── [Config files]                    # Next.js, TypeScript, Tailwind configs
```

## Data Flow

### 1. Authentication Flow

```
User Login Request
    │
    ▼
Next.js API Route (/api/auth/*)
    │
    ▼
Supabase Auth Service
    │
    ├─► Create Session (JWT token)
    │
    ▼
Set HTTP-only Cookie
    │
    ▼
Redirect to Dashboard (based on role)
```

### 2. Protected Page Access Flow

```
User Requests Page (/dashboard)
    │
    ▼
Next.js Middleware (middleware.ts)
    │
    ├─► Check Cookie for Session
    │   │
    │   ├─► Valid Session
    │   │   └─► Check User Role
    │   │       ├─► Authorized: Continue to Page
    │   │       └─► Unauthorized: Redirect to Appropriate Dashboard
    │   │
    │   └─► Invalid Session: Redirect to Login
    │
    ▼
Server Component Renders
    │
    ├─► Direct Database Query (via Supabase)
    │   └─► Row Level Security enforced
    │
    ▼
HTML Response to Client
```

### 3. API Request Flow

```
Client Action (Create Exam)
    │
    ▼
Fetch API Call (/api/exams)
    │
    ▼
Next.js API Route Handler
    │
    ├─► requireRole() - Verify Permission
    │   ├─► Authorized: Continue
    │   └─► Unauthorized: Return 403
    │
    ├─► Parse Request Body
    │
    ├─► Validate Data (Zod schema)
    │   ├─► Valid: Continue
    │   └─► Invalid: Return 400
    │
    ├─► Call Database Function (lib/db/exams.ts)
    │   │
    │   ▼
    │   Supabase Client Query
    │   │
    │   ├─► Row Level Security Check
    │   │   ├─► Allowed: Execute Query
    │   │   └─► Denied: Return Error
    │   │
    │   ▼
    │   Return Result
    │
    ├─► Return Success Response (200)
    │   or
    └─► Return Error Response (400/403/500)
```

### 4. Seat Allocation Flow

```
Staff Initiates Allocation
    │
    ▼
POST /api/exams/[id]/allocate
    │
    ├─► Verify User Permission
    │
    ├─► Fetch Exam Details
    │
    ├─► Fetch Assigned Students
    │
    ├─► Fetch Assigned Halls & Available Seats
    │
    ├─► Check Capacity (Students ≤ Seats)
    │   ├─► Sufficient: Continue
    │   └─► Insufficient: Return Error
    │
    ├─► Run Allocation Algorithm (lib/algorithms/seat-allocation.ts)
    │   │
    │   ├─► Group Students by Pattern
    │   │   ├─► Department Alternation
    │   │   ├─► Course Alternation
    │   │   ├─► Year-Based Alternation
    │   │   └─► Random Placement
    │   │
    │   ├─► Pair Students at Desks
    │   │   └─► Ensure Different Groups per Desk
    │   │
    │   ├─► Distribute Across Multiple Halls (if applicable)
    │   │
    │   └─► Create seat_assignments Records
    │
    ├─► Save Assignments to Database
    │
    └─► Return Success with Assignment Summary
```

### 5. Hall Ticket Generation Flow

```
Staff Requests Hall Tickets
    │
    ▼
GET /api/exams/[id]/hall-tickets?format=zip
    │
    ├─► Verify User Permission
    │
    ├─► Fetch Exam Details
    │
    ├─► Fetch All Seat Assignments for Exam
    │
    ├─► For Each Assignment:
    │   │
    │   ├─► Fetch Student Details
    │   │
    │   ├─► Fetch Seat & Hall Details
    │   │
    │   ├─► Generate QR Code (student roll number)
    │   │
    │   └─► Generate PDF using Template (lib/pdf/hall-ticket-generator.ts)
    │       │
    │       ├─► Add Institution Header
    │       ├─► Add Student Information
    │       ├─► Add Exam Details
    │       ├─► Add Seating Assignment
    │       ├─► Add Instructions
    │       └─► Add QR Code
    │
    ├─► Create ZIP Archive (jszip)
    │   └─► Add All PDF Files
    │
    └─► Stream ZIP to Client
```

## Security Architecture

### 1. Authentication Security

**Session Management**
- HTTP-only cookies prevent XSS attacks
- Secure flag ensures HTTPS-only transmission
- SameSite attribute prevents CSRF attacks
- 7-day session duration (configurable)
- Auto-refresh before expiry

**Password Security**
- Minimum 8 characters enforced
- Hashed with bcrypt (handled by Supabase)
- Never stored in plain text
- Password reset via email verification

**OAuth Security**
- Google OAuth uses industry-standard OAuth 2.0
- State parameter prevents CSRF
- Redirect URI validation
- Token exchange on server-side only

### 2. Authorization Security

**Role-Based Access Control (RBAC)**
- Four roles: admin, staff, supervisor, student
- Permissions enforced at multiple levels:
  1. Middleware (route protection)
  2. API routes (endpoint protection)
  3. Database (Row Level Security)
  4. UI (conditional rendering)

**Row Level Security (RLS)**
- PostgreSQL RLS policies on all tables
- Users can only access data they own or have permission for
- Staff limited to assigned departments
- Students see only their own records
- Enforced at database level (cannot be bypassed)

### 3. Data Security

**Input Validation**
- All API inputs validated with Zod schemas
- SQL injection prevented by parameterized queries
- XSS prevention via React's built-in escaping
- File upload validation (type, size limits)

**Data Privacy**
- Student data accessible only by authorized users
- Seat assignments visible only to relevant parties
- Email addresses not exposed to students
- Audit trail (created_by, assigned_by fields)

### 4. API Security

**Rate Limiting**
- Supabase handles rate limiting
- Prevents brute force attacks
- Protects against DDoS

**Error Handling**
- Generic error messages to clients
- Detailed errors logged server-side
- No sensitive information in error responses

## Performance Optimization

### 1. Database Optimization

**Indexing Strategy**
- Primary keys on all tables (uuid)
- Foreign key indexes for joins
- Composite indexes for common queries
- Unique indexes for roll_number, email

**Query Optimization**
- Select only needed columns
- Use joins instead of multiple queries
- Pagination for large datasets (50 items per page)
- Caching frequently accessed data

### 2. Frontend Optimization

**Code Splitting**
- Automatic route-based splitting by Next.js
- Dynamic imports for heavy components
- PDF library loaded only when needed

**Asset Optimization**
- Image optimization via Next.js Image component
- CSS purging via Tailwind (production builds)
- Font optimization (system fonts)

**Rendering Strategy**
- Server Components for data fetching
- Client Components only when needed (interactivity)
- Static generation for public pages
- Streaming for slow queries

### 3. Caching Strategy

**Browser Caching**
- Static assets cached with long TTL
- API responses cached briefly (stale-while-revalidate)

**Database Connection Pooling**
- Supabase manages connection pool
- Reuses connections efficiently

## Scalability Considerations

### Current Capacity

**Database**
- Handles up to 100,000 students
- Supports 10,000 concurrent exams
- 1000 exam halls

**Concurrent Users**
- 500+ simultaneous users
- Supabase free tier: adequate for medium institution
- Paid tiers scale to thousands of concurrent users

### Scaling Strategy

**Horizontal Scaling**
- Serverless architecture (Next.js)
- Auto-scales with demand
- Pay only for actual usage

**Database Scaling**
- Supabase Pro: Dedicated database
- Read replicas for reporting
- Connection pooling for efficiency

**File Storage**
- Hall ticket PDFs generated on-demand (not stored)
- CSV uploads processed and discarded
- Minimal storage requirements

## Monitoring & Logging

### Application Monitoring

**Error Tracking**
- Server errors logged to console
- Client errors caught by Error Boundaries
- API errors return structured responses

**Performance Monitoring**
- Next.js built-in analytics
- Supabase dashboard for query performance
- Browser DevTools for client-side performance

### Database Monitoring

**Supabase Dashboard**
- Query performance statistics
- Connection pool status
- Database size and growth
- RLS policy execution time

## Maintenance & Updates

### Regular Maintenance

**Database**
- Monitor table sizes
- Review slow queries
- Update indexes as needed
- Backup data regularly (Supabase handles this)

**Application**
- Update dependencies monthly
- Security patches applied immediately
- Test before deploying updates

### Backup Strategy

**Database Backups**
- Supabase: Daily automated backups (7-day retention on free tier)
- Point-in-time recovery available (paid tiers)
- Manual backups before major changes

**Configuration Backups**
- Environment variables documented
- Database schema in version control (migrations)
- Supabase project settings documented

## Disaster Recovery

**Data Loss Scenarios**

1. **Database Corruption**
   - Restore from Supabase backup
   - Maximum data loss: 24 hours (daily backups)

2. **Accidental Deletion**
   - Restore specific table from backup
   - Soft delete implementation recommended for critical data

3. **Application Failure**
   - Redeploy from Git repository
   - Zero data loss (database unaffected)

4. **Supabase Outage**
   - Wait for service restoration
   - Check Supabase status page
   - 99.9% uptime SLA on paid tiers

## Future Enhancements

**Planned Features**
- Biometric attendance integration
- Real-time seat availability dashboard
- SMS notifications for students
- Mobile app for students
- Advanced reporting and analytics
- Exam schedule conflict detection
- Automatic invigilator assignment
- Multi-language support (Nepali, English)

**Performance Enhancements**
- Redis caching layer
- WebSocket for real-time updates
- Progressive Web App (PWA) support
- Offline mode for viewing hall tickets

---

**Last Updated**: 2025-01-21
