# Niche Analytics Dashboard

A specialized dashboard for independent authors to track book sales metrics from various platforms.

## Features

- User authentication and registration
- CSV file upload for sales data from multiple platforms (Amazon KDP, Gumroad, etc.)
- Interactive data visualization with charts and tables
- Sales analytics and reporting
- Multi-platform sales tracking

## Tech Stack

- **Frontend**: React with Chart.js for visualizations
- **Backend**: Node.js/Express with JWT authentication
- **Database**: PostgreSQL with Prisma ORM
- **File Processing**: CSV parsing and data aggregation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-all
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in the backend directory
   - Configure your database connection and JWT secret

4. Run database migrations:
   ```bash
   cd backend
   npx prisma migrate dev
   ```

5. Start the development servers:
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
├── frontend/          # React application
├── backend/           # Node.js/Express API
├── package.json       # Root package.json for scripts
└── README.md         # This file
```

## Usage

1. Register a new account or log in
2. Add your books to the system
3. Upload CSV files with sales data
4. View analytics and charts on the dashboard
5. Track sales performance across different platforms

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
