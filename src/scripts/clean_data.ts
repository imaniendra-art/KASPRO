import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function cleanData() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI as string);
    console.log("Connected.");
    
    // Get all raw collections
    const collections = await mongoose.connection.db?.collections();
    if (!collections) {
      console.log("No collections found.");
      return process.exit(0);
    }
    
    for (const collection of collections) {
      // Skip users, units, and system collections
      if (collection.collectionName === 'users' || collection.collectionName === 'units' || collection.collectionName.startsWith('system')) {
        console.log(`Skipping collection: ${collection.collectionName}`);
        continue;
      }
      
      console.log(`Dropping data from collection: ${collection.collectionName}...`);
      try {
        await collection.deleteMany({});
        console.log(`Cleared all documents from ${collection.collectionName}`);
      } catch (err) {
        console.log(`Error clearing ${collection.collectionName}:`, err);
      }
    }
    
    console.log("Data cleanup complete. Database is clean!");
    process.exit(0);
  } catch (error) {
    console.error("Error during cleanup:", error);
    process.exit(1);
  }
}

cleanData();
