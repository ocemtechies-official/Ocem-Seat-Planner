# Deployment Guide

## Table of Contents

1. [Overview](#overview)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Supabase Production Setup](#supabase-production-setup)
4. [Vercel Deployment](#vercel-deployment)
5. [Alternative: Self-Hosted Deployment](#alternative-self-hosted-deployment)
6. [Post-Deployment Configuration](#post-deployment-configuration)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Backup & Recovery](#backup--recovery)
9. [Troubleshooting](#troubleshooting)

---

## Overview

This guide covers deploying Ocem Seat Planner to production. We recommend **Vercel** for hosting (optimized for Next.js) and **Supabase** for the database.

### Recommended Stack

- **Hosting**: Vercel (free tier available)
- **Database**: Supabase (free tier available)
- **Domain**: Custom domain (optional)
- **SSL**: Automatic via Vercel/Supabase

### Estimated Costs

**Free Tier (Suitable for small institutions):**
- Vercel Free: Hobby projects, unlimited websites
- Supabase Free: 500MB database, 2GB file storage, 50,000 monthly active users

**Paid Tier (Recommended for production):**
- Vercel Pro: $20/month (better performance, analytics)
- Supabase Pro: $25/month (8GB database, dedicated resources, daily backups)

**Total**: $45/month for robust production setup

---

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All features tested locally
- [ ] Environment variables documented
- [ ] Database schema finalized
- [ ] Admin account creation process defined
- [ ] Backup strategy planned
- [ ] Domain name registered (if using custom domain)
- [ ] Email service configured (Supabase or external)
- [ ] OAuth credentials obtained (if using Google login)

---

## Supabase Production Setup

### Step 1: Create Production Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Fill in details:
   - **Name**: Ocem Seat Planner Production
   - **Database Password**: Strong password (save securely!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Pro recommended for production
4. Click **"Create Project"**
5. Wait for initialization

### Step 2: Configure Database

1. Go to **SQL Editor**
2. Copy contents of `supabase/migrations/001_initial_schema.sql`
3. Paste and run in SQL Editor
4. Verify all tables created successfully

**Check Tables:**
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Should return 11 tables.

### Step 3: Configure Authentication

**Email Authentication:**
1. Go to **Authentication** → **Providers**
2. Email provider should be enabled by default
3. Configure **Email Templates**:
   - Customize confirmation email
   - Customize password reset email
   - Add institution branding

**Google OAuth** (Optional):
1. Get Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     ```
     https://<your-project-ref>.supabase.co/auth/v1/callback
     https://yourdomain.com/auth/callback
     ```
   - Copy Client ID and Secret

2. In Supabase, go to **Authentication** → **Providers** → **Google**
3. Enable and add credentials
4. Save

### Step 4: Configure Security

**Row Level Security:**
- Already configured via migration
- Verify policies exist:
  ```sql
  SELECT schemaname, tablename, policyname
  FROM pg_policies
  WHERE schemaname = 'public';
  ```

**API Settings:**
1. Go to **Settings** → **API**
2. Note down (save securely):
   - Project URL
   - anon/public key
   - service_role key (secret!)

**Database Settings:**
1. Go to **Settings** → **Database**
2. Note Connection String (for backups)
3. Enable **Pooler** (recommended for production)

### Step 5: Configure Email Service

**Option A: Supabase Built-in (Default)**
- Free tier: 3 emails per hour
- Pro tier: Unlimited via Supabase's SMTP

**Option B: Custom SMTP** (Recommended for production)
1. Set up email service (SendGrid, AWS SES, etc.)
2. Go to **Authentication** → **Settings**
3. Enable **Custom SMTP**
4. Add SMTP credentials
5. Test email delivery

---

## Vercel Deployment

### Step 1: Prepare Repository

Ensure code is in Git repository (GitHub, GitLab, or Bitbucket).

**If not already:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub/GitLab/Bitbucket
3. Authorize Vercel to access repositories

### Step 3: Import Project

1. In Vercel dashboard, click **"Add New"** → **"Project"**
2. Select your repository
3. **Configure Project:**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: Leave as is
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next` (auto-filled)
   - **Install Command**: `pnpm install`

### Step 4: Configure Environment Variables

**Add these environment variables:**

| Variable | Value | Source |
|----------|-------|--------|
| NEXT_PUBLIC_SUPABASE_URL | `https://xxx.supabase.co` | Supabase Settings → API |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | `eyJ...` | Supabase Settings → API (anon public) |
| SUPABASE_SERVICE_ROLE_KEY | `eyJ...` | Supabase Settings → API (service_role) |
| NEXT_PUBLIC_APP_URL | `https://yourdomain.com` | Your domain or Vercel URL |

**In Vercel:**
1. Go to project **Settings** → **Environment Variables**
2. Add each variable for **Production** environment
3. Click **"Save"**

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for build (2-5 minutes)
3. Check deployment logs for errors
4. Once complete, you'll get a URL: `https://your-project.vercel.app`

### Step 6: Test Deployment

1. Visit deployment URL
2. Try to access login page
3. Test login functionality
4. Verify database connection working

---

## Custom Domain Setup

### Step 1: Add Domain in Vercel

1. In Vercel project, go to **Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain: `yourdomain.com`
4. Vercel provides DNS records to configure

### Step 2: Configure DNS

**In your domain registrar:**

**Option A: Using Vercel Nameservers (Recommended)**
1. Change nameservers to Vercel's
2. Automatic SSL certificate

**Option B: Using CNAME Records**
1. Add CNAME record:
   ```
   Type: CNAME
   Name: @ or www
   Value: cname.vercel-dns.com
   TTL: 300
   ```
2. Wait for DNS propagation (up to 48 hours)

### Step 3: Update Supabase Redirect URLs

1. Go to Supabase **Authentication** → **URL Configuration**
2. Add your domain:
   - **Site URL**: `https://yourdomain.com`
   - **Redirect URLs**: `https://yourdomain.com/auth/callback`
3. Save

### Step 4: Update Environment Variables

In Vercel:
1. Go to **Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_APP_URL` to `https://yourdomain.com`
3. Redeploy:
   ```
   Deployments → Click ⋯ → Redeploy
   ```

---

## Alternative: Self-Hosted Deployment

If you prefer to self-host instead of using Vercel:

### Requirements

- Ubuntu 20.04+ server
- Node.js 18+ installed
- Nginx for reverse proxy
- SSL certificate (Let's Encrypt)
- PM2 for process management

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PM2
npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

### Step 2: Deploy Application

```bash
# Clone repository
cd /var/www
sudo git clone <your-repo-url> ocem-seat-planner
cd ocem-seat-planner

# Install dependencies
sudo pnpm install

# Create environment file
sudo nano .env.production

# Add environment variables (same as above)
# Save and exit

# Build application
sudo pnpm build

# Start with PM2
sudo pm2 start npm --name "ocem-seat-planner" -- start
sudo pm2 save
sudo pm2 startup
```

### Step 3: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/ocem-seat-planner
```

Add configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/ocem-seat-planner /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 4: Setup SSL

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow prompts to complete SSL setup.

---

## Post-Deployment Configuration

### Create Initial Admin User

**Method 1: Via Supabase Dashboard**

1. Go to Supabase **Authentication** → **Users**
2. Click **"Add User"**
3. Create admin user:
   - Email: admin@yourinstitution.edu
   - Password: (strong password)
   - Auto Confirm: ✓
4. Copy user ID

5. Go to **SQL Editor**, run:
   ```sql
   INSERT INTO users (id, email, role)
   VALUES ('<user-id-here>', 'admin@yourinstitution.edu', 'admin');
   ```

### Configure Institution Details

**Customize the application:**

1. **Logo**: Add your institution logo to `/public/images/`
2. **Branding**: Update colors in `tailwind.config.ts`
3. **Email Templates**: Customize in Supabase Auth settings
4. **Hall Ticket Header**: Modify in `src/lib/pdf/hall-ticket-generator.ts`

### Setup Initial Data

**Create departments and courses:**

1. Log in as admin
2. Navigate to Departments → Create departments
3. Navigate to Courses → Create courses for each department

**Create exam halls:**

1. Navigate to Halls → Create Hall
2. Configure hall layouts
3. Mark unusable seats if any

---

## Monitoring & Maintenance

### Application Monitoring

**Vercel Analytics:**
1. Go to project in Vercel
2. Navigate to **Analytics** tab
3. View traffic, performance metrics

**Supabase Monitoring:**
1. Go to Supabase project
2. Navigate to **Database** → **Statistics**
3. Monitor query performance, connection count

### Performance Optimization

**Enable Caching:**
- Vercel automatically caches static assets
- Configure ISR (Incremental Static Regeneration) for slower pages

**Database Optimization:**
- Review slow queries in Supabase
- Add indexes if needed
- Enable connection pooling

### Regular Maintenance Tasks

**Daily:**
- Check error logs
- Monitor uptime

**Weekly:**
- Review analytics
- Check database size
- Test critical workflows

**Monthly:**
- Update dependencies
- Review and archive old exams
- Check backup integrity
- Review security logs

---

## Backup & Recovery

### Database Backups

**Automatic (Supabase Pro):**
- Daily automatic backups
- 7-day retention
- Point-in-time recovery available

**Manual Backups:**

```bash
# Using pg_dump
pg_dump -h db.xxx.supabase.co \
  -U postgres \
  -d postgres \
  --no-owner \
  --no-acl \
  > backup_$(date +%Y%m%d).sql
```

**Backup Schedule:**
- Automated: Daily at 2 AM
- Manual: Before major updates
- Store offsite (AWS S3, Google Cloud Storage)

### Restore from Backup

**Via Supabase:**
1. Go to **Database** → **Backups**
2. Select backup to restore
3. Click **"Restore"**
4. Confirm action

**Via SQL:**
```bash
psql -h db.xxx.supabase.co \
  -U postgres \
  -d postgres \
  < backup_20241201.sql
```

---

## Security Best Practices

### Application Security

1. **Environment Variables:**
   - Never commit to repository
   - Rotate keys quarterly
   - Use different keys for dev/prod

2. **Authentication:**
   - Enforce strong passwords
   - Enable email verification
   - Monitor failed login attempts

3. **Database:**
   - Row Level Security enabled
   - Regular security audits
   - Monitor unusual queries

### Server Security (Self-Hosted)

1. **Firewall:**
   ```bash
   sudo ufw allow 22
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```

2. **Keep Updated:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

3. **Disable Root Login:**
   Edit `/etc/ssh/sshd_config`:
   ```
   PermitRootLogin no
   ```

---

## Troubleshooting

### Deployment Fails

**Check build logs:**
1. In Vercel, go to **Deployments**
2. Click failed deployment
3. View logs for errors

**Common issues:**
- Missing environment variables
- TypeScript errors
- Build timeout (increase in settings)

### Database Connection Issues

**Check:**
1. Environment variables correct
2. Supabase project running
3. Network connectivity
4. RLS policies not blocking

**Test connection:**
```bash
# From server/local
psql "postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres"
```

### Application Errors

**Check logs:**

**Vercel:**
- Go to project → **Logs** (real-time)

**Self-hosted:**
```bash
pm2 logs ocem-seat-planner
```

**Supabase:**
- Go to project → **Logs** → **Database Logs**

---

## Scaling Considerations

### When to Upgrade

**Signs you need to upgrade:**
- Slow page loads (>3 seconds)
- Database hitting connection limits
- High error rates
- Running out of storage

### Vertical Scaling (Supabase)

1. Upgrade to Pro or higher tier
2. Increase database size
3. Enable connection pooling
4. Add read replicas

### Horizontal Scaling (Vercel)

- Automatic with Vercel
- Scales based on traffic
- No configuration needed

### Database Optimization

1. **Indexes:**
   - Add for frequently queried columns
   - Monitor slow queries

2. **Archiving:**
   - Move old exam data to archive tables
   - Keep active data small

3. **Connection Pooling:**
   - Enable in Supabase
   - Reduces connection overhead

---

## Rollback Procedure

If deployment causes issues:

### Vercel Rollback

1. Go to **Deployments**
2. Find last working deployment
3. Click ⋯ → **Promote to Production**
4. Confirm

### Database Rollback

1. Go to Supabase **Database** → **Backups**
2. Select backup before changes
3. Click **"Restore"**
4. Test thoroughly

### Code Rollback

```bash
git revert <commit-hash>
git push origin main
# Vercel auto-deploys
```

---

## Support & Resources

### Documentation

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

### Monitoring Tools

- Vercel Analytics (built-in)
- Supabase Dashboard (built-in)
- UptimeRobot (external monitoring)
- Sentry (error tracking)

### Getting Help

- Review this documentation
- Check error logs
- Search community forums
- Contact support (if on paid plan)

---

## Post-Launch Checklist

- [ ] Application accessible at production URL
- [ ] Admin account created and tested
- [ ] All authentication methods working
- [ ] Database connection verified
- [ ] Sample data created
- [ ] Email delivery working
- [ ] SSL certificate active
- [ ] Backups configured
- [ ] Monitoring enabled
- [ ] Documentation updated with production URLs
- [ ] Users trained on system
- [ ] Support process established

---

**Version**: 1.0.0
**Last Updated**: 2025-01-21

**Congratulations on deploying Ocem Seat Planner!**
