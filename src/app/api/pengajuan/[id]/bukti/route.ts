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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Vercel Serverless doesn't support writing to /public/uploads
    // Convert to Base64 data URI to store directly in MongoDB
    const mimeType = file.type || "application/octet-stream";
    const base64Data = buffer.toString("base64");
    const buktiUrl = `data:${mimeType};base64,${base64Data}`;

    await connectToDatabase();
    
    const pengajuan = await Pengajuan.findById(id);
    if (!pengajuan) {
      return NextResponse.json({ error: "Pengajuan tidak ditemukan" }, { status: 404 });
    }

    pengajuan.buktiLpj = buktiUrl;
    pengajuan.status = "LPJ Diperiksa";
    await pengajuan.save();

    // Trigger FINARA post_draft
    try {
      const finaraUrl = process.env.FINARA_URL || "http://localhost:3000";
      await fetch(`${finaraUrl}/api/integrations/kaspro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.KASPRO_API_SECRET}`
        },
        body: JSON.stringify({
          action: "post_draft",
          kasproId: pengajuan._id.toString(),
          buktiUrl: buktiUrl
        })
      });
    } catch (err) {
      console.error("Gagal mengirim post_draft ke FINARA:", err);
    }

    await ApprovalLog.create({
      pengajuanId: id,
      userId: session.user.id,
      role: session.user.role,
      aksi: "Upload Bukti",
      catatan: "Bukti telah diunggah. Menunggu verifikasi dari Keuangan.",
      tujuanCatatan: "umum"
    });

    return NextResponse.json({ message: "Bukti berhasil diunggah", buktiUrl }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
