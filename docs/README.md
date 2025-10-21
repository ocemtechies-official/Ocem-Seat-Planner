# Ocem Seat Planner Documentation

Welcome to the Ocem Seat Planner documentation. This comprehensive guide will help you understand, use, and maintain the exam seat planner system.

## What is Ocem Seat Planner?

Ocem Seat Planner is an automated exam hall seating arrangement system designed for educational institutions in Nepal. The system manages student seating during examinations with anti-cheating measures, ensuring students are optimally placed to maintain exam integrity.

## Key Features

- **Student Management**: Bulk import from CSV/Excel, manual entry, search and filtering
- **Exam Hall Management**: Configure exam halls with visual layout editors
- **Automated Seat Allocation**: 4 anti-cheating placement patterns to prevent academic dishonesty
- **Hall Ticket Generation**: Professional PDF hall tickets with QR codes
- **Role-Based Access Control**: Admin, Staff, Supervisor, and Student roles with specific permissions
- **Student Portal**: Students can view their seat assignments and download hall tickets
- **Dashboard & Analytics**: Real-time statistics and upcoming exams overview

## Documentation Structure

### User Guides
- [Admin Guide](./guides/ADMIN_GUIDE.md) - Complete guide for system administrators
- [Staff Guide](./guides/STAFF_GUIDE.md) - Guide for teaching staff and exam coordinators
- [Student Guide](./guides/STUDENT_GUIDE.md) - Guide for students to view their exams and seats
- [CSV Import Guide](./guides/CSV_IMPORT_GUIDE.md) - How to import students from CSV/Excel files

### Technical Documentation
- [System Overview](./technical/SYSTEM_OVERVIEW.md) - Architecture and technology stack
- [Database Schema](./technical/DATABASE_SCHEMA.md) - Complete database structure and relationships
- [API Documentation](./technical/API_DOCUMENTATION.md) - All API endpoints with examples
- [Deployment Guide](./technical/DEPLOYMENT_GUIDE.md) - How to deploy the application
- [Development Setup](./technical/DEVELOPMENT_SETUP.md) - Local development environment setup

### Templates
- [CSV Import Template](./templates/student_import_template.csv) - Template file for student import
- [Excel Import Template](./templates/student_import_template.xlsx) - Excel template for student import

## Quick Start

### For Administrators
1. Log in with admin credentials
2. Set up departments and courses
3. Create exam halls
4. Create user accounts for staff
5. Import or add students
6. Create exams and allocate seats

### For Staff
1. Log in with staff credentials
2. Import students for your department
3. Create exams for your courses
4. Assign students and halls to exams
5. Run seat allocation algorithm
6. Generate and distribute hall tickets

### For Students
1. Register with your roll number
2. Log in to view your exams
3. Check your seat assignments
4. Download your hall tickets

## Support

For technical issues or questions:
- Check the relevant documentation section
- Review the troubleshooting guides
- Contact your system administrator

## System Requirements

**Server Requirements:**
- Node.js 18+
- PostgreSQL 14+ (via Supabase)
- 2GB RAM minimum
- 10GB storage

**Browser Support:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Technologies Used

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth (Email/Password + Google OAuth)
- **PDF Generation**: jsPDF with QR codes
- **File Processing**: Papa Parse (CSV), xlsx (Excel)

## License

This software is developed for educational institutions in Nepal.

---

**Version**: 1.0.0
**Last Updated**: 2025-01-21
