# Niche Analytics Dashboard - Backend API

This is the backend API for the Niche Analytics Dashboard, built with Node.js, Express, and PostgreSQL.

## Features

- **Authentication**: JWT-based user authentication
- **Database**: PostgreSQL with Prisma ORM
- **File Upload**: CSV parsing and data import
- **API Endpoints**: RESTful API for all operations
- **Security**: Rate limiting, CORS, input validation
- **Data Processing**: Sales analytics and aggregation

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Books
- `GET /api/books` - Get all books for authenticated user
- `GET /api/books/:id` - Get specific book
- `POST /api/books` - Create new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book
- `GET /api/books/:id/stats` - Get book statistics

### Sales
- `GET /api/sales` - Get sales with filtering
- `GET /api/sales/:id` - Get specific sale
- `POST /api/sales` - Create new sale
- `PUT /api/sales/:id` - Update sale
- `DELETE /api/sales/:id` - Delete sale
- `GET /api/sales/analytics/overview` - Get analytics overview

### File Upload
- `POST /api/upload/csv` - Upload and parse CSV file
- `GET /api/upload/template` - Download CSV template
- `GET /api/upload/platforms` - Get supported platforms

### Health Check
- `GET /api/health` - API health status

## Database Schema

### Users
- `id` - Unique identifier
- `email` - User email (unique)
- `username` - Username (unique)
- `password` - Hashed password
- `firstName` - First name
- `lastName` - Last name
- `createdAt` - Account creation date
- `updatedAt` - Last update date

### Books
- `id` - Unique identifier
- `title` - Book title
- `isbn` - ISBN (optional)
- `description` - Book description
- `coverImage` - Cover image URL
- `publishedAt` - Publication date
- `userId` - Owner user ID
- `createdAt` - Creation date
- `updatedAt` - Last update date

### Sales
- `id` - Unique identifier
- `date` - Sale date
- `units` - Number of units sold
- `revenue` - Total revenue
- `royalty` - Royalty earned
- `platform` - Sales platform
- `bookId` - Associated book ID
- `createdAt` - Creation date
- `updatedAt` - Last update date

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/niche_analytics"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV="development"

# CORS
FRONTEND_URL="http://localhost:3000"
```

## CSV Format

The API expects CSV files with the following columns:
- `date` - Sale date (YYYY-MM-DD)
- `units` - Number of units sold
- `revenue` - Total revenue
- `royalty` - Royalty earned

Column names are case-insensitive and can be:
- `date`, `Date`, `DATE`, `sale_date`
- `units`, `Units`, `quantity`, `Quantity`
- `revenue`, `Revenue`, `price`, `Price`
- `royalty`, `Royalty`, `earnings`, `Earnings`

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable cross-origin requests
- **Helmet**: Security headers

## Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)
- npm or yarn

### Setup
1. Install dependencies: `npm install`
2. Set up environment variables
3. Run migrations: `npx prisma migrate dev`
4. Generate client: `npx prisma generate`
5. Start server: `npm run dev`

### Database Management
- **Prisma Studio**: `npx prisma studio`
- **Reset Database**: `npx prisma migrate reset`
- **Create Migration**: `npx prisma migrate dev --name migration_name`

### Testing
- Health check: `GET /api/health`
- Use Postman or similar tools for API testing

## Production Considerations

- Use environment-specific database
- Set secure JWT secrets
- Enable HTTPS
- Configure proper CORS origins
- Set up monitoring and logging
- Use process manager (PM2)
- Configure reverse proxy (nginx)

## Dependencies

### Core
- `express` - Web framework
- `prisma` - Database ORM
- `@prisma/client` - Prisma client
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens

### Middleware
- `cors` - Cross-origin requests
- `helmet` - Security headers
- `express-rate-limit` - Rate limiting
- `express-validator` - Input validation
- `multer` - File uploads

### File Processing
- `csv-parser` - CSV parsing
- `dotenv` - Environment variables
