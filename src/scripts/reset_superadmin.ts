import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI tidak ditemukan di .env.local");
}

async function resetAndSeed() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("Terhubung ke database.");

    // Hapus semua user tanpa ampun
    await User.deleteMany({});
    console.log("Berhasil menghapus semua data user.");

    const passwordHash = await bcrypt.hash("Admin123", 10);

    const superAdmin = {
      username: "Admin",
      password: passwordHash,
      namaLengkap: "Super Admin",
      divisi: "Pusdatin", // atau divisi default
      role: "admin",
      isSuperAdmin: true
    };

    await User.create(superAdmin);
    console.log("Berhasil membuat akun Super Admin!");
    
    process.exit(0);
  } catch (error) {
    console.error("Gagal melakukan reset dan seeding:", error);
    process.exit(1);
  }
}

resetAndSeed();
