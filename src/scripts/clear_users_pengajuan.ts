import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import mongoose from "mongoose";
import User from "../models/User";
import Pengajuan from "../models/Pengajuan";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Tolong pastikan MONGODB_URI sudah diatur di dalam file .env");
}

async function clearData() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected.");

    console.log("Deleting all Pengajuan...");
    const pengajuanResult = await Pengajuan.deleteMany({});
    console.log(`Deleted ${pengajuanResult.deletedCount} pengajuan.`);

    console.log("Deleting all Users...");
    const userResult = await User.deleteMany({});
    console.log(`Deleted ${userResult.deletedCount} users.`);

    console.log("Data clearing completed successfully.");
  } catch (error) {
    console.error("Error during data clearing:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database.");
  }
}

clearData();
