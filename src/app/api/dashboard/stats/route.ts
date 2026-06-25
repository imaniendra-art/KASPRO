import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import PeriodeAnggaran from "@/models/PeriodeAnggaran";
import Pengajuan from "@/models/Pengajuan";
import User from "@/models/User"; // Ensure User is loaded for population
import Proker from "@/models/Proker";
import ApprovalLog from "@/models/ApprovalLog";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const activePeriode = await PeriodeAnggaran.findOne({ isActive: true });
    
    // ============================================
    // USER SPECIFIC DASHBOARD (role === 'user')
    // ============================================
    if (session.user.role === "user") {
      const userId = session.user.id;

      // 1. Rencana Proker Rp. (Sum of estimasiAnggaran for user's Proker)
      const prokerAgg = await Proker.aggregate([
        { $match: { pengusulId: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, total: { $sum: "$estimasiAnggaran" } } }
      ]);
      const rencanaProker = prokerAgg.length > 0 ? prokerAgg[0].total : 0;

      // 2. Total diajukan Rp. (Sum of totalNominal for all user's Pengajuan)
      const diajukanAgg = await Pengajuan.aggregate([
        { $match: { pengusulId: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, total: { $sum: "$totalNominal" } } }
      ]);
      const totalDiajukan = diajukanAgg.length > 0 ? diajukanAgg[0].total : 0;

      // 3. Dana Cair ACC (Sum of totalDisetujui where status is Dicairkan/Selesai)
      const cairAgg = await Pengajuan.aggregate([
        { 
          $match: { 
            pengusulId: new mongoose.Types.ObjectId(userId),
            status: { $in: ["Dicairkan", "Selesai"] }
          } 
        },
        { $group: { _id: null, total: { $sum: "$totalDisetujui" } } }
      ]);
      const danaCair = cairAgg.length > 0 ? cairAgg[0].total : 0;

      // 4. Notif Proses (Count of active/pending pengajuan)
      const notifProses = await Pengajuan.countDocuments({
        pengusulId: new mongoose.Types.ObjectId(userId),
        status: { $nin: ["Draft", "Ditolak", "Selesai", "Dicairkan"] } // Currently processing
      });

      // 5. Riwayat pengajuan & proses LPJ (Table data)
      const riwayatPengajuanRaw = await Pengajuan.find({ pengusulId: new mongoose.Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .populate("prokerId", "judul")
        .lean();

      // Fetch latest messages from ApprovalLog for each pengajuan
      const riwayatPengajuan = await Promise.all(riwayatPengajuanRaw.map(async (p: any) => {
        const latestLog = await ApprovalLog.findOne({ 
          pengajuanId: p._id,
          catatan: { $exists: true, $ne: "" },
          tujuanCatatan: { $in: ['user', 'umum'] }
        }).sort({ createdAt: -1 }).lean();

        return {
          ...p,
          pesan: latestLog ? latestLog.catatan : null
        };
      }));

      // 6. Riwayat Proker
      const riwayatProker = await Proker.find({ pengusulId: new mongoose.Types.ObjectId(userId) })
        .sort({ updatedAt: -1 })
        .limit(5)
        .lean();

      // 7. Recent Returned Proker Notif (Draft with catatan, or Ditolak)
      const recentReturnedProker = await Proker.findOne({ 
        pengusulId: new mongoose.Types.ObjectId(userId),
        status: { $in: ["Draft", "Ditolak"] },
        catatan: { $exists: true, $ne: "" }
      }).sort({ updatedAt: -1 }).lean();

      return NextResponse.json({
        data: {
          role: "user",
          rencanaProker,
          totalDiajukan,
          danaCair,
          notifProses,
          riwayatPengajuan,
          riwayatProker,
          recentReturnedProker
        }
      }, { status: 200 });
    }

    // ============================================
    // ADMIN/KETUA DASHBOARD (role !== 'user')
    // ============================================

    // Total Pengeluaran = Total from ALL "Dicairkan" and "Selesai" pengajuan in the system
    // (Or we can filter by activePeriode.createdAt, but let's just use all 'Dicairkan'/'Selesai' for simplicity)
    const pengeluaranDoc = await Pengajuan.aggregate([
      { $match: { status: { $in: ["Dicairkan", "Selesai"] } } },
      { $group: { _id: null, total: { $sum: "$totalDisetujui" } } }
    ]);
    
    const totalPengeluaran = pengeluaranDoc.length > 0 ? pengeluaranDoc[0].total : 0;
    
    // If we have an active periode, kas awal is paguMaster, and sisa kas is sisaPagu.
    // If not, we just show 0 to avoid errors.
    const totalKas = activePeriode ? activePeriode.paguMaster : 0;
    const sisaKas = activePeriode ? activePeriode.sisaPagu : 0;
    const persentaseTerpakai = totalKas > 0 ? ((totalKas - sisaKas) / totalKas) * 100 : 0;

    // Get 1 most recent pengajuan
    const recentPengajuan = await Pengajuan.findOne()
      .sort({ createdAt: -1 })
      .populate({ path: "pengusulId", select: "namaLengkap role divisi", model: User });

    // Get 1 most recent proker awaiting validation
    const recentProker = await Proker.findOne({ status: "Menunggu Validasi" })
      .sort({ updatedAt: -1 })
      .populate({ path: "pengusulId", select: "namaLengkap role divisi", model: User });

    return NextResponse.json({
      data: {
        role: session.user.role,
        totalKas,
        sisaKas,
        totalPengeluaran,
        persentaseTerpakai: Math.round(persentaseTerpakai * 10) / 10, // rounded to 1 decimal
        recentPengajuan,
        recentProker
      }
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
