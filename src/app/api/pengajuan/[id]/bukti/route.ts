import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Pengajuan from "@/models/Pengajuan";
import ApprovalLog from "@/models/ApprovalLog";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    const formData = await req.formData();
    const file = formData.get("bukti") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File bukti tidak ditemukan" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `bukti-${id}-${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);
    const buktiUrl = `/uploads/${fileName}`;

    await connectToDatabase();
    
    const pengajuan = await Pengajuan.findById(id);
    if (!pengajuan) {
      return NextResponse.json({ error: "Pengajuan tidak ditemukan" }, { status: 404 });
    }

    pengajuan.buktiLpj = buktiUrl;
    pengajuan.status = "Selesai";
    await pengajuan.save();

    await ApprovalLog.create({
      pengajuanId: id,
      userId: session.user.id,
      role: session.user.role,
      aksi: "Upload Bukti",
      catatan: "Bukti telah diunggah. Pengajuan dinyatakan Selesai.",
      tujuanCatatan: "umum"
    });

    return NextResponse.json({ message: "Bukti berhasil diunggah", buktiUrl }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
