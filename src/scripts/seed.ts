import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI tidak ditemukan di .env.local");
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
        username: "tendik",
        password: passwordHash,
        namaLengkap: "Staf Tendik (User)",
        divisi: "Tendik",
        role: "user",
      },
      {
        username: "keuangan",
        password: passwordHash,
        namaLengkap: "Admin Keuangan",
        divisi: "Keuangan",
        role: "admin_keuangan",
      },
      {
        username: "ketua",
        password: passwordHash,
        namaLengkap: "Ketua Umum",
        divisi: "Pimpinan",
        role: "ketua",
      }
    ];

    await User.insertMany(users);
    console.log("Berhasil insert 4 akun dummy!");
    
    process.exit(0);
  } catch (error) {
    console.error("Gagal melakukan seeding:", error);
    process.exit(1);
  }
}

seed();
