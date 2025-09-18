# Niche Analytics Dashboard - Setup Guide

This guide will help you set up and run the Niche Analytics Dashboard on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download here](https://www.postgresql.org/download/)
- **npm** or **yarn** (comes with Node.js)

## Database Setup

1. **Install PostgreSQL** and create a new database:
   ```sql
   CREATE DATABASE niche_analytics;
   ```

2. **Note your database connection details** (host, port, username, password) for the next step.

## Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `env.example` to `.env`
   - Update the database connection string:
     ```
     DATABASE_URL="postgresql://username:password@localhost:5432/niche_analytics"
     ```
   - Set a secure JWT secret:
     ```
     JWT_SECRET="your-super-secret-jwt-key-here"
     ```

4. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

5. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

6. **Start the backend server:**
   ```bash
   npm run dev
   ```

   The backend will be available at `http://localhost:5000`

## Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## Quick Start (Both Services)

From the root directory, you can start both services simultaneously:

```bash
# Install all dependencies
npm run install-all

# Start both backend and frontend
npm run dev
```

## First Time Usage

1. **Open your browser** and navigate to `http://localhost:3000`

2. **Create an account** by clicking "Create a new account"

3. **Add your first book:**
   - Go to the "Books" section
   - Click "Add Book"
   - Fill in the book details

4. **Upload sales data:**
   - Go to the "Upload" section
   - Download the CSV template
   - Fill in your sales data
   - Upload the CSV file

5. **View your analytics** in the Dashboard and Analytics sections

## CSV Format

Your CSV files should have the following columns:
- `date` - Sale date (YYYY-MM-DD format)
- `units` - Number of units sold
- `revenue` - Total revenue from the sale
- `royalty` - Royalty earned from the sale

Example CSV:
```csv
date,units,revenue,royalty
2024-01-15,5,24.99,8.75
2024-01-20,3,14.99,5.25
2024-02-01,8,39.99,14.00
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check your database credentials in the `.env` file
- Verify the database exists

### Port Already in Use
- Backend: Change `PORT` in `.env` file
- Frontend: React will prompt to use a different port

### CORS Issues
- Ensure the `FRONTEND_URL` in backend `.env` matches your frontend URL

### Prisma Issues
- Run `npx prisma generate` after any schema changes
- Use `npx prisma studio` to view your database

## Development

### Database Management
- **View database:** `npx prisma studio`
- **Reset database:** `npx prisma migrate reset`
- **Create migration:** `npx prisma migrate dev --name migration_name`

### API Testing
- Backend health check: `http://localhost:5000/api/health`
- API documentation available in the code comments

## Production Deployment

For production deployment:

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Set production environment variables:**
   - Use a production database
   - Set `NODE_ENV=production`
   - Use a secure JWT secret

3. **Start the backend:**
   ```bash
   cd backend
   npm start
   ```

## Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check that PostgreSQL is running and accessible

## Features

- ✅ User authentication and registration
- ✅ Book management
- ✅ CSV file upload and parsing
- ✅ Sales data management
- ✅ Interactive charts and analytics
- ✅ Platform-specific sales tracking
- ✅ Monthly and yearly reporting
- ✅ Data export functionality
