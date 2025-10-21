# OCEM Seat Planner

An exam seating arrangement system designed for educational institutions in Nepal. Automates seat allocation with anti-cheating algorithms to ensure optimal student placement during examinations.

## Features

- **Student Management**: Bulk import via CSV/Excel, manual entry, search and filtering
- **Exam Hall Management**: Configure halls with customizable seating layouts
- **Exam Scheduling**: Create exams and assign students
- **Auto-Seat Allocation**: Multiple placement patterns (department alternation, course alternation, year-based, random)
- **Hall Ticket Generation**: Generate printable PDF hall tickets with QR codes
- **Role-Based Access**: Admin, Staff, Supervisor, and Student roles with appropriate permissions
- **Authentication**: Secure login with email/password and Google OAuth

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Authentication**: Supabase Auth (Email/Password + Google OAuth)
- **State Management**: TanStack Query, Zustand
- **Forms**: React Hook Form with Zod validation
- **File Processing**: Papa Parse (CSV), xlsx (Excel)
- **PDF Generation**: jsPDF with QR codes

## Prerequisites

- Node.js 18+ and pnpm
- Supabase account (free tier works)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Ocem-Seat-Planner
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be ready
3. Note your project URL and anon key from Settings > API

### 4. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Database Migration

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and run the SQL in the editor

This will create all tables, indexes, RLS policies, and triggers.

### 6. Configure Supabase Authentication

#### Enable Email/Password Authentication:
1. Go to Authentication > Providers
2. Enable "Email" provider
3. Configure email templates (optional)

#### Enable Google OAuth (Optional):
1. Go to Authentication > Providers
2. Enable "Google" provider
3. Add OAuth redirect URLs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`
4. Configure Google OAuth credentials (see Supabase docs)

### 7. Create Admin User

1. Go to Authentication > Users in Supabase dashboard
2. Click "Add user" > "Create new user"
3. Enter email and password for admin account
4. After user is created, go to SQL Editor and run:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-admin@email.com';
```

### 8. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 9. Login and Setup

1. Login with your admin credentials
2. Follow the getting started guide on the dashboard:
   - Setup departments and courses
   - Import student data
   - Create exam halls
   - Schedule exams and allocate seats

## Project Structure

```
Ocem-Seat-Planner/
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── (auth)/             # Authentication pages
│   │   ├── (dashboard)/        # Protected dashboard pages
│   │   ├── api/                # API routes
│   │   └── auth/               # OAuth callback
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── auth/               # Auth components
│   │   ├── layout/             # Layout components
│   │   └── [feature]/          # Feature-specific components
│   ├── lib/                    # Utility functions
│   │   ├── supabase/           # Supabase clients
│   │   ├── db/                 # Database operations
│   │   ├── algorithms/         # Seat allocation logic
│   │   ├── parsers/            # CSV/Excel parsers
│   │   └── pdf/                # PDF generation
│   ├── hooks/                  # Custom React hooks
│   └── types/                  # TypeScript type definitions
├── supabase/
│   └── migrations/             # Database migrations
├── public/                     # Static assets
└── package.json
```

## User Roles

### Admin
- Full system access
- Manage all departments, courses, students, exams, and halls
- Create and manage users
- System configuration

### Staff/Teacher
- Manage students within assigned departments
- Create and manage exams for assigned courses
- Run seat allocation algorithms
- Generate hall tickets

### Supervisor
- Read-only access to exam schedules and seating arrangements
- View student lists and hall details

### Student
- View own exam schedule and seat assignments
- Download personal hall tickets

## CSV Import Format

For bulk student import, use this format:

```csv
Roll Number,Name,Email,Department Code,Course Code,Year
2024001,John Doe,john@example.com,CS,CS101,1
2024002,Jane Smith,jane@example.com,MATH,MATH101,1
```

## Seat Allocation Patterns

### Department Alternation (Recommended)
Students sitting at the same desk are from different departments to minimize collaboration potential.

### Course Alternation
Students at the same desk are from different courses for more granular separation.

### Year-Based Alternation
Mix different academic years (1st with 3rd, 2nd with 4th) for varied syllabi.

### Random Placement
Completely random allocation for low-stakes exams or time constraints.

## Development

```bash
# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed on any platform supporting Next.js:
- Netlify
- Railway
- Self-hosted with Docker

## Security

- Row Level Security (RLS) enabled on all tables
- Server-side authentication checks
- Role-based access control
- Secure password hashing (handled by Supabase)
- Protected API routes

## Support

For issues or questions:
- Check the documentation
- Review the setup guide
- Contact your system administrator

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please follow the existing code style and submit pull requests for review.

---

Built for educational institutions in Nepal 🇳🇵
