import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/datavision';

async function fixIndexes() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB database:', mongoose.connection.name);

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database handle not available');
    }

    const collections = await db.listCollections().toArray();
    console.log('Existing collections:', collections.map((c) => c.name).join(', '));

    const hasUsers = collections.some((c) => c.name === 'users');
    if (hasUsers) {
      const usersCollection = db.collection('users');
      const indexes = await usersCollection.indexes();
      console.log('Current indexes on users collection:', JSON.stringify(indexes, null, 2));

      for (const idx of indexes) {
        if (idx.name && (idx.name === 'username_1' || (idx.key && 'username' in idx.key))) {
          console.log(`Dropping legacy index: ${idx.name}...`);
          await usersCollection.dropIndex(idx.name);
          console.log(`Successfully dropped index ${idx.name}!`);
        }
      }
    } else {
      console.log('No users collection found yet.');
    }

    console.log('\n Index cleanup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error cleaning indexes:', error);
    process.exit(1);
  }
}

fixIndexes();
