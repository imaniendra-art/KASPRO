import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Proker from "@/models/Proker";
import PeriodeAnggaran from "@/models/PeriodeAnggaran";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status, estimasiAnggaran, catatan, judul, deskripsi, capaian, baseLine, target, waktuPelaksanaan, sasaran, pesertaMitra, rab } = await req.json();
    
    await dbConnect();

    const resolvedParams = await params;
    const proker = await Proker.findById(resolvedParams.id);
    if (!proker) {
      return NextResponse.json({ error: "Proker tidak ditemukan" }, { status: 404 });
    }

    // Validation by Admin
    if (["admin", "ketua"].includes(session.user.role)) {
      if (status === "Divalidasi Keuangan") {
        // Find active periode to ensure we don't exceed Master Pagu
        const periode = await PeriodeAnggaran.findById(proker.periodeId);
        if (!periode) {
          return NextResponse.json({ error: "Periode anggaran tidak ditemukan" }, { status: 400 });
        }

        const approvedAnggaran = estimasiAnggaran ? Number(estimasiAnggaran) : proker.estimasiAnggaran;

        proker.status = "Divalidasi Keuangan";
        proker.sisaAnggaran = approvedAnggaran;
        if (estimasiAnggaran) proker.estimasiAnggaran = approvedAnggaran;
      } else if (status === "Ditolak") {
        proker.status = "Ditolak";
      } else if (status === "Draft") {
        // Ini adalah aksi "Kembalikan / Pending"
        proker.status = "Draft";
      }

      // Update catatan jika ada
      if (catatan !== undefined) {
        proker.catatan = catatan;
      }
      
      // Allow Admin to edit RAB per item during validation
      if (rab !== undefined) {
        proker.rab = rab;
      }
    } 
    // Submission by User/Divisi
    else {
      if (status === "Menunggu Validasi" && proker.status === "Draft") {
        proker.status = "Menunggu Validasi";
      } else if (proker.status === "Draft") {
        if (estimasiAnggaran !== undefined) proker.estimasiAnggaran = Number(estimasiAnggaran);
        if (judul !== undefined) proker.judul = judul;
        if (deskripsi !== undefined) proker.deskripsi = deskripsi;
        if (capaian !== undefined) proker.capaian = capaian;
        if (baseLine !== undefined) proker.baseLine = Number(baseLine);
        if (target !== undefined) proker.target = Number(target);
        if (waktuPelaksanaan !== undefined) proker.waktuPelaksanaan = waktuPelaksanaan;
        if (sasaran !== undefined) proker.sasaran = sasaran;
        if (pesertaMitra !== undefined) proker.pesertaMitra = pesertaMitra;
        if (rab !== undefined) proker.rab = rab;
      }
    }

    await proker.save();

    return NextResponse.json({ data: proker, message: "Proker berhasil diperbarui" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    const resolvedParams = await params;
    const proker = await Proker.findById(resolvedParams.id);
    if (!proker) {
      return NextResponse.json({ error: "Proker tidak ditemukan" }, { status: 404 });
    }

    if (proker.status !== "Draft" && proker.status !== "Ditolak" && session.user.role !== "admin") {
      return NextResponse.json({ error: "Hanya draf atau proker yang ditolak yang bisa dihapus" }, { status: 400 });
    }

    await Proker.findByIdAndDelete(resolvedParams.id);

    return NextResponse.json({ message: "Proker berhasil dihapus" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
