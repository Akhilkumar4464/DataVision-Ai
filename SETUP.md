# DataVision Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here-generate-with-openssl-rand-base64-32
MONGODB_URI=mongodb://localhost:27017/datavision
OPENAI_API_KEY=your-openai-api-key-here
```

**Important**: 
- Generate a secure NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

- Get OpenAI API Key (Optional but Recommended):
  - Sign up at https://platform.openai.com
  - Navigate to API Keys section
  - Create a new API key
  - Add it to `.env.local` as `OPENAI_API_KEY`
  - **Note**: If not provided, the app will use rule-based insights as a fallback

### 3. Start MongoDB

**Local MongoDB:**
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Or use MongoDB Atlas (Cloud):**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string and update MONGODB_URI

### 4. Seed Database (Optional)

```bash
npm run seed
```

This creates:
- Test user: `test@example.com` / `password123`
- Sample report data

### 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Common Issues

### MongoDB Connection Error

**Problem**: `MongooseError: Operation timed out`

**Solutions**:
1. Verify MongoDB is running: `mongosh` or check service status
2. Check MONGODB_URI is correct
3. For MongoDB Atlas: Ensure IP whitelist includes your IP (0.0.0.0/0 for testing)

### NextAuth Secret Error

**Problem**: `Error: Missing NEXTAUTH_SECRET`

**Solution**: Generate and add NEXTAUTH_SECRET to `.env.local`

### Port Already in Use

**Problem**: `Port 3000 is already in use`

**Solution**: 
```bash
# Kill process on port 3000
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm run dev
```

### File Upload Not Working

**Problem**: File upload fails silently

**Solutions**:
1. Check file size (max 10MB default)
2. Verify file format is supported (.xlsx, .csv, .pdf, .docx)
3. Check browser console for errors
4. Verify Next.js server is running

## Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXTAUTH_URL` = your production URL
   - `NEXTAUTH_SECRET` = generated secret
   - `MONGODB_URI` = your MongoDB connection string
   - `OPENAI_API_KEY` = your OpenAI API key (optional but recommended)
4. Deploy!

### Other Platforms

1. Build: `npm run build`
2. Start: `npm start`
3. Ensure environment variables are set
4. Ensure MongoDB is accessible from server

## File Format Support

- **Excel** (.xlsx, .xls): Full support with SheetJS
- **CSV** (.csv): Full support
- **PDF** (.pdf): Text extraction, basic table parsing
- **DOCX** (.docx): Basic text extraction (limited table support)

For better DOCX support in production, consider adding `mammoth` package:
```bash
npm install mammoth
```

## Testing

### Test with Sample Data

Use the included sample CSV file:
```bash
# Located at public/sample-data.csv
# Upload through dashboard UI
```

### Manual Testing

1. Sign up / Sign in
2. Upload a CSV or Excel file
3. View insights
4. Create visualizations
5. Generate and export report
6. View saved reports

## Development Tips

### MongoDB GUI Tools

- **MongoDB Compass**: Official GUI tool
- **Studio 3T**: Feature-rich GUI
- **Robo 3T**: Lightweight GUI

### Debugging

1. Check browser console for client errors
2. Check terminal for server errors
3. Use MongoDB Compass to inspect database
4. Check Next.js API routes logs

## Need Help?

- Check README.md for detailed documentation
- Review error messages in browser console
- Check MongoDB connection status
- Verify all environment variables are set
