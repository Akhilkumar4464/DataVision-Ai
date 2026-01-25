# DataVision Deployment Guide

## Vercel Deployment (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- MongoDB Atlas account (free tier available)

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**
   
   In Vercel project settings, add:
   ```
   NEXTAUTH_URL=https://your-project.vercel.app
   NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/datavision
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Visit your deployed URL

### MongoDB Atlas Setup

1. **Create Cluster**
   - Sign up at https://www.mongodb.com/cloud/atlas
   - Create free M0 cluster

2. **Configure Database Access**
   - Database Access → Add New Database User
   - Create username and password
   - Save credentials

3. **Configure Network Access**
   - Network Access → Add IP Address
   - Add `0.0.0.0/0` for all IPs (or specific IPs)

4. **Get Connection String**
   - Clusters → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your password
   - Add database name: `/datavision`

## Other Platforms

### Railway

1. Create new project
2. Connect GitHub repo
3. Add environment variables
4. Add MongoDB service or external MongoDB
5. Deploy

### Render

1. Create new Web Service
2. Connect GitHub repo
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Add environment variables
6. Deploy

### Self-Hosted (VPS/Dedicated Server)

1. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clone Repository**
   ```bash
   git clone <repo-url>
   cd datavision
   npm install
   ```

3. **Set Environment Variables**
   ```bash
   nano .env.local
   # Add your environment variables
   ```

4. **Build and Start**
   ```bash
   npm run build
   npm start
   ```

5. **Use PM2 for Process Management**
   ```bash
   npm install -g pm2
   pm2 start npm --name "datavision" -- start
   pm2 save
   pm2 startup
   ```

6. **Setup Nginx (Optional)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
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

## Environment Variables Reference

### Required
- `NEXTAUTH_URL`: Your production URL (e.g., `https://datavision.vercel.app`)
- `NEXTAUTH_SECRET`: Random secret (generate with `openssl rand -base64 32`)
- `MONGODB_URI`: MongoDB connection string

### Optional
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (`production` or `development`)

## Post-Deployment

1. **Test Authentication**
   - Visit your deployed URL
   - Sign up for new account
   - Verify login works

2. **Seed Database** (Optional)
   - Use Vercel CLI: `vercel env pull`
   - Run `npm run seed` locally with production env vars
   - Or manually create test user

3. **Monitor Logs**
   - Vercel: Dashboard → Logs
   - Check for errors
   - Monitor API routes

4. **Set Up Custom Domain** (Optional)
   - Vercel: Project Settings → Domains
   - Add your domain
   - Configure DNS

## Security Checklist

- [ ] Strong NEXTAUTH_SECRET (32+ characters)
- [ ] MongoDB user has limited permissions
- [ ] MongoDB network access restricted
- [ ] HTTPS enabled (Vercel does this automatically)
- [ ] Environment variables not exposed in code
- [ ] Rate limiting considered (for production)

## Performance Optimization

1. **Enable Caching**
   - Vercel automatically caches static assets
   - Consider ISR for reports

2. **Database Indexes**
   - MongoDB automatically indexes `_id`
   - Consider indexes on `userId` for reports

3. **File Size Limits**
   - Configure upload size limits
   - Consider chunking large files

## Troubleshooting

### Build Fails
- Check Node.js version (requires 18+)
- Verify all dependencies are in package.json
- Check for TypeScript errors

### App Crashes After Deployment
- Check environment variables
- Verify MongoDB connection
- Check Vercel logs

### Authentication Not Working
- Verify NEXTAUTH_URL matches deployed URL
- Check NEXTAUTH_SECRET is set
- Clear browser cookies

### Database Connection Issues
- Verify MONGODB_URI format
- Check MongoDB Atlas network access
- Verify database user credentials
