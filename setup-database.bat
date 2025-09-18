@echo off
echo Setting up Niche Analytics Database...
echo.

REM Try to connect to PostgreSQL and create database
echo Attempting to create database 'niche_analytics'...
psql -U postgres -c "CREATE DATABASE niche_analytics;" 2>nul

if %errorlevel% equ 0 (
    echo ✓ Database 'niche_analytics' created successfully!
) else (
    echo ✗ Failed to create database. Please check:
    echo   1. PostgreSQL is installed and running
    echo   2. You have the correct password
    echo   3. PostgreSQL bin directory is in your PATH
    echo.
    echo Manual steps:
    echo 1. Open pgAdmin 4
    echo 2. Connect to PostgreSQL server
    echo 3. Right-click "Databases" → Create → Database
    echo 4. Name: niche_analytics
    echo 5. Click Save
)

echo.
echo Next steps:
echo 1. Update backend/.env with your database password
echo 2. Run: cd backend ^&^& npx prisma migrate dev
echo.
pause
