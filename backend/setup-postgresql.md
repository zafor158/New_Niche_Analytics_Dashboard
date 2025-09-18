# PostgreSQL Setup Guide

## Option 1: Local PostgreSQL Installation

### Install PostgreSQL
1. Download PostgreSQL from https://www.postgresql.org/download/
2. Install with default settings
3. Remember the password you set for the 'postgres' user

### Create Database
1. Open pgAdmin or use command line
2. Create a new database named `niche_analytics`
3. Update your .env file with correct credentials

## Option 2: Docker PostgreSQL (Recommended)

### Run PostgreSQL with Docker
```bash
docker run --name postgres-niche -e POSTGRES_PASSWORD=password -e POSTGRES_DB=niche_analytics -p 5432:5432 -d postgres:15
```

### Environment Variables
Create a `.env` file in the backend directory:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/niche_analytics"
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

## Option 3: Cloud PostgreSQL (For Production)

### Neon (Free Tier)
1. Go to https://neon.tech
2. Create a new project
3. Copy the connection string
4. Use it as DATABASE_URL

### Supabase (Free Tier)
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings → Database → Connection string
4. Use it as DATABASE_URL

## After Setup

1. Run migrations:
```bash
npx prisma migrate dev
```

2. Generate Prisma client:
```bash
npx prisma generate
```

3. Seed the database:
```bash
npm run seed
```
