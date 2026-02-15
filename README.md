# DataVision

**DataVision** is a production-ready web application for AI-powered data analysis and visualization. Upload Excel, CSV, PDF, or DOCX files and get instant insights, beautiful visualizations, and exportable reports.⚠ Originally developed during my tenure at Zidio Development (Aug–Sept 2025).
The repository was recreated and improved after an unexpected local data loss.

## Features

- 🔐 **Authentication**: Secure signup/login with NextAuth.js and JWT sessions
- 📊 **Data Upload**: Support for Excel, CSV, PDF, and DOCX files
- 📈 **Rich Visualizations**: Bar, Line, Pie, Area, and Radar charts
- 🤖 **AI Insights**: Automatic summary, trends, anomalies, and recommendations
- 📄 **Report Generation**: Create and export reports as PDF or DOCX
- 💾 **Report History**: Save and manage your analysis reports
- 🎨 **Modern UI**: Glassmorphism design with Framer Motion animations
- 📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **File Parsing**: SheetJS (Excel/CSV), pdf-parse, docx
- **Export**: html2canvas, jsPDF, docx

## Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm or yarn

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd datavision
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32
MONGODB_URI=mongodb://localhost:27017/datavision
OPENAI_API_KEY=your-openai-api-key-here
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**MongoDB Setup Options:**
- Local: `mongodb://localhost:27017/datavision`
- MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/datavision`

**OpenAI API Key (Optional but Recommended):**
- Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
- If not provided, the app will use rule-based insights as a fallback
- The AI-powered insights provide more intelligent and contextual analysis

### 4. Seed Database (Optional)

Create a test user and sample data:

```bash
npm run seed
# or
yarn seed
```

This creates:
- Test user: `test@example.com` / `password123`
- Sample report with demo data

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
datavision/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/             # NextAuth routes
│   │   └── reports/          # Report API endpoints
│   ├── auth/                 # Authentication pages
│   ├── dashboard/            # Dashboard pages
│   ├── about/                # About page
│   ├── pricing/              # Pricing page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── globals.css           # Global styles
├── components/               # React components
│   ├── charts/               # Chart components
│   ├── Navbar.tsx            # Navigation component
│   └── Footer.tsx            # Footer component
├── lib/                      # Utility libraries
│   ├── models/               # MongoDB models
│   ├── utils/                # Utility functions
│   ├── auth.ts               # NextAuth configuration
│   └── mongodb.ts            # MongoDB connection
├── scripts/                  # Scripts
│   └── seed.ts               # Database seed script
├── types/                    # TypeScript types
└── public/                   # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `GET/POST /api/auth/[...nextauth]` - NextAuth endpoints

### Reports
- `GET /api/reports` - Get user's reports
- `POST /api/reports` - Create new report
- `GET /api/reports/[id]` - Get specific report
- `DELETE /api/reports/[id]` - Delete report

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment

```bash
npm run build
npm start
```

### Environment Variables for Production

Make sure to set these in your hosting platform:
- `NEXTAUTH_URL` - Your production URL
- `NEXTAUTH_SECRET` - Generated secret
- `MONGODB_URI` - MongoDB connection string

## Usage Guide

### 1. Sign Up / Sign In

- Navigate to `/auth/signup` to create an account
- Use `/auth/signin` to log in

### 2. Upload Data

- Go to Dashboard
- Click "Upload File" or drag and drop
- Supported formats: `.xlsx`, `.xls`, `.csv`, `.pdf`, `.docx`

### 3. View Insights

After upload, you'll see:
- **Summary**: Overview of your data
- **Trends**: Patterns and changes detected
- **Anomalies**: Unusual data points
- **Recommendations**: Suggestions for analysis

### 4. Create Visualizations

- Select chart type (Bar, Line, Pie, Area, Radar)
- Choose X and Y axis columns
- Export as PNG, SVG, or PDF

### 5. Generate Reports

- Set report title
- Save report to history
- Export as PDF or DOCX

### 6. Manage Reports

- View saved reports in Dashboard
- Open, export, or delete reports

## File Format Support

### Excel (.xlsx, .xls)
- Supports multiple sheets (uses first sheet)
- Preserves column headers and data types

### CSV (.csv)
- Standard comma-separated values
- Auto-detects delimiters

### PDF (.pdf)
- Text extraction
- Attempts to parse tabular data

### Word (.docx)
- Text extraction
- Basic table parsing support

## Troubleshooting

### MongoDB Connection Issues
- Verify `MONGODB_URI` is correct
- Check MongoDB service is running (local)
- Verify network access (cloud)

### File Upload Errors
- Check file size (max 10MB)
- Verify file format is supported
- Ensure file isn't corrupted

### Authentication Issues
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies and try again

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Support

For issues, questions, or contributions, please open an issue on GitHub.

---

Built with ❤️ using Next.js 14
