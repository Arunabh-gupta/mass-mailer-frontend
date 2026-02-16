# Mass Mailer Frontend

A modern, production-grade web application for sending personalized cold outreach emails (resumes) to recruiters at scale. Built with React and designed for B2B SaaS use cases.

## 🎯 Overview

Mass Mailer is a full-stack SaaS application that enables users to:
- Manage recruiters and companies
- Create reusable email templates with variables
- Build and execute email campaigns
- Track campaign performance and delivery results
- Send personalized emails via Amazon SES

## ✨ Features

- **Dashboard**: Overview of key metrics and recent activity
- **Email Templates**: Create and manage reusable email templates with variable support
- **Recruiters Management**: Add, edit, and organize recruiter contacts
- **Companies Management**: Track companies and associated recruiters
- **Campaigns**: Create, manage, and monitor email campaigns
- **Email Contacts**: Manage email contact lists
- **Authentication**: Login and registration pages (ready for backend integration)

## 🛠️ Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **JavaScript/JSX** - Language

## 📁 Project Structure

```
src/
├── App.jsx              # Main app component with all routes
├── main.jsx             # Application entry point
├── layouts/
│   └── AppLayout.jsx    # Main layout with sidebar and topbar
├── components/
│   ├── Sidebar.jsx      # Left navigation sidebar
│   └── Topbar.jsx       # Top navigation bar
└── pages/
    ├── Dashboard.jsx    # Dashboard page
    ├── Templates.jsx     # Email templates page
    ├── Recruiters.jsx    # Recruiters management page
    ├── Companies.jsx    # Companies management page
    ├── Campaigns.jsx    # Campaigns page
    ├── Contacts.jsx     # Email contacts page
    ├── Login.jsx         # Login page
    └── Register.jsx     # Registration page
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## 🎨 Design

The application features a clean, professional B2B SaaS design with:
- Desktop-first responsive layout
- Consistent blue and white color scheme
- Modern UI components with hover states
- Data tables with pagination
- Intuitive navigation with active state indicators

## 🔌 Backend Integration

This frontend is designed to work with a FastAPI backend. The backend should provide:
- RESTful API endpoints for all resources
- JWT-based authentication
- User-scoped data management
- Amazon SES integration for email sending

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Architecture

- **Routes**: All routes defined in `App.jsx`
- **Layout**: Persistent sidebar and topbar via `AppLayout`
- **Components**: Modular, reusable components
- **Styling**: Tailwind CSS utility classes
- **State Management**: React hooks (ready for API integration)

## 🔐 Authentication

Authentication pages are implemented and ready for backend integration with external providers (Clerk, Appwrite, etc.) or custom JWT-based authentication.

