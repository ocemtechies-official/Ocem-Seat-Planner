# 🎓 OCEM Seat Planner

<div align="center">

**An intelligent exam seating arrangement system designed for educational institutions**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Demo](#-demo) • [Support](#-support)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Documentation](#-documentation)
- [Project Structure](#-project-structure)
- [User Roles](#-user-roles)
- [Seat Allocation Algorithms](#-seat-allocation-algorithms)
- [API Endpoints](#-api-endpoints)
- [Development](#-development)
- [Deployment](#-deployment)
- [Security](#-security)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 🎯 About

OCEM Seat Planner is a comprehensive web application that automates the complex process of exam hall seating arrangements for educational institutions in Nepal. It uses intelligent anti-cheating algorithms to strategically place students, ensuring exam integrity while streamlining administrative workflows.

### Why OCEM Seat Planner?

**The Problem:**
- Manual seat allocation is time-consuming and error-prone
- Risk of students from the same department sitting together
- Difficult to manage large-scale exams across multiple halls
- Tedious hall ticket generation and distribution process
- Complex coordination between departments and exam coordinators

**Our Solution:**
- **Automated seat allocation** with 4 anti-cheating patterns
- **Bulk operations** for student import and hall ticket generation
- **Multi-hall support** with intelligent capacity management
- **Role-based access** for different organizational levels
- **Real-time dashboards** for monitoring and analytics
- **Student self-service portal** for hall ticket access

---

## ✨ Features

### 📚 Student Management
- **Bulk Import**: CSV/Excel import with validation and preview
- **Manual Entry**: Quick single-student addition
- **Advanced Search**: Filter by department, course, year, or name
- **User Linking**: Connect student records with user accounts
- **Data Export**: Export student lists for reporting

### 🏛️ Exam Hall Management
- **Visual Layout Editor**: Configure hall seating arrangements
- **Flexible Configuration**: Support for various hall sizes and layouts
- **Seat Status Management**: Mark seats as usable/unusable
- **Capacity Tracking**: Real-time seat availability monitoring
- **Multi-Hall Support**: Manage unlimited exam halls

### 📝 Exam Management
- **Easy Creation**: Intuitive exam setup workflow
- **Student Assignment**: Bulk or individual student assignment
- **Hall Allocation**: Multi-hall assignment with capacity validation
- **Status Tracking**: Draft, Scheduled, Completed, Cancelled states
- **Schedule Conflict Detection**: Prevent overlapping exams

### 🎲 Intelligent Seat Allocation
- **Department Alternation**: Separates students by department (Recommended)
- **Course Alternation**: Groups different courses together
- **Year-Based Alternation**: Mixes different academic years
- **Random Placement**: Quick allocation for low-stakes exams
- **Manual Override**: Adjust individual seat assignments
- **Re-allocation**: Clear and regenerate seating arrangements

### 🎫 Hall Ticket Generation
- **Professional Design**: Clean, printable hall ticket layout
- **QR Code Integration**: Quick verification with embedded QR codes
- **Bulk Download**: Generate all tickets as ZIP archive
- **Individual Download**: On-demand ticket regeneration
- **Student Self-Service**: Students download their own tickets

### 👥 Role-Based Access Control
- **Admin**: Full system access and user management
- **Staff**: Department-scoped access for teaching staff
- **Supervisor**: Read-only access for exam proctors
- **Student**: Personal exam and seat information only

### 🔐 Authentication & Security
- **Email/Password**: Traditional authentication method
- **Google OAuth**: Single sign-on with Google accounts
- **Row Level Security**: Database-level access control
- **Session Management**: Secure cookie-based sessions
- **Password Reset**: Self-service password recovery

### 📊 Dashboard & Analytics
- **Real-time Statistics**: Student, exam, and hall counts
- **Upcoming Exams**: Quick view of scheduled exams
- **Recent Activity**: Track recent system changes
- **Role-Specific Views**: Tailored dashboards for each user type
- **Quick Actions**: One-click access to common tasks

---

## 🎬 Demo

### Dashboard Views

**Admin Dashboard**
- Total system statistics
- Quick action buttons
- Upcoming and recent exams lists
- Getting started guide for new installations

**Staff Dashboard**
- Department-specific statistics
- Exam management shortcuts
- Student import access

**Student Portal**
- Personal exam list
- Seat assignment status
- Hall ticket download

### Key Workflows

1. **Student Import** → **Exam Creation** → **Student Assignment** → **Hall Assignment** → **Seat Allocation** → **Hall Ticket Generation**

2. **Student Registration** → **Account Linking** → **View Exams** → **Download Hall Tickets**

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality React components
- **[React Hook Form](https://react-hook-form.com/)** - Performant form library
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service
  - PostgreSQL database
  - Row Level Security (RLS)
  - Built-in authentication
  - Real-time capabilities

### Libraries & Tools
- **[Papa Parse](https://www.papaparse.com/)** - CSV parsing
- **[xlsx](https://www.npmjs.com/package/xlsx)** - Excel file processing
- **[jsPDF](https://github.com/parallax/jsPDF)** - PDF generation
- **[qrcode](https://www.npmjs.com/package/qrcode)** - QR code generation
- **[jszip](https://stuk.github.io/jszip/)** - ZIP file creation
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[date-fns](https://date-fns.org/)** - Date manipulation

### Development Tools
- **[pnpm](https://pnpm.io/)** - Fast, efficient package manager
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **Git** - Version control

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **pnpm** 8.x or higher (`npm install -g pnpm`)
- **Git** for version control
- **Supabase account** (Free tier available at [supabase.com](https://supabase.com))

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/yourusername/Ocem-Seat-Planner.git
cd Ocem-Seat-Planner
```

**2. Install dependencies**

```bash
pnpm install
```

**3. Set up Supabase**

- Create a new project at [supabase.com](https://supabase.com)
- Wait for database initialization (~2 minutes)
- Copy Project URL and API keys from Settings → API

**4. Configure environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**5. Run database migration**

- Open Supabase dashboard → SQL Editor
- Copy contents of `supabase/migrations/001_initial_schema.sql`
- Paste and execute in SQL Editor
- Verify all 11 tables created successfully

**6. Create admin user**

In Supabase dashboard:
- Go to Authentication → Users → Add User
- Create user with email/password
- Auto-confirm user
- Copy user UUID

Then run in SQL Editor:

```sql
INSERT INTO users (id, email, role)
VALUES ('paste-user-uuid-here', 'admin@example.com', 'admin');
```

**7. Start development server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and login with admin credentials.

**8. Initial setup**

Follow the on-screen getting started guide:
- Create departments and courses
- Create exam halls
- Import or add students
- Create your first exam

**🎉 You're ready to go!**

---

## 📚 Documentation

Comprehensive documentation is available in the `/docs` folder:

### User Guides
- **[Admin Guide](docs/guides/ADMIN_GUIDE.md)** - Complete administrator manual (464 lines)
- **[Staff Guide](docs/guides/STAFF_GUIDE.md)** - Teaching staff handbook (338 lines)
- **[Student Guide](docs/guides/STUDENT_GUIDE.md)** - Student portal instructions (347 lines)
- **[CSV Import Guide](docs/guides/CSV_IMPORT_GUIDE.md)** - Detailed import instructions (411 lines)

### Technical Documentation
- **[System Overview](docs/technical/SYSTEM_OVERVIEW.md)** - Architecture & tech stack (679 lines)
- **[Database Schema](docs/technical/DATABASE_SCHEMA.md)** - Complete database reference (762 lines)
- **[API Documentation](docs/technical/API_DOCUMENTATION.md)** - Full API reference (1044 lines)
- **[Development Setup](docs/technical/DEVELOPMENT_SETUP.md)** - Local development guide (443 lines)
- **[Deployment Guide](docs/technical/DEPLOYMENT_GUIDE.md)** - Production deployment (706 lines)

### Templates
- **[CSV Import Template](docs/templates/student_import_template.csv)** - Ready-to-use template

**Total documentation:** 6,779 lines covering every aspect of the system!

---

## 📁 Project Structure

```
Ocem-Seat-Planner/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Authentication pages
│   │   │   ├── login/                # Login page
│   │   │   └── register/             # Student registration
│   │   ├── (dashboard)/              # Protected dashboard routes
│   │   │   ├── dashboard/            # Main dashboard
│   │   │   ├── admin/                # Admin-only pages
│   │   │   ├── students/             # Student management
│   │   │   ├── exams/                # Exam management
│   │   │   ├── halls/                # Hall management
│   │   │   ├── departments/          # Department management
│   │   │   ├── courses/              # Course management
│   │   │   └── my-exams/             # Student portal
│   │   ├── api/                      # API routes
│   │   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── students/             # Student CRUD + import
│   │   │   ├── exams/                # Exam CRUD + allocation
│   │   │   ├── halls/                # Hall CRUD + seats
│   │   │   ├── departments/          # Department CRUD
│   │   │   ├── courses/              # Course CRUD
│   │   │   ├── admin/                # Admin user management
│   │   │   └── dashboard/            # Dashboard stats
│   │   └── auth/callback/            # OAuth callback handler
│   ├── components/                   # React components
│   │   ├── ui/                       # shadcn/ui base components
│   │   ├── layout/                   # Layout components
│   │   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   │   └── Header.tsx            # App header
│   │   ├── auth/                     # Auth components
│   │   ├── students/                 # Student components
│   │   ├── exams/                    # Exam components
│   │   ├── halls/                    # Hall components
│   │   ├── seating/                  # Seating chart components
│   │   └── hall-tickets/             # Hall ticket components
│   ├── lib/                          # Utility functions
│   │   ├── supabase/                 # Supabase clients
│   │   │   ├── client.ts             # Browser client
│   │   │   └── server.ts             # Server client
│   │   ├── db/                       # Database operations
│   │   │   ├── students.ts           # Student queries
│   │   │   ├── exams.ts              # Exam queries
│   │   │   ├── halls.ts              # Hall queries
│   │   │   ├── seats.ts              # Seat queries
│   │   │   ├── assignments.ts        # Seat assignment queries
│   │   │   └── users.ts              # User queries
│   │   ├── algorithms/               # Business logic
│   │   │   └── seat-allocation.ts    # Allocation algorithms
│   │   ├── parsers/                  # File processing
│   │   │   ├── csv-parser.ts         # CSV parsing
│   │   │   └── excel-parser.ts       # Excel parsing
│   │   ├── pdf/                      # PDF generation
│   │   │   └── hall-ticket-generator.ts
│   │   ├── auth.ts                   # Auth helpers
│   │   └── utils.ts                  # General utilities
│   ├── hooks/                        # Custom React hooks
│   ├── types/                        # TypeScript definitions
│   │   ├── database.ts               # Database types
│   │   └── auth.ts                   # Auth types
│   └── middleware.ts                 # Route protection
├── supabase/
│   └── migrations/                   # Database migrations
│       └── 001_initial_schema.sql    # Complete schema
├── public/                           # Static assets
├── docs/                             # Documentation (6,779 lines)
│   ├── README.md                     # Documentation index
│   ├── guides/                       # User guides
│   ├── technical/                    # Technical docs
│   └── templates/                    # Import templates
├── .env.example                      # Example environment file
├── .env.local                        # Your env (gitignored)
├── next.config.js                    # Next.js configuration
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
├── components.json                   # shadcn/ui configuration
└── package.json                      # Dependencies
```

**Key directories:**
- `src/app/` - All pages and API routes
- `src/components/` - Reusable React components
- `src/lib/` - Business logic and utilities
- `supabase/migrations/` - Database schema
- `docs/` - Comprehensive documentation

---

## 👥 User Roles

### 🔑 Admin
**Full system access**

- Create and manage departments/courses
- Create user accounts for all roles
- Manage students across all departments
- Configure exam halls and layouts
- Oversee all exams and seat allocations
- Access all reports and analytics
- System configuration and settings

**Use case:** System administrators, IT staff

### 👨‍🏫 Staff / Teacher
**Department-scoped access**

- Manage students in assigned departments only
- Create and manage exams for assigned courses
- Import student data (CSV/Excel)
- Assign students and halls to exams
- Run seat allocation algorithms
- Generate hall tickets
- Manual seat adjustments

**Use case:** Teaching faculty, exam coordinators

### 👁️ Supervisor
**Read-only access**

- View all exam schedules
- View seating arrangements
- View student lists
- View hall details
- Cannot create, edit, or delete

**Use case:** Exam proctors, invigilators

### 🎓 Student
**Personal data only**

- View own exam schedule
- Check seat assignments
- Download personal hall tickets
- Cannot view other students' information

**Use case:** Students taking exams

---

## 🎲 Seat Allocation Algorithms

The system offers 4 intelligent seat allocation patterns:

### 1. Department Alternation (⭐ Recommended)

**Strategy:** Students at the same desk come from different departments

**Example:**
```
Desk 1: [CS Student] [Math Student]
Desk 2: [Physics Student] [English Student]
Desk 3: [CS Student] [Math Student]
```

**Best for:**
- Multi-department exams
- High-stakes examinations
- Minimizing collaboration risk

**Use when:** Students from multiple departments are taking the same exam

---

### 2. Course Alternation

**Strategy:** Students at the same desk come from different courses

**Example:**
```
Desk 1: [CS101 Student] [CS102 Student]
Desk 2: [CS201 Student] [CS101 Student]
```

**Best for:**
- Single department, multiple courses
- Granular separation within department
- Different syllabi at same year

**Use when:** Multiple courses from same department taking common exam

---

### 3. Year-Based Alternation

**Strategy:** Mix different academic years (Year 1 with Year 3, Year 2 with Year 4)

**Example:**
```
Desk 1: [Year 1 Student] [Year 3 Student]
Desk 2: [Year 2 Student] [Year 4 Student]
```

**Best for:**
- Common/general exams across years
- Different curriculum levels
- Multi-year assessments

**Use when:** Exam includes students from multiple academic years

---

### 4. Random Placement

**Strategy:** Completely random seat allocation

**Best for:**
- Low-stakes exams or quizzes
- Time-constrained situations
- When pattern doesn't matter

**Use when:** Quick allocation needed without specific anti-cheating requirements

---

### Algorithm Features

- **Desk-based pairing:** Groups 2 students per desk intelligently
- **Multi-hall distribution:** Automatically spreads students across assigned halls
- **Capacity validation:** Ensures sufficient seats before allocation
- **Unusable seat handling:** Automatically skips broken/reserved seats
- **Odd number handling:** Gracefully manages when students don't pair evenly
- **Manual override:** Allows post-allocation adjustments
- **Re-allocation:** Clear and regenerate with different pattern

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Student registration
- `GET /auth/callback` - OAuth callback handler

### Departments
- `GET /api/departments` - List all departments
- `POST /api/departments` - Create department (Admin)
- `PATCH /api/departments/[id]` - Update department (Admin)
- `DELETE /api/departments/[id]` - Delete department (Admin)

### Courses
- `GET /api/courses` - List courses (filterable by department)
- `POST /api/courses` - Create course (Admin)
- `PATCH /api/courses/[id]` - Update course (Admin)
- `DELETE /api/courses/[id]` - Delete course (Admin)

### Students
- `GET /api/students` - List students (permission-filtered)
- `POST /api/students` - Create student (Admin/Staff)
- `POST /api/students/import` - Import from CSV/Excel (Admin/Staff)
- `GET /api/students/[id]` - Get student details
- `PATCH /api/students/[id]` - Update student (Admin/Staff)
- `DELETE /api/students/[id]` - Delete student (Admin/Staff)
- `GET /api/students/[id]/exams` - Get student's exams

### Exam Halls
- `GET /api/halls` - List all halls
- `POST /api/halls` - Create hall (Admin/Staff)
- `GET /api/halls/[id]` - Get hall details
- `PATCH /api/halls/[id]` - Update hall (Admin/Staff)
- `DELETE /api/halls/[id]` - Delete hall (Admin/Staff)
- `GET /api/halls/[id]/seats` - Get hall seats
- `PATCH /api/halls/[id]/seats/[seatId]` - Update seat status

### Exams
- `GET /api/exams` - List exams (permission-filtered)
- `POST /api/exams` - Create exam (Admin/Staff)
- `GET /api/exams/[id]` - Get exam details
- `PATCH /api/exams/[id]` - Update exam (Admin/Staff)
- `DELETE /api/exams/[id]` - Delete exam (Admin/Staff)
- `POST /api/exams/[id]/students` - Assign students to exam
- `DELETE /api/exams/[id]/students/[studentId]` - Remove student
- `POST /api/exams/[id]/assign-halls` - Assign halls to exam
- `POST /api/exams/[id]/allocate` - Run seat allocation
- `GET /api/exams/[id]/seating` - Get seating chart
- `PATCH /api/exams/[id]/seating/[assignmentId]` - Manual seat override
- `DELETE /api/exams/[id]/seating` - Clear all seat assignments
- `GET /api/exams/[id]/hall-tickets` - Generate hall tickets (PDF/ZIP)

### User Management (Admin only)
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create user account
- `GET /api/admin/users/[id]` - Get user details
- `PATCH /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user

### Dashboard
- `GET /api/dashboard/stats` - Get role-specific statistics

**Full API documentation:** [docs/technical/API_DOCUMENTATION.md](docs/technical/API_DOCUMENTATION.md)

---

## 💻 Development

### Development Commands

```bash
# Start development server (with hot reload)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Type check
pnpm tsc --noEmit
```

### Development Best Practices

**Code Style:**
- Use TypeScript for all new files
- Follow existing patterns and conventions
- Add JSDoc comments for complex functions
- Use meaningful variable and function names

**Git Workflow:**
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: description of changes"

# Push and create pull request
git push origin feature/your-feature-name
```

**Commit Message Format:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### Testing Checklist

Before committing:
- [ ] Code builds without errors
- [ ] TypeScript types are correct
- [ ] No console.log statements
- [ ] Code is formatted (Prettier)
- [ ] ESLint shows no errors
- [ ] Tested feature works locally
- [ ] Database migrations are reversible

---

## 🚢 Deployment

### Option 1: Vercel (Recommended)

**Pros:** Optimized for Next.js, auto-scaling, built-in CDN, zero configuration

**Steps:**
1. Push code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables
4. Deploy with one click

**Cost:** Free tier available, Pro at $20/month

**Detailed guide:** [docs/technical/DEPLOYMENT_GUIDE.md](docs/technical/DEPLOYMENT_GUIDE.md)

---

### Option 2: Self-Hosted

**Requirements:**
- Ubuntu 20.04+ server
- Node.js 18+
- Nginx reverse proxy
- PM2 process manager
- SSL certificate (Let's Encrypt)

**Pros:** Full control, no vendor lock-in, custom configuration

**Cost:** Server costs only (~$5-20/month depending on specs)

**Detailed guide:** [docs/technical/DEPLOYMENT_GUIDE.md](docs/technical/DEPLOYMENT_GUIDE.md#alternative-self-hosted-deployment)

---

### Option 3: Docker (Coming Soon)

Docker deployment configuration is in development.

---

### Production Checklist

- [ ] Supabase production project created
- [ ] Database migration executed
- [ ] Row Level Security policies enabled
- [ ] Environment variables configured
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Admin account created
- [ ] Initial data seeded (departments, courses, halls)
- [ ] Email service configured
- [ ] OAuth credentials updated
- [ ] Backup strategy implemented
- [ ] Monitoring enabled

---

## 🔒 Security

### Application Security

✅ **Authentication**
- Supabase Auth with JWT tokens
- HTTP-only cookies (prevent XSS)
- Secure session management
- Password hashing (bcrypt)

✅ **Authorization**
- Row Level Security (RLS) at database level
- Role-based access control (RBAC)
- API route protection
- UI conditional rendering

✅ **Data Protection**
- Input validation (Zod schemas)
- SQL injection prevention (parameterized queries)
- XSS prevention (React auto-escaping)
- CSRF protection (SameSite cookies)

✅ **Infrastructure**
- HTTPS only in production
- Secure environment variables
- Regular dependency updates
- Security headers

### Reporting Security Issues

If you discover a security vulnerability:
1. **Do not** open a public issue
2. Email security concerns to your administrator
3. Provide detailed information
4. Allow time for patching before disclosure

---

## 🔧 Troubleshooting

### Common Issues

#### Cannot login after deployment
**Solution:** Verify environment variables are set correctly in production

#### Database connection fails
**Solution:** Check Supabase project is running and API keys are correct

#### CSV import shows validation errors
**Solution:** Ensure department and course codes match exactly (case-sensitive)

#### Seat allocation fails
**Solution:** Verify sufficient hall capacity and students are assigned to exam

#### Hall tickets won't download
**Solution:** Check seats are allocated and browser allows PDF downloads

### Getting Help

1. Check the [Documentation](docs/)
2. Review [Troubleshooting Guide](docs/technical/DEPLOYMENT_GUIDE.md#troubleshooting)
3. Search existing GitHub issues
4. Create a new issue with:
   - Detailed problem description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
   - Error messages/screenshots

---

## 🗺️ Roadmap

### Version 1.1 (Planned)
- [ ] Biometric attendance integration
- [ ] SMS notifications for students
- [ ] Advanced reporting and analytics
- [ ] Exam schedule conflict detection
- [ ] Automatic invigilator assignment
- [ ] Multi-language support (Nepali, English)

### Version 1.2 (Under Consideration)
- [ ] Mobile app (React Native)
- [ ] Offline mode for hall tickets
- [ ] Real-time seat availability dashboard
- [ ] Integration with existing student information systems
- [ ] Automated email distribution of hall tickets
- [ ] QR code scanning for attendance

### Version 2.0 (Future)
- [ ] AI-powered seating optimization
- [ ] Predictive analytics for exam planning
- [ ] Virtual/online exam support
- [ ] Integration with learning management systems
- [ ] Advanced security features (facial recognition)

**Want to contribute to the roadmap?** Open an issue with the `enhancement` label!

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

1. **Report Bugs** - Open an issue with the `bug` label
2. **Suggest Features** - Open an issue with the `enhancement` label
3. **Improve Documentation** - Fix typos, add examples, clarify instructions
4. **Submit Pull Requests** - Fix bugs or implement features

### Contribution Guidelines

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with descriptive message** (`git commit -m 'feat: Add AmazingFeature'`)
6. **Push to branch** (`git push origin feature/AmazingFeature`)
7. **Open a Pull Request**

### Code Review Process

- All submissions require review
- Maintainers will provide feedback
- Address requested changes
- Once approved, changes will be merged

### Development Setup

See [Development Setup Guide](docs/technical/DEVELOPMENT_SETUP.md) for detailed instructions on setting up your local environment.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 OCEM Seat Planner

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

### Built With

- [Next.js](https://nextjs.org/) - The React Framework for Production
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components
- [Vercel](https://vercel.com/) - Platform for frontend deployment

### Inspired By

- Real-world challenges faced by educational institutions in Nepal
- Manual seat allocation processes that needed automation
- The need for anti-cheating measures in exam halls

### Special Thanks

- To all educators and administrators who provided feedback
- To the open-source community for amazing tools and libraries
- To early adopters who tested and reported issues

---

## 📞 Support

### Need Help?

- 📖 **Documentation:** Check the [docs folder](docs/) first
- 💬 **Issues:** [Open a GitHub issue](https://github.com/yourusername/Ocem-Seat-Planner/issues)
- 📧 **Email:** Contact your system administrator
- 💡 **Discussions:** Join our community discussions

### Professional Support

For enterprise support, custom development, or consulting:
- Contact your institution's IT department
- Submit a support request through official channels

---

## 📊 Project Statistics

- **Lines of Code:** ~12,000+ (TypeScript, React, SQL)
- **Components:** 50+ reusable React components
- **API Endpoints:** 30+ RESTful endpoints
- **Documentation:** 6,779 lines across 11 files
- **Database Tables:** 11 tables with complete RLS
- **Test Coverage:** Manual testing across all features

---

<div align="center">

**Built with ❤️ for educational institutions in Nepal 🇳🇵**

[⬆ Back to Top](#-ocem-seat-planner)

---

**[Report Bug](https://github.com/yourusername/Ocem-Seat-Planner/issues)** • **[Request Feature](https://github.com/yourusername/Ocem-Seat-Planner/issues)** • **[View Documentation](docs/)** • **[Get Started](#-quick-start)**

*Made with Next.js, TypeScript, and Supabase*

</div>
