import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import User from '../lib/models/User';
import Report from '../lib/models/Report';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/datavision';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Report.deleteMany({});
    console.log('Cleared existing data');

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
    });
    console.log('Created test user:', user.email);

    // Create sample report
    const sampleReport = await Report.create({
      userId: user._id,
      title: 'Sample Sales Report',
      fileName: 'sales_data.xlsx',
      fileType: 'xlsx',
      data: {
        columns: ['Month', 'Sales', 'Revenue'],
        rows: [
          ['January', '150', '15000'],
          ['February', '200', '20000'],
          ['March', '180', '18000'],
          ['April', '220', '22000'],
          ['May', '250', '25000'],
        ],
        metadata: {
          fileName: 'sales_data.xlsx',
          fileType: 'xlsx',
          rowCount: 5,
          columnCount: 3,
        },
      },
      insights: {
        summary: 'This report analyzes sales data showing an overall upward trend in both units sold and revenue. The data spans 5 months with consistent growth.',
        trends: [
          'Sales shows an upward trend (66.7% increase from January to May).',
          'Revenue shows an upward trend (66.7% increase from January to May).',
        ],
        anomalies: [],
        recommendations: [
          'Multiple numeric columns found. Consider creating correlation analysis between variables.',
          'Trends detected. Consider implementing time-series analysis for deeper insights.',
          'Data structure looks good. Explore different visualization types to uncover hidden patterns.',
        ],
      },
      charts: [
        {
          type: 'bar',
          data: [
            { Month: 'January', Sales: 150 },
            { Month: 'February', Sales: 200 },
            { Month: 'March', Sales: 180 },
            { Month: 'April', Sales: 220 },
            { Month: 'May', Sales: 250 },
          ],
          config: {},
        },
      ],
    });
    console.log('Created sample report:', sampleReport.title);

    console.log('\n✅ Seeding completed successfully!');
    console.log('\nTest credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
