import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Pengajuan from "@/models/Pengajuan";
import ApprovalLog from "@/models/ApprovalLog";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || authHeader !== `Bearer ${process.env.KASPRO_API_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, kasproId, reason } = body;

    if (!action || !kasproId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    const pengajuan = await Pengajuan.findById(kasproId);
    if (!pengajuan) {
      return NextResponse.json({ error: "Pengajuan not found" }, { status: 404 });
    }

    if (action === "ready_for_lpj") {
      pengajuan.status = "Dicairkan";
      await pengajuan.save();

      await ApprovalLog.create({
        pengajuanId: kasproId,
        userId: null,
        role: "admin_keuangan",
        aksi: "Pencairan Selesai",
        catatan: "Dana telah disiapkan oleh Keuangan. Silakan gunakan dana dan unggah LPJ.",
        tujuanCatatan: "umum",
      });

      return NextResponse.json({ message: "Ready for LPJ processed successfully" }, { status: 200 });
    }

    if (action === "approve_lpj") {
      pengajuan.status = "Selesai";
      await pengajuan.save();

      await ApprovalLog.create({
        pengajuanId: kasproId,
        userId: null,
        role: "admin_keuangan",
        aksi: "Validasi LPJ",
        catatan: "LPJ telah diverifikasi dan disetujui oleh Keuangan. Transaksi Selesai.",
        tujuanCatatan: "umum",
      });

      return NextResponse.json({ message: "LPJ Approved successfully" }, { status: 200 });
    } 
    
    if (action === "reject_lpj") {
      pengajuan.status = "Dicairkan";
      await pengajuan.save();

      await ApprovalLog.create({
        pengajuanId: kasproId,
        userId: null,
        role: "admin_keuangan",
        aksi: "Tolak LPJ",
        catatan: `LPJ ditolak oleh Keuangan. Alasan: ${reason || "Silakan perbaiki dan unggah ulang."}`,
        tujuanCatatan: "umum",
      });

      return NextResponse.json({ message: "LPJ Rejected successfully" }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("FINARA Integration Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
