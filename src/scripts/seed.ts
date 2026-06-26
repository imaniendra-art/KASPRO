import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI tidak ditemukan di .env");
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("Terhubung ke database.");

    // Hapus semua user lama (opsional, untuk reset)
    await User.deleteMany({});
    console.log("Membersihkan data user lama...");

    const passwordHash = await bcrypt.hash("admin123", 10);

    const users = [
      {
        username: "admin",
        password: passwordHash,
        namaLengkap: "Admin KASPRO",
        divisi: "Pusdatin",
        role: "admin",
      }
    ];

    await User.insertMany(users);
    console.log("Berhasil insert akun admin!");
    
    process.exit(0);
  } catch (error) {
    console.error("Gagal melakukan seeding:", error);
    process.exit(1);
  }
}

seed();
