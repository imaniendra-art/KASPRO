import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import PeriodeAnggaran from "@/models/PeriodeAnggaran";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const periodes = await PeriodeAnggaran.find().sort({ createdAt: -1 });

    return NextResponse.json({ data: periodes }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized: Session is null" }, { status: 401 });
    }
    if (session.user.role !== "admin_keuangan") {
      return NextResponse.json({ error: `Unauthorized: Your role is ${session.user.role}` }, { status: 401 });
    }

    const { semester, tahunAjaran, paguMaster, isActive } = await req.json();

    if (!semester || !tahunAjaran || paguMaster === undefined) {
      return NextResponse.json({ error: "Semester, Tahun Ajaran, dan Pagu Master wajib diisi" }, { status: 400 });
    }

    await dbConnect();

    const newPeriode = new PeriodeAnggaran({
      semester,
      tahunAjaran,
      paguMaster: Number(paguMaster),
      sisaPagu: Number(paguMaster), // Initially sisa is the same as master
      isActive: isActive || false,
      createdBy: session.user.id
    });
    await newPeriode.save();

    return NextResponse.json({ data: newPeriode, message: "Periode berhasil ditambahkan" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
