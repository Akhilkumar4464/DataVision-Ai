# DataVision Project Structure

## Overview

This document describes the complete project structure of the DataVision application.

## Root Directory

```
datavision/
├── app/                    # Next.js App Router pages
├── components/             # Reusable React components
├── lib/                    # Utility libraries and configurations
├── public/                 # Static assets
├── scripts/                # Build and seed scripts
├── types/                  # TypeScript type definitions
├── middleware.ts           # NextAuth middleware for route protection
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## App Directory (`app/`)

### Pages
- `page.tsx` - Home page with hero section and features
- `layout.tsx` - Root layout with metadata
- `globals.css` - Global styles and Tailwind imports
- `providers.tsx` - NextAuth SessionProvider wrapper

### Public Pages
- `about/page.tsx` - About page
- `pricing/page.tsx` - Pricing page

### Authentication Pages
- `auth/signin/page.tsx` - Sign in page
- `auth/signup/page.tsx` - Sign up page

### Dashboard Pages
- `dashboard/page.tsx` - Main dashboard with file upload and visualization
- `dashboard/reports/[id]/page.tsx` - Individual report view page

### API Routes
- `api/auth/[...nextauth]/route.ts` - NextAuth handlers
- `api/auth/signup/route.ts` - User registration endpoint
- `api/reports/route.ts` - List and create reports
- `api/reports/[id]/route.ts` - Get and delete specific report

## Components Directory (`components/`)

### Navigation
- `Navbar.tsx` - Main navigation component with mobile menu
- `Footer.tsx` - Footer component

### Charts
- `charts/BarChart.tsx` - Bar chart component
- `charts/LineChart.tsx` - Line chart component
- `charts/PieChart.tsx` - Pie chart component
- `charts/AreaChart.tsx` - Area chart component
- `charts/RadarChart.tsx` - Radar chart component

## Library Directory (`lib/`)

### Models (`lib/models/`)
- `User.ts` - MongoDB User model with password hashing
- `Report.ts` - MongoDB Report model

### Utilities (`lib/utils/`)
- `dataParser.ts` - File parsing utilities (Excel, CSV, PDF, DOCX)
- `insights.ts` - AI insights generation (summary, trends, anomalies, recommendations)
- `reportGenerator.ts` - Report content generation
- `export.ts` - Export utilities (PNG, SVG, PDF, DOCX) - **Client-side only**

### Configuration (`lib/`)
- `mongodb.ts` - MongoDB connection management with caching
- `auth.ts` - NextAuth configuration with credentials provider

## Key Features Implementation

### 1. Authentication
- **Location**: `lib/auth.ts`, `app/api/auth/`
- **Provider**: Credentials with JWT sessions
- **Protection**: Middleware protects `/dashboard/*` routes

### 2. File Upload & Parsing
- **Location**: `lib/utils/dataParser.ts`, `app/dashboard/page.tsx`
- **Supported**: Excel, CSV, PDF, DOCX
- **Processing**: Client-side parsing with error handling

### 3. Data Visualization
- **Location**: `components/charts/`
- **Library**: Recharts
- **Types**: Bar, Line, Pie, Area, Radar
- **Export**: PNG, SVG, PDF

### 4. AI Insights
- **Location**: `lib/utils/insights.ts`
- **Features**: 
  - Summary generation
  - Trend detection
  - Anomaly detection
  - Recommendations

### 5. Report Generation
- **Location**: `lib/utils/reportGenerator.ts`
- **Export**: PDF, DOCX
- **Storage**: MongoDB with user association

## Database Schema

### User Model
```typescript
{
  name: string
  email: string (unique, indexed)
  password: string (hashed with bcrypt)
  createdAt: Date
  updatedAt: Date
}
```

### Report Model
```typescript
{
  userId: ObjectId (indexed)
  title: string
  fileName: string
  fileType: string (enum: xlsx, xls, csv, pdf, docx)
  data: Object (parsed data structure)
  insights: {
    summary: string
    trends: string[]
    anomalies: string[]
    recommendations: string[]
  }
  charts: Array<{
    type: string (enum: bar, line, pie, area, radar)
    data: Object
    config: Object
  }>
  createdAt: Date
  updatedAt: Date
}
```

## Data Flow

1. **File Upload**: User uploads file → Client-side parsing → Display data
2. **Insights**: Parsed data → Insights generator → Display insights
3. **Visualization**: Data + User selection → Chart component → Display chart
4. **Report**: Insights + Charts → Report generator → Save to DB or Export

## Environment Variables

Required:
- `NEXTAUTH_URL` - Application URL
- `NEXTAUTH_SECRET` - Secret for JWT signing
- `MONGODB_URI` - MongoDB connection string

## Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Seed Database
```bash
npm run seed
```

## Dependencies Overview

### Core
- Next.js 14 (App Router)
- React 18
- TypeScript

### Database & Auth
- MongoDB / Mongoose
- NextAuth.js
- bcryptjs

### UI & Styling
- Tailwind CSS
- Framer Motion
- Lucide React (icons)

### Data Processing
- SheetJS (Excel/CSV)
- pdf-parse
- docx

### Charts & Export
- Recharts
- html2canvas
- jsPDF
- docx

## Important Notes

1. **Export Functions**: Must be called client-side only (browser APIs required)
2. **File Parsing**: Handles errors gracefully, provides user feedback
3. **Authentication**: JWT sessions stored in cookies, secure by default
4. **Database**: Connection pooling with global caching for performance
5. **Responsive**: Mobile-first design with Tailwind breakpoints

## Extending the Application

### Adding New Chart Types
1. Create component in `components/charts/`
2. Add option in dashboard chart selector
3. Update types if needed

### Adding New File Formats
1. Create parser function in `lib/utils/dataParser.ts`
2. Add to `parseFile()` function
3. Update file type enum in Report model

### Adding New Insight Types
1. Extend `insights.ts` with new detection logic
2. Update Insights interface
3. Update report generator

### Adding New Export Formats
1. Create export function in `lib/utils/export.ts`
2. Add UI button in dashboard
3. Ensure client-side only execution
