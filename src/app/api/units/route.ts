import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Unit from "@/models/Unit";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const units = await Unit.find().sort({ namaUnit: 1 });

    return NextResponse.json({ data: units }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { namaUnit } = await req.json();
    if (!namaUnit) {
      return NextResponse.json({ error: "Nama unit wajib diisi" }, { status: 400 });
    }

    await dbConnect();

    const existing = await Unit.findOne({ namaUnit });
    if (existing) {
      return NextResponse.json({ error: "Unit dengan nama tersebut sudah ada" }, { status: 400 });
    }

    const unit = new Unit({ namaUnit });
    await unit.save();

    return NextResponse.json({ data: unit, message: "Unit berhasil ditambahkan" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
