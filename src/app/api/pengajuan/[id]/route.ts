import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Pengajuan from "@/models/Pengajuan";
import ApprovalLog from "@/models/ApprovalLog";
import Proker from "@/models/Proker";
import PeriodeAnggaran from "@/models/PeriodeAnggaran";
import Unit from "@/models/Unit";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const resolvedParams = await params;
    const { id } = resolvedParams;

    await connectToDatabase();

    const data = await Pengajuan.findById(id).populate({
      path: "pengusulId",
      select: "namaLengkap divisi role unitId",
      populate: { path: "unitId", select: "namaUnit" }
    });
    if (!data) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });

    const logs = await ApprovalLog.find({ pengajuanId: id })
      .sort({ createdAt: 1 })
      .populate("userId", "namaLengkap role");

    const filteredLogs = logs.filter((log: any) => {
      if (log.tujuanCatatan === 'umum') return true;
      if (session.user.role === 'ketua') return true;
      if (session.user.role === 'admin' && log.tujuanCatatan === 'admin') return true;
      if (session.user.role === 'user' && log.tujuanCatatan === 'user') return true;
      return false;
    });

    return NextResponse.json({ data, logs: filteredLogs }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const resolvedParams = await params;
    const { id } = resolvedParams;

    const { status, aksi, totalDisetujui, catatanUmum, catatanAdmin, catatanUser, potongPaguMaster, rab } = await req.json();

    await connectToDatabase();

    const pengajuan = await Pengajuan.findById(id).populate({
      path: "pengusulId",
      populate: { path: "unitId", select: "namaUnit" }
    });
    if (!pengajuan) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });

    // Handle budget deduction on 'Dicairkan'
    if (status === "Dicairkan" && pengajuan.status !== "Dicairkan") {
      const deductionAmount = totalDisetujui !== undefined ? Number(totalDisetujui) : Number(pengajuan.totalNominal);

      // Deduct from PeriodeAnggaran Global (if potongPaguMaster is true or undefined/default true)
      // For Proker, we usually always want to deduct Pagu Master.
      // But we will respect the frontend's choice if passed.
      const shouldDeductPagu = pengajuan.potongPaguMaster !== false && pengajuan.prokerId;
      if (shouldDeductPagu) {
        const activePeriode = await PeriodeAnggaran.findOne({ isActive: true });
        if (activePeriode) {
          activePeriode.sisaPagu -= deductionAmount;
          await activePeriode.save();
        }
      }

      // Deduct from Proker if it exists
      if (pengajuan.prokerId) {
        const proker = await Proker.findById(pengajuan.prokerId);
        if (proker) {
          proker.sisaAnggaran -= deductionAmount;
          await proker.save();
        }
      }
    }

    // Update Pengajuan
    if (status) {
      if (status === "Dicairkan") {
        pengajuan.status = "Diproses Keuangan";
      } else {
        pengajuan.status = status;
      }
    }
    if (totalDisetujui !== undefined) pengajuan.totalDisetujui = totalDisetujui;
    if (potongPaguMaster !== undefined) pengajuan.potongPaguMaster = potongPaguMaster;
    if (rab) pengajuan.rab = rab;
    await pengajuan.save();

    // Trigger FINARA Integration if status becomes "Dicairkan" (which we just set to Diproses Keuangan)
    if (status === "Dicairkan" || pengajuan.status === "Diproses Keuangan") {
      try {
        const finaraUrl = process.env.FINARA_URL || "http://localhost:3000";
        await fetch(`${finaraUrl}/api/integrations/kaspro`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.KASPRO_API_SECRET}`
          },
          body: JSON.stringify({
            action: "create_draft",
            kasproId: pengajuan._id.toString(),
            judul: pengajuan.judul,
            nominal: pengajuan.totalDisetujui > 0 ? pengajuan.totalDisetujui : pengajuan.totalNominal,
            tanggal: new Date().toISOString(),
            // @ts-ignore
            pengusul: pengajuan.pengusulId ? `${pengajuan.pengusulId.namaLengkap} (${pengajuan.pengusulId.unitId?.namaUnit || pengajuan.pengusulId.divisi || pengajuan.pengusulId.role || "User"})` : "Sistem"
          })
        });
      } catch (err) {
        console.error("Gagal mengirim draft ke FINARA:", err);
      }
    }

    // Create Approval Log
    if (aksi) {
      const logAksi = aksi === "Dicairkan" ? "Dicairkan - Diproses Keuangan" : aksi;
      const logs = [];
      // Create logs based on notes provided
      if (catatanAdmin) logs.push({ pengajuanId: pengajuan._id, userId: session.user.id, role: session.user.role, aksi: logAksi, catatan: catatanAdmin, tujuanCatatan: 'admin' });
      if (catatanUser) logs.push({ pengajuanId: pengajuan._id, userId: session.user.id, role: session.user.role, aksi: logAksi, catatan: catatanUser, tujuanCatatan: 'user' });
      if (catatanUmum) logs.push({ pengajuanId: pengajuan._id, userId: session.user.id, role: session.user.role, aksi: logAksi, catatan: catatanUmum, tujuanCatatan: 'umum' });

      if (logs.length === 0) {
        logs.push({ pengajuanId: pengajuan._id, userId: session.user.id, role: session.user.role, aksi: logAksi, tujuanCatatan: 'umum' });
      }

      await ApprovalLog.insertMany(logs);
    }

    return NextResponse.json({ message: "Berhasil diupdate" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
