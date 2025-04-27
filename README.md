# JobNexus - Modern Job Board Platform

JobNexus is a full-stack job board application that connects job seekers with employers through a modern and intuitive interface.

## 🚀 Features

### For Job Seekers
- User authentication and profile management
- Browse and search job listings
- Filter jobs by type, location, and salary range
- Apply to jobs with customized applications
- Track application status
- View application history

### For Employers
- Company profile management
- Post and manage job listings
- Review job applications
- Track applicant statistics
- Manage hiring pipeline

### Admin Features
- User management
- Job listing moderation
- Application oversight
- Platform statistics
- System monitoring

## 🛠 Technology Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Shadcn UI components
- React Hook Form for form handling
- React Query for data fetching
- Wouter for routing
- Lucide React for icons
- Date-fns for date manipulation

### Backend
- Node.js with Express
- TypeScript
- Drizzle ORM
- PostgreSQL (via Neon Database)
- Express Session for authentication
- Passport.js for user authentication

### Development Tools
- Vite for development and building
- ESLint for code linting
- TypeScript for type safety
- PostCSS for CSS processing

## 📁 Project Structure
```
📦 JobNexus Project
├── 📂 client/                      # Frontend React application
│   ├── 📂 src/
│   │   ├── 📂 components/          # Reusable UI components
│   │   │   ├── 📂 admin/           # Admin-specific components
│   │   │   ├── 📂 dashboard/       # Dashboard components
│   │   │   ├── 📂 employer/        # Employer-specific components
│   │   │   ├── 📂 jobs/            # Job-related components
│   │   │   ├── 📂 layout/          # Layout components
│   │   │   └── 📂 ui/              # UI components (shadcn/ui)
│   │   ├── 📂 hooks/               # Custom React hooks
│   │   │   ├── use-auth.tsx        # Authentication hook
│   │   │   ├── use-mobile.tsx      # Mobile detection hook
│   │   │   └── use-toast.ts        # Toast notification hook
│   │   ├── 📂 lib/                 # Utility functions
│   │   │   ├── local-auth.ts       # Authentication utilities
│   │   │   ├── local-jobs.ts       # Job-related utilities
│   │   │   └── utils.ts            # General utilities
│   │   └── 📂 pages/               # Application pages
│   │       ├── 📂 admin/           # Admin pages
│   │       ├── 📂 applications/    # Application management
│   │       ├── 📂 dashboard/       # User dashboards
│   │       ├── 📂 employer/        # Employer pages
│   │       ├── 📂 jobs/            # Job-related pages
│   │       └── 📂 profile/         # User profile pages
│   └── index.html                  # Entry HTML file
│
├── 📂 server/                      # Backend Express application
│   ├── auth.ts                     # Authentication logic
│   ├── db.ts                       # Database configuration
│   ├── index.ts                    # Server entry point
│   ├── routes.ts                   # API routes
│   ├── seed.ts                     # Database seeding
│   └── storage.ts                  # File storage logic
│
├── 📂 shared/                      # Shared types and schemas
│   └── schema.ts                   # Database schema definitions
│
├── Configuration Files
│   ├── .gitignore                  # Git ignore rules
│   ├── .replit                     # Replit configuration
│   ├── components.json             # UI components config
│   ├── drizzle.config.ts           # Database ORM config
│   ├── package.json                # Project dependencies
│   ├── postcss.config.js           # PostCSS configuration
│   ├── tailwind.config.ts          # Tailwind CSS config
│   ├── tsconfig.json               # TypeScript configuration
│   └── vite.config.ts              # Vite bundler config
```




## 🧩 Key Features by Directory

### Client
- React components using TypeScript
- Shadcn UI component library
- React Query for data fetching
- Tailwind CSS for styling

### Server
- Express.js backend
- Drizzle ORM for database operations
- PostgreSQL database connection
- Authentication middleware

### Shared
- TypeScript interfaces
- Database schema definitions
- Shared utilities

## ✨ Main Features

- User authentication (Job Seekers & Employers)
- Job posting and management
- Application tracking
- Admin dashboard
- Profile management
- Real-time notifications
- Responsive design
- 

the project follows a modern full-stack architecture with a clear separation of concerns between frontend and backend components, using TypeScript throughout for type safety.

## 🚦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yaxploit/Job-portal-online
```
##Install dependencies
-npm install
-npx update-browserslist-db@latest
-npm install cross-env --save-dev

##Start the development server
-npm run dev

##Access the application
-http://localhost:5000


