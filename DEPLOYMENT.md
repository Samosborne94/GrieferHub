# GrieferHub Deployment Guide

## 📋 Table of Contents

- [Overview](#overview)
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Deployment Platforms](#deployment-platforms)
- [Production Environment Setup](#production-environment-setup)
- [Database Setup (Airtable Production)](#database-setup-airtable-production)
- [Media Storage (Cloudinary Production)](#media-storage-cloudinary-production)
- [Domain and DNS Configuration](#domain-and-dns-configuration)
- [SSL/TLS Certificates](#ssltls-certificates)
- [Monitoring and Logging](#monitoring-and-logging)
- [Backup and Recovery](#backup-and-recovery)
- [Performance Optimization](#performance-optimization)
- [Security Hardening](#security-hardening)
- [CI/CD Pipeline](#cicd-pipeline)
- [Scaling Strategies](#scaling-strategies)
- [Troubleshooting Production Issues](#troubleshooting-production-issues)

---

## Overview

This guide covers deploying GrieferHub to production environments. GrieferHub is a Next.js 14 application that can be deployed to various platforms.

### Recommended Stack

- **Hosting**: Vercel (recommended) or Netlify
- **Database**: Airtable (current) or PostgreSQL (future)
- **Media Storage**: Cloudinary
- **CDN**: Built-in with Vercel/Netlify
- **DNS**: Cloudflare (recommended)
- **Monitoring**: Vercel Analytics / Sentry
- **Email**: SendGrid / Resend (future)

---

## Pre-Deployment Checklist

Before deploying to production, ensure you have:

### Code Preparation

- [ ] All tests passing (`npm test`)
- [ ] Linting passes without errors (`npm run lint`)
- [ ] Code formatted (`npm run format`)
- [ ] TypeScript compilation succeeds (`npm run build`)
- [ ] No console errors in browser
- [ ] All environment variables documented
- [ ] Security vulnerabilities fixed (`npm audit`)
- [ ] Dependencies updated to stable versions

### Configuration

- [ ] Production environment variables prepared
- [ ] Airtable production base created and configured
- [ ] Cloudinary production account set up
- [ ] Domain name registered
- [ ] SSL certificate plan (usually automatic with hosts)
- [ ] Error tracking configured (Sentry)
- [ ] Analytics configured (Google Analytics, Vercel Analytics)

### Documentation

- [ ] README.md updated with production URL
- [ ] API documentation current
- [ ] Environment variable guide complete
- [ ] Deployment steps documented

### Testing

- [ ] Manual testing on staging environment
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness verified
- [ ] Load testing performed (optional)
- [ ] Security audit completed

---

## Deployment Platforms

### Option 1: Vercel (Recommended)

**Pros**:

- Optimized for Next.js (same company)
- Automatic deployments from Git
- Edge network with global CDN
- Automatic SSL certificates
- Built-in analytics and monitoring
- Generous free tier
- Preview deployments for PRs

**Pricing**:

- **Hobby**: Free (100GB bandwidth, unlimited sites)
- **Pro**: $20/month (1TB bandwidth, advanced features)
- **Enterprise**: Custom pricing

#### Deployment Steps (Vercel)

1. **Install Vercel CLI** (optional):

   ```bash
   npm install -g vercel
   ```

2. **Connect Repository**:

   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub account
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js configuration

3. **Configure Project**:

   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Set Environment Variables**:

   - Go to Project Settings > Environment Variables
   - Add all production environment variables:

   ```bash
   AIRTABLE_API_KEY=prod_key
   AIRTABLE_BASE_ID=prod_base_id
   NEXTAUTH_SECRET=prod_secret
   NEXTAUTH_URL=https://yourdomain.com
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=prod_cloud
   CLOUDINARY_API_KEY=prod_key
   CLOUDINARY_API_SECRET=prod_secret
   NODE_ENV=production
   ```

5. **Deploy**:

   - Click "Deploy"
   - Vercel builds and deploys automatically
   - Get deployment URL (e.g., `grieferhub.vercel.app`)

6. **Custom Domain** (optional):
   - Go to Project Settings > Domains
   - Add your custom domain (e.g., `grieferhub.com`)
   - Update DNS records (Vercel provides instructions)
   - SSL certificate auto-provisioned

#### Automatic Deployments

Vercel automatically deploys:

- **Production**: On push to `main` branch
- **Preview**: On pull requests
- **Rollback**: One-click rollback to previous deployment

---

### Option 2: Netlify

**Pros**:

- Excellent free tier
- Simple deployment process
- Built-in form handling
- Serverless functions support
- Split testing (A/B testing)

**Pricing**:

- **Starter**: Free (100GB bandwidth)
- **Pro**: $19/month (1TB bandwidth)
- **Business**: $99/month (advanced features)

#### Deployment Steps (Netlify)

1. **Connect Repository**:

   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub account
   - Click "Add new site" > "Import an existing project"
   - Select your GitHub repository

2. **Configure Build Settings**:

   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Functions directory**: `netlify/functions` (if using)

3. **Set Environment Variables**:

   - Go to Site Settings > Build & Deploy > Environment
   - Add all production environment variables

4. **Deploy**:

   - Click "Deploy site"
   - Netlify builds and deploys automatically

5. **Custom Domain**:
   - Go to Domain Settings
   - Add custom domain
   - Update DNS records
   - SSL certificate auto-provisioned

---

### Option 3: AWS (Advanced)

**Pros**:

- Full control and flexibility
- Scalable to millions of users
- Integration with AWS services
- Cost-effective at scale

**Cons**:

- Complex setup
- Requires DevOps knowledge
- More expensive for small scale

#### Deployment Options on AWS

1. **AWS Amplify** (Easiest):

   - Managed service similar to Vercel
   - Connect GitHub repository
   - Automatic deployments

2. **AWS Elastic Beanstalk**:

   - Deploy Next.js as Node.js application
   - Auto-scaling and load balancing

3. **AWS ECS/EKS** (Advanced):
   - Docker containers
   - Kubernetes orchestration
   - Maximum control and scalability

---

### Option 4: Self-Hosted (VPS)

**Pros**:

- Full control
- Predictable costs
- Can optimize for specific needs

**Cons**:

- Requires server management
- Security is your responsibility
- No automatic scaling

#### Providers

- DigitalOcean
- Linode
- Vultr
- Hetzner

#### Deployment Steps (Self-Hosted)

1. **Set Up Server**:

   ```bash
   # Ubuntu 22.04 LTS recommended
   ssh root@your-server-ip
   apt update && apt upgrade -y
   ```

2. **Install Node.js**:

   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
   apt install -y nodejs
   node --version
   ```

3. **Install PM2** (Process Manager):

   ```bash
   npm install -g pm2
   ```

4. **Clone Repository**:

   ```bash
   cd /var/www
   git clone https://github.com/yourusername/GrieferHub.git
   cd GrieferHub
   ```

5. **Install Dependencies**:

   ```bash
   npm install --production
   ```

6. **Set Environment Variables**:

   ```bash
   nano .env.production
   # Add all environment variables
   ```

7. **Build Application**:

   ```bash
   npm run build
   ```

8. **Start with PM2**:

   ```bash
   pm2 start npm --name "grieferhub" -- start
   pm2 save
   pm2 startup
   ```

9. **Set Up Nginx** (Reverse Proxy):

   ```bash
   apt install -y nginx
   nano /etc/nginx/sites-available/grieferhub
   ```

   Configuration:

   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable site:

   ```bash
   ln -s /etc/nginx/sites-available/grieferhub /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

10. **Install SSL Certificate** (Certbot):

    ```bash
    apt install -y certbot python3-certbot-nginx
    certbot --nginx -d yourdomain.com
    ```

---

## Production Environment Setup

### Environment Variables for Production

Create a `.env.production` file or set in your hosting platform:

```bash
# ==========================================
# Production Environment Variables
# ==========================================

# Node Environment
NODE_ENV=production

# Application URL
NEXTAUTH_URL=https://grieferhub.com

# NextAuth Secret (Generate new for production!)
NEXTAUTH_SECRET=your_production_secret_here

# Airtable Production
AIRTABLE_API_KEY=your_production_api_key
AIRTABLE_BASE_ID=your_production_base_id

# Cloudinary Production
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=grieferhub-production
CLOUDINARY_API_KEY=your_production_api_key
CLOUDINARY_API_SECRET=your_production_api_secret

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
SENTRY_DSN=https://your-sentry-dsn@sentry.io/123456

# Email Service (Future)
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@grieferhub.com

# Feature Flags
ENABLE_MODERATION=true
ENABLE_ANALYTICS=true
ENABLE_COMMENTS=false
```

### Security Best Practices for Environment Variables

1. **Never commit** `.env.production` to version control
2. **Generate new secrets** for production (don't reuse development secrets)
3. **Use strong secrets**: Minimum 32 characters, random
4. **Rotate secrets** regularly (quarterly)
5. **Use secret management** services (AWS Secrets Manager, HashiCorp Vault)
6. **Limit access** to production environment variables

---

## Database Setup (Airtable Production)

### Create Production Base

1. **Create New Base**:

   - Log in to [Airtable](https://airtable.com)
   - Create a new base: "GrieferHub Production"
   - **Do not use development base for production**

2. **Set Up Tables**:

   Copy table structure from development:

   **Users Table**:

   - id (Autonumber)
   - username (Single line text)
   - email (Email)
   - password_hash (Single line text)
   - role (Single select: user, moderator, admin)
   - created_at (Created time)

   **Reports Table**:

   - id (Autonumber)
   - reporter_id (Link to Users)
   - griefer_name (Single line text)
   - game (Single select)
   - description (Long text)
   - evidence_url (URL)
   - status (Single select: Under Review, Verified, Resolved, Rejected)
   - severity (Single select: Low, Medium, High, Critical)
   - server (Single line text)
   - tags (Multiple select)
   - created_at (Created time)
   - updated_at (Last modified time)

3. **Create API Token**:

   - Go to [airtable.com/account](https://airtable.com/account)
   - Create new Personal Access Token
   - Name: "GrieferHub Production"
   - Scopes: `data.records:read`, `data.records:write`
   - Select "GrieferHub Production" base
   - Copy token and add to environment variables

4. **Set Permissions**:

   - Keep base private
   - Only grant access to necessary team members
   - Use separate tokens for different environments

5. **Backup Strategy**:
   - Enable version history (Airtable Pro)
   - Regular CSV exports (automated)
   - Consider syncing to backup database

### Data Migration (Optional)

If migrating from development to production:

```bash
# Export development data
# Use Airtable's export feature or API

# Import to production base
# Use Airtable's import feature or API
```

**Warning**: Ensure sensitive data (passwords, emails) are properly handled during migration.

---

## Media Storage (Cloudinary Production)

### Production Account Setup

1. **Create Production Account**:

   - Create separate Cloudinary account for production
   - Or use folders to separate dev/prod

2. **Configure Upload Settings**:

   - Go to Settings > Upload
   - Create upload preset: "grieferhub-production"
   - Folder: `production/reports`
   - File size limits: 10MB (images), 100MB (videos)
   - Allowed formats: jpg, png, gif, webp, mp4, webm

3. **Set Up Transformations**:

   - **Thumbnails**: `w_300,h_200,c_fill`
   - **Medium**: `w_800,h_600,c_limit`
   - **Large**: `w_1920,h_1080,c_limit`
   - **Video**: `q_auto,f_auto,vc_auto`

4. **Configure CDN**:

   - Use Cloudinary's CDN for global distribution
   - Consider custom CNAME (cdn.grieferhub.com)

5. **Set Up Access Control**:

   - Use signed URLs for sensitive media
   - Set expiration on temporary links

6. **Backup Strategy**:
   - Enable Cloudinary backup addon
   - Regular backups to S3 (optional)

### Environment Variables

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=grieferhub-production
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_production_api_secret
CLOUDINARY_UPLOAD_PRESET=grieferhub-production
```

---

## Domain and DNS Configuration

### Domain Registration

**Recommended Registrars**:

- Namecheap
- Google Domains
- Cloudflare Registrar

**Domain Options**:

- `grieferhub.com` (primary)
- `grieferhub.gg` (gaming-focused)
- `griefer-hub.com` (alternative)

### DNS Configuration

#### Option 1: Cloudflare (Recommended)

1. **Add Site to Cloudflare**:

   - Go to [cloudflare.com](https://cloudflare.com)
   - Add your domain
   - Update nameservers at your registrar

2. **Configure DNS Records**:

   ```
   Type   Name    Content                   Proxy Status
   ─────────────────────────────────────────────────────
   A      @       76.76.21.21              Proxied
   CNAME  www     grieferhub.com           Proxied
   CNAME  api     grieferhub.vercel.app    Proxied
   CNAME  cdn     res.cloudinary.com       DNS only
   ```

3. **Enable Features**:
   - SSL/TLS: Full (Strict)
   - Auto Minify: HTML, CSS, JS
   - Brotli Compression: On
   - HTTP/2 and HTTP/3: On
   - DNSSEC: Enabled

#### Option 2: Direct to Vercel

1. **Add Domain in Vercel**:

   - Go to Project Settings > Domains
   - Add domain: `grieferhub.com`

2. **Update DNS at Registrar**:
   ```
   Type   Name    Value
   ─────────────────────────────────
   A      @       76.76.21.21
   CNAME  www     cname.vercel-dns.com
   ```

### Subdomain Configuration

- **api**.grieferhub.com - API endpoint
- **cdn**.grieferhub.com - CDN for static assets
- **docs**.grieferhub.com - Documentation site
- **staging**.grieferhub.com - Staging environment

---

## SSL/TLS Certificates

### Automatic SSL (Vercel/Netlify)

- SSL certificates automatically provisioned via Let's Encrypt
- Auto-renewal every 90 days
- Supports custom domains
- **No action required**

### Manual SSL Setup (Self-Hosted)

1. **Install Certbot**:

   ```bash
   apt install certbot python3-certbot-nginx
   ```

2. **Obtain Certificate**:

   ```bash
   certbot --nginx -d grieferhub.com -d www.grieferhub.com
   ```

3. **Auto-Renewal**:
   ```bash
   certbot renew --dry-run
   ```

### SSL Best Practices

- Use HTTPS everywhere (redirect HTTP to HTTPS)
- Enable HSTS (HTTP Strict Transport Security)
- Use TLS 1.2 or higher
- Implement proper certificate chain
- Monitor certificate expiration

---

## Monitoring and Logging

### Error Tracking (Sentry)

1. **Create Sentry Account**:

   - Sign up at [sentry.io](https://sentry.io)
   - Create new project (Next.js)

2. **Install Sentry SDK**:

   ```bash
   npm install @sentry/nextjs
   ```

3. **Configure Sentry**:

   ```bash
   npx @sentry/wizard -i nextjs
   ```

4. **Add DSN to Environment**:
   ```bash
   SENTRY_DSN=https://your-sentry-dsn@sentry.io/123456
   ```

### Analytics

#### Vercel Analytics

- Built-in analytics
- Real User Monitoring (RUM)
- Web Vitals tracking
- **Free on Hobby plan**

#### Google Analytics

1. **Create GA4 Property**:

   - Go to [analytics.google.com](https://analytics.google.com)
   - Create account and property

2. **Add Tracking Code**:

   ```bash
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

3. **Implement in `_app.tsx`**:
   ```typescript
   import Script from 'next/script';
   // Add Google Analytics script
   ```

### Logging

#### Application Logs

- Use structured logging (e.g., Winston, Pino)
- Log important events (auth, errors, API calls)
- Different log levels (debug, info, warn, error)

#### Access Logs

- Vercel/Netlify provide access logs
- Self-hosted: Use Nginx access logs

#### Log Aggregation

- **CloudWatch** (AWS)
- **Logtail** (simple)
- **Datadog** (enterprise)
- **New Relic** (APM)

---

## Backup and Recovery

### Database Backups (Airtable)

1. **Automated Exports**:

   - Use Airtable API to export data daily
   - Store backups in S3 or Google Cloud Storage

2. **Manual Backups**:

   - Export as CSV from Airtable UI
   - Keep weekly snapshots

3. **Version History**:
   - Airtable Pro includes version history
   - Can restore deleted records

### Media Backups (Cloudinary)

1. **Cloudinary Backup Addon**:

   - Automatic backups to S3
   - Point-in-time recovery

2. **Manual Sync**:
   - Periodically sync to separate storage

### Code Backups

- **Git repository** on GitHub (primary backup)
- Multiple remote repositories (GitHub, GitLab, Bitbucket)
- Local backups of repository

### Disaster Recovery Plan

1. **Regular backups** (daily/weekly/monthly)
2. **Test recovery** process quarterly
3. **Document recovery steps**
4. **Maintain recovery time objective** (RTO: 4 hours)
5. **Maintain recovery point objective** (RPO: 24 hours)

---

## Performance Optimization

### CDN Configuration

- Use Cloudflare or Vercel's built-in CDN
- Enable edge caching
- Set appropriate cache headers

### Image Optimization

- Use Next.js Image component
- Enable AVIF and WebP formats
- Lazy load images below the fold
- Responsive images for different screen sizes

### Code Optimization

- Minimize JavaScript bundle size
- Code splitting and lazy loading
- Tree shaking to remove unused code
- Minification and compression (Gzip, Brotli)

### Database Optimization

- Index frequently queried fields
- Optimize Airtable queries
- Use caching (SWR) for repeated requests
- Consider read replicas for scaling

### Caching Strategy

- **Static Assets**: Cache for 1 year
- **API Responses**: Cache for 5 minutes (with revalidation)
- **HTML Pages**: ISR with revalidation
- **Images/Videos**: Cache on CDN

---

## Security Hardening

### Application Security

- [ ] **Authentication**: Secure JWT sessions
- [ ] **Authorization**: Role-based access control
- [ ] **Input Validation**: Validate all user inputs
- [ ] **XSS Protection**: Sanitize output
- [ ] **CSRF Protection**: Use CSRF tokens
- [ ] **SQL Injection**: Use parameterized queries (Airtable API)
- [ ] **Rate Limiting**: Prevent abuse
- [ ] **Security Headers**: CSP, HSTS, X-Frame-Options

### Environment Security

- [ ] **Secrets Management**: Never expose secrets
- [ ] **Access Control**: Limit who can deploy
- [ ] **Network Security**: Use firewalls
- [ ] **SSL/TLS**: Enforce HTTPS
- [ ] **Dependencies**: Regular security audits
- [ ] **Logging**: Monitor suspicious activity

### Security Headers

Configure in `next.config.js`:

```javascript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
      ],
    },
  ];
}
```

---

## CI/CD Pipeline

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Run linter
        run: npm run lint

      - name: Build
        run: npm run build
        env:
          AIRTABLE_API_KEY: ${{ secrets.AIRTABLE_API_KEY }}
          AIRTABLE_BASE_ID: ${{ secrets.AIRTABLE_BASE_ID }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Pipeline Stages

1. **Code Checkout**
2. **Install Dependencies**
3. **Run Tests**
4. **Run Linter**
5. **Build Application**
6. **Deploy to Staging** (optional)
7. **Run E2E Tests** (optional)
8. **Deploy to Production**
9. **Health Check**
10. **Notify Team**

---

## Scaling Strategies

### Horizontal Scaling

- Deploy to multiple regions (Vercel Edge)
- Load balancing across instances
- Database read replicas

### Vertical Scaling

- Upgrade server resources (CPU, RAM)
- Optimize application code
- Increase database capacity

### Caching

- Edge caching at CDN level
- Application-level caching (Redis)
- Database query caching

### Database Scaling

- Migrate from Airtable to PostgreSQL (for large scale)
- Implement sharding
- Use read replicas

---

## Troubleshooting Production Issues

### Common Issues

#### 1. 500 Internal Server Error

**Causes**:

- Environment variables missing
- Database connection failure
- Unhandled exceptions

**Solutions**:

- Check Vercel logs
- Verify environment variables
- Review Sentry error reports

#### 2. Slow Page Load

**Causes**:

- Large JavaScript bundle
- Unoptimized images
- Slow database queries

**Solutions**:

- Analyze bundle size (webpack-bundle-analyzer)
- Optimize images
- Add database indexes
- Implement caching

#### 3. Authentication Issues

**Causes**:

- Incorrect NEXTAUTH_URL
- Cookie settings
- CORS issues

**Solutions**:

- Verify NEXTAUTH_URL matches domain
- Check cookie settings (secure, sameSite)
- Configure CORS properly

### Debugging Tools

- **Vercel Logs**: View deployment and runtime logs
- **Sentry**: Error tracking and debugging
- **Chrome DevTools**: Network, Console, Performance tabs
- **Lighthouse**: Performance audits

---

**Last Updated**: 2026-01-12
**Maintained by**: GrieferHub DevOps Team

**Need Help?** Create an issue on GitHub or contact the team!
