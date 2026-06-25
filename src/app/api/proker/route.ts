import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Proker from "@/models/Proker";
import PeriodeAnggaran from "@/models/PeriodeAnggaran";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    // Find active periode
    const activePeriode = await PeriodeAnggaran.findOne({ isActive: true });
    
    // If Admin/Keuangan/Ketua, they can see all prokers (maybe filtered by period)
    // If Tendik (Divisi), they only see their own prokers
    let filter: any = {};
    if (activePeriode) {
      filter.periodeId = activePeriode._id;
    }
    
    if (session.user.role === "Tendik") {
      filter.pengusulId = session.user.id;
    }

    const prokers = await Proker.find(filter).populate("pengusulId", "namaLengkap").sort({ createdAt: -1 });

    return NextResponse.json({ data: prokers }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { judul, deskripsi, rab } = await req.json();

    if (!judul || !deskripsi || !rab || !Array.isArray(rab) || rab.length === 0) {
      return NextResponse.json({ error: "Judul, deskripsi, dan RAB minimal 1 item wajib diisi" }, { status: 400 });
    }

    // Hitung estimasi anggaran dari RAB
    const estimasiAnggaran = rab.reduce((acc: number, curr: any) => acc + (Number(curr.jumlah) * Number(curr.hargaSatuan)), 0);

    await dbConnect();

    // Check for active period
    const activePeriode = await PeriodeAnggaran.findOne({ isActive: true });
    if (!activePeriode) {
      return NextResponse.json({ error: "Tidak ada Periode Anggaran yang aktif. Harap hubungi Keuangan." }, { status: 400 });
    }

    const proker = new Proker({
      judul,
      deskripsi,
      estimasiAnggaran: Number(estimasiAnggaran),
      rab,
      sisaAnggaran: 0, // 0 until validated
      status: "Draft",
      periodeId: activePeriode._id,
      pengusulId: session.user.id
    });

    await proker.save();

    return NextResponse.json({ data: proker, message: "Draf Proker berhasil dibuat" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
