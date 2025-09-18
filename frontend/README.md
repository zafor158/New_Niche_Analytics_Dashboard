# Niche Analytics Dashboard - Frontend

This is the React frontend for the Niche Analytics Dashboard, providing a modern and intuitive interface for authors to track their book sales.

## Features

- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Authentication**: Secure login and registration
- **Dashboard**: Overview of sales metrics and charts
- **Book Management**: Add, edit, and manage your books
- **Sales Tracking**: View and manage sales records
- **Data Upload**: CSV file upload with validation
- **Analytics**: Interactive charts and detailed reports
- **Data Export**: Export sales data to CSV

## Tech Stack

- **React 18** - Frontend framework
- **React Router** - Client-side routing
- **Chart.js** - Data visualization
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## Components

### Pages
- **Login** - User authentication
- **Register** - User registration
- **Dashboard** - Overview and key metrics
- **Books** - Book management
- **Sales** - Sales record management
- **Upload** - CSV file upload
- **Analytics** - Detailed analytics and reports

### Charts
- **MonthlySalesChart** - Bar chart showing monthly sales revenue
- **PlatformBreakdownChart** - Doughnut chart for platform distribution
- **SalesTrendChart** - Line chart for sales trends over time

### Layout
- **Layout** - Main application layout with navigation
- **AuthContext** - Authentication state management

## Key Features

### Dashboard
- Key performance indicators (KPIs)
- Monthly sales revenue chart
- Platform breakdown visualization
- Recent sales table
- Platform performance metrics

### Book Management
- Add new books with details
- Edit existing book information
- Delete books (with confirmation)
- View sales count per book

### Sales Management
- View all sales with filtering
- Add individual sales records
- Edit existing sales
- Delete sales records
- Filter by book, platform, and date range

### Data Upload
- CSV file upload with drag-and-drop
- Template download for proper formatting
- Real-time validation and error reporting
- Support for multiple platforms
- Batch processing with progress feedback

### Analytics
- Comprehensive sales analytics
- Date range filtering
- Platform performance comparison
- Monthly breakdown tables
- Data export functionality
- Interactive charts with tooltips

## Chart Components

### MonthlySalesChart
- Displays monthly sales revenue as bar chart
- Shows units sold and royalty data
- Dual y-axis for different metrics
- Responsive design with tooltips

### PlatformBreakdownChart
- Doughnut chart showing sales distribution by platform
- Color-coded segments
- Percentage and value tooltips
- Legend with platform names

### SalesTrendChart
- Line chart showing sales trends over time
- Daily revenue and cumulative data
- Multiple data series
- Smooth curves with fill areas

## Styling

The application uses Tailwind CSS for styling with:
- Custom color palette (primary, secondary)
- Responsive design patterns
- Component-based styling
- Dark/light mode support ready
- Consistent spacing and typography

## State Management

- **AuthContext**: Global authentication state
- **Local State**: Component-level state with hooks
- **Form State**: React Hook Form for form management
- **API State**: Axios for HTTP requests

## Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Collapsible navigation on mobile
- Touch-friendly interface
- Optimized for all screen sizes

## Development

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Setup
1. Install dependencies: `npm install`
2. Start development server: `npm start`
3. Open browser to `http://localhost:3000`

### Available Scripts
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Environment
- Development server runs on port 3000
- API proxy configured to backend (port 5000)
- Hot reloading enabled
- Source maps for debugging

## API Integration

The frontend communicates with the backend API through:
- **Axios** for HTTP requests
- **JWT tokens** for authentication
- **Error handling** with user-friendly messages
- **Loading states** for better UX
- **Optimistic updates** where appropriate

## Performance Optimizations

- **Code splitting** with React Router
- **Lazy loading** for components
- **Memoization** for expensive calculations
- **Efficient re-renders** with proper dependencies
- **Image optimization** ready
- **Bundle analysis** available

## Accessibility

- **Semantic HTML** structure
- **ARIA labels** for screen readers
- **Keyboard navigation** support
- **Color contrast** compliance
- **Focus management** for modals
- **Alt text** for images

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Production Build

```bash
npm run build
```

Creates optimized production build in `build/` directory:
- Minified JavaScript and CSS
- Optimized images
- Service worker for caching
- Source maps for debugging

## Deployment

The frontend can be deployed to:
- **Netlify** - Static site hosting
- **Vercel** - React-optimized hosting
- **AWS S3** - Static website hosting
- **GitHub Pages** - Free hosting
- **Traditional web servers** - Apache/Nginx

## Configuration

### Environment Variables
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_ENV` - Environment (development/production)

### Tailwind Configuration
- Custom color palette
- Extended spacing scale
- Custom font families
- Component utilities

## Future Enhancements

- **Dark mode** toggle
- **Advanced filtering** options
- **Data visualization** improvements
- **Mobile app** version
- **Real-time updates** with WebSockets
- **Advanced analytics** features
- **Multi-language** support
- **Theme customization**
