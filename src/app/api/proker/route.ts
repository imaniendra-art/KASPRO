import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Proker from "@/models/Proker";
import Unit from "@/models/Unit";
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
    
    // If Admin/Ketua, they can see all prokers (maybe filtered by period)
    // If User, they only see their own prokers
    let query: any = {};
    const { searchParams } = new URL(req.url);
    const periodeId = searchParams.get("periodeId");
    
    if (periodeId) {
      query.periodeId = periodeId;
    } else if (activePeriode) {
      query.periodeId = activePeriode._id;
    }
    
    if (session.user.role === "user") {
      query.pengusulId = session.user.id;
    }

    const prokers = await Proker.find(query).populate({ path: "pengusulId", select: "namaLengkap divisi role unitId", populate: { path: "unitId", select: "namaUnit" } }).sort({ createdAt: -1 });

    return NextResponse.json({ data: prokers, hasActivePeriode: !!activePeriode }, { status: 200 });
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

    const { judul, deskripsi, capaian, baseLine, target, waktuPelaksanaan, sasaran, pesertaMitra, rab } = await req.json();

    if (!judul || !deskripsi || !rab || !Array.isArray(rab) || rab.length === 0) {
      return NextResponse.json({ error: "Judul, deskripsi, dan RAB minimal 1 item wajib diisi" }, { status: 400 });
    }

    // Hitung estimasi anggaran dari RAB
    const estimasiAnggaran = rab.reduce((acc: number, curr: any) => acc + (Number(curr.jumlah) * Number(curr.hargaSatuan)), 0);

    await dbConnect();

    // Check for active period
    const activePeriode = await PeriodeAnggaran.findOne({ isActive: true });
    if (!activePeriode) {
      return NextResponse.json({ error: "Tidak ada Periode Anggaran yang aktif. Harap hubungi Admin." }, { status: 400 });
    }

    const proker = new Proker({
      judul,
      deskripsi,
      capaian: capaian || '',
      baseLine: Number(baseLine) || 0,
      target: Number(target) || 0,
      waktuPelaksanaan: waktuPelaksanaan || '',
      sasaran: sasaran || '',
      pesertaMitra: pesertaMitra || '',
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
