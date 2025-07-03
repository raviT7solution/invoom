# Invoom

A modern, full-stack invoice management application built with React and TypeScript. Invoom provides comprehensive invoice processing, client management, subscription tracking, and analytics dashboard.

## 🚀 Features

- **Dashboard Analytics**: Real-time insights with charts and statistics
- **Client Management**: Complete CRUD operations for client data
- **Subscription Management**: Track active and cancelled subscriptions
- **Plan Management**: Configure and manage subscription plans
- **Feature Management**: Administer system features and capabilities
- **Authentication**: Secure login system with session management
- **Responsive Design**: Modern UI built with Ant Design and Tailwind CSS
- **Real-time Data**: Live updates using React Query and WebSocket connections

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Ant Design** for UI components
- **Tailwind CSS** for custom styling
- **React Query (TanStack Query)** for server state management
- **Zustand** for client state management
- **React Router** with Chicane for routing
- **ApexCharts** for data visualization
- **Axios** for HTTP requests

### Backend
- **Ruby on Rails** API
- **GraphQL** for data fetching
- **ActionCable** for WebSocket connections

## 📁 Project Structure

```
invoom/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── api/             # API client and hooks
│   │   ├── components/      # Reusable UI components
│   │   ├── Pages/           # Application pages
│   │   │   ├── Client/      # Client management
│   │   │   ├── Dashboard/   # Analytics dashboard
│   │   │   ├── Login/       # Authentication
│   │   │   ├── Master/      # Master data management
│   │   │   ├── Plan/        # Subscription plans
│   │   │   └── Subscription/ # Subscription management
│   │   ├── stores/          # Zustand state stores
│   │   ├── utils/           # Utility functions
│   │   └── helpers/         # Helper functions
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── backend/                 # Ruby on Rails backend (referenced in Makefile)
└── Makefile                # Project automation scripts
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** package manager
- **Ruby** (version specified in `.tool-versions`)
- **asdf** version manager (recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd invoom
   ```

2. **Install dependencies**
   ```bash
   make install-dependencies
   ```
   Or manually:
   ```bash
   cd frontend && pnpm install
   cd backend && bundle install
   ```

3. **Start the development servers**
   ```bash
   # Start both frontend and backend
   make frontend    # Starts frontend on http://localhost:5173
   make backend     # Starts backend on http://localhost:3000
   ```

### Development Commands

```bash
# Frontend development
make frontend              # Start frontend dev server
pnpm dev                   # Alternative: start frontend directly

# Backend development  
make backend               # Start Rails server
make console               # Open Rails console

# Code generation
make codegen               # Generate GraphQL types

# Linting and formatting
make lint-fix              # Fix linting issues
pnpm lint                  # Run ESLint
pnpm tsc                   # TypeScript type checking

# Testing
make unit-tests            # Run backend tests
make system-tests          # Run system tests
```

## 🔧 Configuration

### Environment Variables

The frontend is configured to connect to the backend API. Key configuration:

- **Backend URL**: `http://localhost:3000` (development)
- **API Base URL**: `https://test-api-invoom.t7solution.com` (production)

### Brand Colors

The application uses a custom color scheme defined in `tailwind.config.js`:

- **Primary**: `#1e2a5c` (Dark Blue)
- **Secondary**: `#FFB800` (Yellow/Orange)
- **Dark**: `#121222` (Very Dark)
- **Light**: `#f8f9fa` (Light Background)

## 📊 Application Pages

- **Dashboard**: Analytics overview with charts and statistics
- **Clients**: Client management with CRUD operations
- **Subscriptions**: Active and cancelled subscription tracking
- **Plans**: Subscription plan configuration
- **Features**: System feature administration
- **Login**: Authentication interface

## 🔐 Authentication

The application uses JWT-based authentication with session persistence:

- Login via username/password
- Automatic token management
- Session persistence across browser sessions
- Protected routes with automatic redirects

## 📈 Data Visualization

The dashboard includes various charts and analytics:

- Revenue trends with ApexCharts
- Client statistics
- Subscription metrics
- Invoice processing data
- OCR accuracy tracking

## 🧪 Testing

```bash
# Backend tests
make unit-tests            # Rails unit tests
make system-tests          # System integration tests

# Frontend tests (when implemented)
pnpm test                  # React component tests
```

## 🚀 Deployment

### Frontend Build

```bash
cd frontend
pnpm build                 # Production build
pnpm preview               # Preview production build
```

### Environment Setup

Ensure the following environment variables are configured for production:

- `VITE_BACKEND_BASE_URL`: Backend API URL
- Backend environment variables (database, API keys, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📝 License

[Add your license information here]

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.
