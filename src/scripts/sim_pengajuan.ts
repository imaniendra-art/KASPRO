import mongoose from "mongoose";
import * as dotenv from "dotenv";
import User from "../models/User";
import Pengajuan from "../models/Pengajuan";
import ApprovalLog from "../models/ApprovalLog";

dotenv.config({ path: ".env" });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI!);
  
  // Find or create User
  let pengusul = await User.findOne({ role: "user" });
  if (!pengusul) {
    pengusul = await User.create({
      username: "testuser",
      password: "123",
      namaLengkap: "Test User",
      role: "user",
      divisi: "-"
    });
  }

  let ketua = await User.findOne({ role: "ketua" });
  if (!ketua) {
    ketua = await User.create({
      username: "ketua",
      password: "123",
      namaLengkap: "Ketua",
      role: "ketua",
      divisi: "Pimpinan"
    });
  }

  // Create Pengajuan
  const p = new Pengajuan({
    judul: "Pengadaan Tinta dan Hub",
    deskripsi: "Pembelian tinta printer CMYK dan Hub",
    pengusulId: pengusul._id,
    totalNominal: 1280000,
    totalDisetujui: 1330000,
    status: "Dicairkan",
    rab: [
      { namaItem: "Tinta Hitam", jumlah: 1, satuan: "Buah", hargaSatuan: 240000, total: 240000 },
      { namaItem: "Tinta CMY", jumlah: 1, satuan: "Buah", hargaSatuan: 240000, total: 240000 },
      { namaItem: "Hub", jumlah: 1, satuan: "Buah", hargaSatuan: 800000, total: 800000 },
      { namaItem: "Bensin (Tambahan Ketua)", jumlah: 1, satuan: "Paket", hargaSatuan: 50000, total: 50000 }
    ],
    potongPaguMaster: true
  });

  await p.save();

  // Create ApprovalLog
  await ApprovalLog.create({
    pengajuanId: p._id,
    userId: ketua._id,
    role: "ketua",
    aksi: "Approve",
    catatan: "Dana pembeliannya saya tambah untuk membeli bensin",
    tujuanCatatan: "tendik" // legacy for 'user'
  });

  console.log("Berhasil membuat pengajuan untuk test:", p._id);
  process.exit(0);
}
run();
