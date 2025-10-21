# Development Setup Guide

## Prerequisites

Before setting up the development environment, ensure you have:

- **Node.js** 18.x or higher
- **pnpm** 8.x or higher (package manager)
- **Git** for version control
- **Code Editor** (VS Code recommended)
- **Supabase Account** (free tier works for development)

## System Requirements

**Minimum:**
- 4GB RAM
- 2GB free disk space
- Modern browser (Chrome, Firefox, Edge)

**Recommended:**
- 8GB+ RAM
- 5GB+ free disk space
- Dual monitor setup for better development experience

---

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Ocem-Seat-Planner
```

---

## Step 2: Install Dependencies

### Install pnpm (if not already installed)

```bash
npm install -g pnpm
```

### Install Project Dependencies

```bash
pnpm install
```

This will install all required dependencies including:
- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Supabase client
- shadcn/ui components
- And all other dependencies

---

## Step 3: Supabase Setup

### Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in project details:
   - **Name**: Ocem Seat Planner Dev
   - **Database Password**: Create strong password (save this!)
   - **Region**: Choose closest to you
5. Click **"Create Project"**
6. Wait for project to initialize (~2 minutes)

### Get API Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: https://xxxxx.supabase.co)
   - **anon/public key** (starts with eyJ...)
   - Go to **Settings** → **Database** → Copy **Connection String**

### Create Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Open the migration file from your local project:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
3. Copy all contents
4. Paste into Supabase SQL Editor
5. Click **"Run"**
6. Verify: Should see "Success. No rows returned" message
7. Go to **Table Editor** → Verify all 11 tables created

**Tables that should exist:**
- departments
- courses
- users
- students
- exam_halls
- seats
- exams
- exam_students
- exam_halls_assignments
- seat_assignments
- staff_permissions

### Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**

2. **Email Provider:**
   - Already enabled by default
   - Configure email templates if desired

3. **Google OAuth** (Optional but recommended):
   - Click **"Google"**
   - Enable the provider
   - Get credentials from Google Cloud Console:
     - Go to [console.cloud.google.com](https://console.cloud.google.com)
     - Create new project or select existing
     - Enable Google+ API
     - Create OAuth 2.0 credentials
     - Add authorized redirect URI:
       ```
       https://<your-project-ref>.supabase.co/auth/v1/callback
       ```
   - Copy Client ID and Client Secret to Supabase
   - Save

---

## Step 4: Environment Configuration

### Create Environment File

In the project root, create `.env.local`:

```bash
cp .env.example .env.local
```

### Configure Environment Variables

Edit `.env.local` with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Where to find these:**
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase Settings → API → Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase Settings → API → anon public key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase Settings → API → service_role key (secret!)

**Important:** Never commit `.env.local` to version control!

---

## Step 5: Create Initial Admin User

### Option A: Via Supabase Dashboard (Recommended)

1. Go to Supabase dashboard → **Authentication** → **Users**
2. Click **"Add User"** → **"Create new user"**
3. Fill in:
   - **Email**: admin@example.com
   - **Password**: Create secure password
   - **Auto Confirm User**: ✓ (checked)
4. Click **"Create User"**
5. Copy the user ID (UUID)

6. Go to **SQL Editor** → **New Query**
7. Run this SQL (replace UUID with copied ID):
   ```sql
   INSERT INTO users (id, email, role)
   VALUES ('paste-user-uuid-here', 'admin@example.com', 'admin');
   ```
8. Run query

### Option B: Via SQL Only

Run this in Supabase SQL Editor:

```sql
-- This will create both auth user and database record
-- Note: Supabase auto-hashes the password
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@example.com',
  crypt('YourSecurePassword123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated'
) RETURNING id;

-- Then insert into users table with the returned ID
INSERT INTO users (id, email, role)
VALUES ('<id-from-above>', 'admin@example.com', 'admin');
```

---

## Step 6: Run Development Server

### Start the Development Server

```bash
pnpm dev
```

**Expected output:**
```
▲ Next.js 15.5.6
- Local:        http://localhost:3000
- ready started server on 0.0.0.0:3000
```

### Access the Application

1. Open browser
2. Navigate to: http://localhost:3000
3. You should see the login page
4. Log in with admin credentials

---

## Step 7: Seed Sample Data (Optional)

### Create Sample Departments

Run in Supabase SQL Editor:

```sql
INSERT INTO departments (id, name, code) VALUES
  (gen_random_uuid(), 'Computer Science', 'CS'),
  (gen_random_uuid(), 'Mathematics', 'MATH'),
  (gen_random_uuid(), 'Physics', 'PHY'),
  (gen_random_uuid(), 'English', 'ENG');
```

### Create Sample Courses

```sql
INSERT INTO courses (id, department_id, name, code, year, semester)
SELECT
  gen_random_uuid(),
  d.id,
  'Programming Fundamentals',
  'CS101',
  1,
  1
FROM departments d WHERE d.code = 'CS';

INSERT INTO courses (id, department_id, name, code, year, semester)
SELECT
  gen_random_uuid(),
  d.id,
  'Calculus I',
  'MATH101',
  1,
  1
FROM departments d WHERE d.code = 'MATH';
```

### Create Sample Exam Hall

```sql
INSERT INTO exam_halls (id, name, total_seats, rows, columns)
VALUES (
  gen_random_uuid(),
  'Main Hall A',
  40,
  10,
  4
);
```

### Create Seats for Hall

```sql
-- This generates 40 seats (10 rows × 4 columns)
INSERT INTO seats (id, hall_id, seat_number, row_number, col_number, is_usable)
SELECT
  gen_random_uuid(),
  eh.id,
  CONCAT(r.row, CASE
    WHEN c.col = 1 THEN 'A'
    WHEN c.col = 2 THEN 'B'
    WHEN c.col = 3 THEN 'C'
    WHEN c.col = 4 THEN 'D'
  END),
  r.row,
  c.col,
  true
FROM exam_halls eh
CROSS JOIN generate_series(1, 10) AS r(row)
CROSS JOIN generate_series(1, 4) AS c(col)
WHERE eh.name = 'Main Hall A';
```

---

## Development Workflow

### Running in Development Mode

```bash
pnpm dev
```

**Features:**
- Hot reload on file changes
- TypeScript type checking
- Fast Refresh for React components
- Detailed error messages

### Building for Production (Test)

```bash
pnpm build
```

This checks for:
- TypeScript errors
- Build errors
- Linting issues

### Running Linter

```bash
pnpm lint
```

Checks code quality and style.

### Type Checking Only

```bash
pnpm tsc --noEmit
```

Checks TypeScript without building.

---

## VS Code Setup (Recommended)

### Install Extensions

1. **ESLint** - Linting
2. **Prettier** - Code formatting
3. **Tailwind CSS IntelliSense** - Tailwind autocomplete
4. **TypeScript Vue Plugin** - TypeScript support

### Workspace Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

### Recommended Settings

- **Tab Size**: 2 spaces
- **Format on Save**: Enabled
- **Auto Save**: onFocusChange

---

## Troubleshooting

### Port 3000 Already in Use

```bash
# Kill the process using port 3000
# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port:
pnpm dev -- -p 3001
```

### Dependencies Installation Fails

```bash
# Clear cache and reinstall
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### Supabase Connection Issues

**Check:**
1. Environment variables are correct
2. Supabase project is running
3. API keys are valid
4. Network connectivity

**Test connection:**
```typescript
// Add this to a page temporarily
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
const { data, error } = await supabase.from('departments').select('count');
console.log('Connection test:', data, error);
```

### RLS Policy Errors

**Error:** "Row Level Security policy violation"

**Solution:**
1. Verify RLS policies created
2. Check user authentication
3. Verify role in users table
4. Review policy conditions

---

## Project Structure

```
Ocem-Seat-Planner/
├── src/
│   ├── app/                     # Next.js app directory
│   │   ├── (auth)/              # Auth pages
│   │   ├── (dashboard)/         # Dashboard pages
│   │   ├── api/                 # API routes
│   │   └── auth/callback/       # OAuth callback
│   ├── components/              # React components
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── layout/              # Layout components
│   │   └── [feature]/           # Feature-specific components
│   ├── lib/                     # Utility functions
│   │   ├── supabase/            # Supabase clients
│   │   ├── db/                  # Database operations
│   │   ├── algorithms/          # Seat allocation
│   │   ├── parsers/             # CSV/Excel parsing
│   │   └── pdf/                 # PDF generation
│   ├── hooks/                   # Custom React hooks
│   ├── types/                   # TypeScript types
│   └── middleware.ts            # Auth middleware
├── supabase/
│   └── migrations/              # Database migrations
├── public/                      # Static assets
├── docs/                        # Documentation
├── .env.local                   # Environment variables (gitignored)
├── .env.example                 # Example environment file
├── next.config.js               # Next.js config
├── tailwind.config.ts           # Tailwind config
├── tsconfig.json                # TypeScript config
└── package.json                 # Dependencies
```

---

## Testing

### Manual Testing Checklist

- [ ] User can register
- [ ] User can login
- [ ] Admin can create department
- [ ] Admin can create course
- [ ] Staff can add student
- [ ] Staff can import students (CSV)
- [ ] Admin can create hall
- [ ] Staff can create exam
- [ ] Staff can assign students to exam
- [ ] Staff can assign halls to exam
- [ ] Staff can run seat allocation
- [ ] Staff can view seating chart
- [ ] Staff can generate hall tickets
- [ ] Student can view their exams
- [ ] Student can download hall ticket

---

## Best Practices

### Git Workflow

1. Create feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make changes and commit:
   ```bash
   git add .
   git commit -m "feat: descriptive message"
   ```

3. Push and create pull request

### Commit Message Format

```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
Example: feat(auth): add Google OAuth support
```

### Code Style

- Use TypeScript for all new files
- Follow existing patterns
- Add comments for complex logic
- Use meaningful variable names
- Keep functions small and focused

### Database Changes

- Always create migration files
- Test migrations locally first
- Document schema changes
- Update types after schema changes

---

## Additional Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

### Learning Resources

- [Next.js Learn](https://nextjs.org/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React Documentation](https://react.dev)

---

## Support

**For issues:**
- Check this documentation
- Review error messages
- Search existing issues
- Create new issue with details

**For questions:**
- Consult team members
- Review code comments
- Check API documentation

---

**Version**: 1.0.0
**Last Updated**: 2025-01-21

**Happy coding!**
