import mongoose from "mongoose";
import * as dotenv from "dotenv";
import User from "../models/User";
import Proker from "../models/Proker";
import PeriodeAnggaran from "../models/PeriodeAnggaran";

dotenv.config({ path: ".env" });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI!);

  // Get User
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

  // Get Active Periode
  let periode = await PeriodeAnggaran.findOne({ isActive: true });

  const createRAB = (numItems: number) => {
    const rab = [];
    for (let i = 1; i <= numItems; i++) {
      rab.push({
        namaItem: `Item Kebutuhan ${i}`,
        jumlah: 1,
        satuan: "Paket",
        hargaSatuan: 100000,
        total: 100000
      });
    }
    return rab;
  };

  // Proker 1
  const rab1 = createRAB(3);
  const p1 = new Proker({
    judul: "Proker 1 (3 Item - Di-ACC)",
    deskripsi: "Proker simulasi pertama dengan 3 item.",
    pengusulId: pengusul._id,
    periodeId: periode?._id,
    estimasiAnggaran: 300000,
    sisaAnggaran: 300000,
    status: "Divalidasi Keuangan",
    rab: rab1,
  });
  await p1.save();

  // Proker 3
  const rab3 = createRAB(10);
  const p3 = new Proker({
    judul: "Proker 3 (10 Item - Di-ACC)",
    deskripsi: "Proker simulasi ketiga dengan 10 item.",
    pengusulId: pengusul._id,
    periodeId: periode?._id,
    estimasiAnggaran: 1000000,
    sisaAnggaran: 1000000,
    status: "Divalidasi Keuangan",
    rab: rab3,
  });
  await p3.save();

  // Proker 2 (Initially 6 items, but Admin removes 2 items)
  const rab2 = createRAB(4); // 6 - 2 = 4 items left
  const p2 = new Proker({
    judul: "Proker 2 (6 Item awal, direvisi jadi 4 Item)",
    deskripsi: "Proker simulasi kedua dengan awalnya 6 item, dikurangi admin.",
    pengusulId: pengusul._id,
    periodeId: periode?._id,
    estimasiAnggaran: 400000, // Reduced from 600000
    sisaAnggaran: 400000,
    status: "Menunggu Validasi", // Assuming Admin just left a note and it might be sent back, or maybe still "Menunggu Validasi"?
    catatan: "Admin: Saya hapus 2 item karena anggarannya terlalu besar, jadi sisa 4 item ya.",
    rab: rab2,
  });
  await p2.save();

  console.log("Mock data proker berhasil dibuat!");
  process.exit(0);
}
run();
