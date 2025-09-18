# 🚀 Vercel Deployment Guide for Niche Analytics Dashboard

This guide will help you deploy your Niche Analytics Dashboard to Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **PostgreSQL Database**: Set up a production database (recommended: [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app))

## 🗄️ Database Setup

### Option 1: Neon (Recommended)
1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string (it will look like: `postgresql://username:password@host:5432/database`)

### Option 2: Supabase
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings > Database and copy the connection string

### Option 3: Railway
1. Go to [railway.app](https://railway.app) and create a free account
2. Create a new PostgreSQL database
3. Copy the connection string from the database details

## 🔧 Backend Deployment

### Step 1: Deploy Backend to Vercel

1. **Connect to Vercel**:
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy Backend**:
   ```bash
   cd backend
   vercel
   ```

3. **Configure Environment Variables** in Vercel Dashboard:
   - Go to your project settings
   - Add these environment variables:
     ```
     DATABASE_URL=your_production_database_url
     JWT_SECRET=your_secure_jwt_secret
     JWT_EXPIRES_IN=7d
     NODE_ENV=production
     FRONTEND_URL=https://your-frontend-app.vercel.app
     ```

4. **Run Database Migrations**:
   ```bash
   # In your backend directory
   npx prisma migrate deploy
   npx prisma generate
   ```

5. **Seed Production Database** (optional):
   ```bash
   npm run seed
   ```

### Step 2: Update Frontend Configuration

1. **Update API URL** in `frontend/vercel.json`:
   ```json
   {
     "env": {
       "REACT_APP_API_URL": "https://your-backend-url.vercel.app"
     }
   }
   ```

## 🎨 Frontend Deployment

### Step 1: Deploy Frontend to Vercel

1. **Deploy Frontend**:
   ```bash
   cd frontend
   vercel
   ```

2. **Configure Environment Variables** in Vercel Dashboard:
   ```
   REACT_APP_API_URL=https://your-backend-url.vercel.app
   ```

## 🔄 Alternative: Deploy Both Together

You can also deploy both frontend and backend from the root directory:

1. **Deploy from Root**:
   ```bash
   vercel
   ```

2. **Configure Environment Variables**:
   ```
   DATABASE_URL=your_production_database_url
   JWT_SECRET=your_secure_jwt_secret
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-app.vercel.app
   REACT_APP_API_URL=https://your-backend-url.vercel.app
   ```

## 🧪 Testing Your Deployment

1. **Test Backend**: Visit `https://your-backend-url.vercel.app/api/`
2. **Test Frontend**: Visit `https://your-frontend-app.vercel.app`
3. **Test Login**: Use demo credentials:
   - Email: `demo@author.com`
   - Password: `password123`

## 🔒 Security Checklist

- [ ] Use strong JWT secret (32+ characters)
- [ ] Use HTTPS in production
- [ ] Set up proper CORS origins
- [ ] Use environment variables for sensitive data
- [ ] Enable rate limiting
- [ ] Use a production-grade database

## 🐛 Troubleshooting

### Common Issues:

1. **Database Connection Error**:
   - Check your DATABASE_URL format
   - Ensure your database allows external connections
   - Verify SSL settings if required

2. **CORS Errors**:
   - Update FRONTEND_URL in backend environment variables
   - Check CORS configuration in server.js

3. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

4. **API Not Working**:
   - Verify REACT_APP_API_URL is set correctly
   - Check network tab in browser dev tools
   - Ensure backend is deployed and running

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify environment variables are set correctly
4. Test API endpoints directly

## 🎉 Success!

Once deployed, your Niche Analytics Dashboard will be available at:
- **Frontend**: `https://your-frontend-app.vercel.app`
- **Backend API**: `https://your-backend-url.vercel.app/api/`

Enjoy your deployed application! 🚀
