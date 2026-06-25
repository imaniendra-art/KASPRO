import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Pengajuan from "@/models/Pengajuan";
import Proker from "@/models/Proker";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const judul = formData.get("judul") as string;
    const deskripsi = formData.get("deskripsi") as string;
    const rabString = formData.get("rab") as string;
    const prokerId = formData.get("prokerId") as string | null;

    if (!judul || !deskripsi || !rabString) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    let rab = JSON.parse(rabString);
    const totalNominal = rab.reduce((acc: number, item: any) => acc + (item.total || 0), 0);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    for (let i = 0; i < rab.length; i++) {
      const file = formData.get(`file_${i}`) as File | null;
      if (file) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
        const filePath = path.join(uploadDir, fileName);
        await fs.writeFile(filePath, buffer);
        rab[i].lampiran = `/uploads/${fileName}`;
      }
    }

    await connectToDatabase();

    if (prokerId) {
      const proker = await Proker.findById(prokerId);
      if (!proker) {
        return NextResponse.json({ error: "Proker tidak ditemukan" }, { status: 404 });
      }
      if (totalNominal > proker.sisaAnggaran) {
        return NextResponse.json({ error: `Total pengajuan (Rp ${totalNominal.toLocaleString('id-ID')}) melebihi sisa pagu proker (Rp ${proker.sisaAnggaran.toLocaleString('id-ID')})` }, { status: 400 });
      }
    }

    const newPengajuan = await Pengajuan.create({
      judul,
      deskripsi,
      prokerId: prokerId || undefined,
      pengusulId: session.user.id,
      totalNominal,
      totalDisetujui: 0,
      status: "Review Admin",
      rab
    });

    return NextResponse.json({ message: "Pengajuan berhasil dibuat", data: newPengajuan }, { status: 201 });
  } catch (error: any) {
    console.error("POST Pengajuan Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    let query = {};
    // Jika role user, hanya ambil miliknya. Jika admin/ketua, ambil semua (bisa ditambah filter nanti).
    if (session.user.role === "tendik") {
      query = { pengusulId: session.user.id };
    }

    const data = await Pengajuan.find(query).sort({ createdAt: -1 }).populate("pengusulId", "namaLengkap divisi");

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
