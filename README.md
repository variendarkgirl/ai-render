# Integrated Red-Teaming Dashboard

A comprehensive full-stack web application that aggregates and visualizes data from multiple adversarial tests to provide detailed metrics on AI model vulnerabilities.

## Project Overview

The Integrated Red-Teaming Dashboard is designed to help AI security teams monitor, analyze, and respond to security vulnerabilities across multiple AI models. The dashboard consolidates data from various sources, including API tests and extension logs, to provide a comprehensive view of security metrics and threats with a visually appealing cyber-themed interface.

![Dashboard Preview](./frontend/public/assets/images/dashboard-preview.png)

## Key Features

- **Real-time Security Monitoring**: Track ongoing attack attempts, successful breaches, and system status
- **Vulnerability Analysis**: Identify patterns in successful attacks with interactive visualizations
- **Model Comparison**: Compare security metrics across different AI models with side-by-side analysis
- **Attack Logs Management**: Detailed logging with advanced filtering and relationship analysis
- **Interactive Visualizations**: Chart.js and D3.js powered visualizations including vulnerability maps
- **Customizable Dashboard**: Filters for time ranges and specific models
- **Secure Authentication**: JWT-based authentication with role-based access control

## Tech Stack

### Frontend
- **React.js** with functional components and hooks
- **Chart.js** and **D3.js** for data visualization
- **React Context API** for state management
- **React Router** for navigation
- **Axios** for API requests
- **Custom cyber-themed UI components**

### Backend
- **Node.js** with **Express** framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication and authorization
- **Winston** for advanced logging
- **RESTful API architecture**

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (v4.4+)
- npm or yarn

### Quick Start

1. Clone the repository
```bash
git clone https://github.com/yourusername/red-team-dashboard.git
cd red-team-dashboard
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables:
   - Create `.env` files in both the backend and frontend directories

5. Start the development servers:
   - Backend: `npm run dev` (from backend directory)
   - Frontend: `npm start` (from frontend directory)

6. Open your browser and navigate to `http://localhost:3000`

7. Login with credentials:
   - Email: `demo@example.com`
   - Password: `demo123`


## Project Structure

```
red-team-dashboard/
│
├── frontend/                # React frontend application
│   ├── public/              # Static assets
│   └── src/                 # Source code
│       ├── components/      # Reusable UI components
│       ├── pages/           # Main application pages
│       ├── context/         # React context providers
│       ├── hooks/           # Custom React hooks
│       ├── services/        # API service functions
│       └── utils/           # Utility functions
│
├── backend/                 # Node.js backend application
│   ├── api/                 # API routes and controllers
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Mongoose data models
│   │   └── routes/          # API route definitions
│   ├── config/              # Configuration files
│   ├── services/            # Business logic services
│   └── utils/               # Utility functions
│
└── docs/                    # Documentation
    ├── deployment.md        # Deployment guide
    └── getting-started.md   # Getting started guide
```

## Core Components

- **Dashboard Page**: Main interface with key metrics and visualizations
- **Logs Page**: Advanced filtering and viewing of attack logs
- **Models Page**: Comparison of security metrics across AI models
- **Settings Page**: User profile, notifications, and security settings

## Deployment

The application can be deployed in various environments:

- **Development**: Local setup with separate frontend/backend servers
- **Production**: Single server or containerized deployment
- **Cloud**: Deployable to AWS, Azure, or other cloud providers


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
