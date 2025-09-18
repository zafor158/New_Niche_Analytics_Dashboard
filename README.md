# 📊 Niche Analytics Dashboard

A comprehensive analytics dashboard designed specifically for independent authors to track book sales, revenue, and performance metrics across multiple platforms.

![Dashboard Preview](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Niche+Analytics+Dashboard)

## ✨ Features

### 📈 **Analytics & Reporting**
- **Real-time Dashboard**: Overview of sales performance with key metrics
- **Interactive Charts**: Monthly sales trends, platform breakdowns, and revenue analytics
- **Custom Date Ranges**: Filter data by specific time periods
- **Export Capabilities**: Download reports and data for external analysis

### 📚 **Book Management**
- **Book Catalog**: Manage your entire book portfolio
- **Sales Tracking**: Record and monitor sales across different platforms
- **Revenue Analytics**: Track royalties, revenue, and profit margins
- **Platform Integration**: Support for Amazon KDP, Gumroad, BookBaby, and more

### 🔐 **User Management**
- **Secure Authentication**: JWT-based authentication system
- **User Profiles**: Personalize your dashboard experience
- **Data Privacy**: Your data is secure and private

### 📁 **Data Import/Export**
- **CSV Upload**: Bulk import sales data from spreadsheets
- **Data Validation**: Automatic validation and error checking
- **Export Options**: Download your data in various formats

## 🚀 Tech Stack

### **Frontend**
- **React 18** - Modern UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Interactive data visualization
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Beautiful notifications

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing

### **DevOps & Deployment**
- **Vercel** - Frontend and backend deployment
- **GitHub Actions** - CI/CD pipeline
- **Environment Variables** - Secure configuration management

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/zafor158/Niche-Analytics-Dashboard.git
   cd Niche-Analytics-Dashboard
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cd backend
   cp env.example .env
   # Edit .env with your database credentials
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   
   # Seed the database with sample data
   npm run seed
   ```

5. **Start the development servers**
   ```bash
   # From root directory
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Demo Credentials
- **Email**: `demo@author.com`
- **Password**: `password123`

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Set up production database**
   - [Neon](https://neon.tech) (Free tier available)
   - [Supabase](https://supabase.com) (Free tier available)
   - [Railway](https://railway.app) (Free tier available)

2. **Deploy Backend**
   ```bash
   cd backend
   vercel
   ```

3. **Deploy Frontend**
   ```bash
   cd frontend
   vercel
   ```

4. **Configure Environment Variables**
   - Set up production database URL
   - Configure JWT secrets
   - Update CORS settings

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 📊 Database Schema

### Users
- User authentication and profile information
- Secure password hashing with bcrypt

### Books
- Book metadata (title, ISBN, description)
- Publication dates and cover images
- User ownership and relationships

### Sales
- Sales transactions with date, units, and revenue
- Platform information and royalty tracking
- Book relationships and user filtering

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Books
- `GET /api/books` - Get user's books
- `POST /api/books` - Create new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Sales
- `GET /api/sales` - Get sales data
- `POST /api/sales` - Create sale record
- `GET /api/sales/analytics/overview` - Get analytics overview
- `GET /api/sales/analytics/monthly` - Get monthly breakdown

### File Upload
- `POST /api/upload/csv` - Upload CSV sales data

## 🎨 Screenshots

### Dashboard Overview
![Dashboard](https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=Dashboard+Overview)

### Analytics Charts
![Analytics](https://via.placeholder.com/600x400/10B981/FFFFFF?text=Analytics+Charts)

### Book Management
![Books](https://via.placeholder.com/600x400/F59E0B/FFFFFF?text=Book+Management)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Designed for independent authors and self-publishers
- Inspired by the need for better book sales analytics

## 📞 Support

If you have any questions or need help:

1. Check the [Issues](https://github.com/zafor158/Niche-Analytics-Dashboard/issues) page
2. Create a new issue with detailed information
3. Review the [DEPLOYMENT.md](./DEPLOYMENT.md) guide

## 🎯 Roadmap

- [ ] Advanced reporting features
- [ ] More platform integrations
- [ ] Mobile app development
- [ ] Team collaboration features
- [ ] Advanced analytics and insights

---

**Made with ❤️ for independent authors**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/zafor158/Niche-Analytics-Dashboard)