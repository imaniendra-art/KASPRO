import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Unit from "@/models/Unit";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const users = await User.find().select("-password").populate("unitId", "namaUnit").sort({ createdAt: -1 });

    return NextResponse.json({ data: users }, { status: 200 });
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

    const { namaLengkap, username, password, role, unitId } = await req.json();

    if (!namaLengkap || !username || !password || !role) {
      return NextResponse.json({ error: "Nama, username, password, dan role wajib diisi" }, { status: 400 });
    }

    if (role === "user" && !unitId) {
      return NextResponse.json({ error: "Unit wajib dipilih untuk role User" }, { status: 400 });
    }

    await dbConnect();

    const existing = await User.findOne({ username });
    if (existing) {
      return NextResponse.json({ error: "Username sudah digunakan" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let finalUnitId = role === "user" ? unitId : undefined;

    if (role === "ketua") {
      const pimpinanUnit = await Unit.findOneAndUpdate({ namaUnit: "Pimpinan" }, { namaUnit: "Pimpinan" }, { upsert: true, new: true });
      finalUnitId = pimpinanUnit._id;
    } else if (role === "admin") {
      const keuanganUnit = await Unit.findOneAndUpdate({ namaUnit: "Keuangan" }, { namaUnit: "Keuangan" }, { upsert: true, new: true });
      finalUnitId = keuanganUnit._id;
    }

    const user = new User({
      namaLengkap,
      username,
      password: hashedPassword,
      role,
      divisi: '-',
      unitId: finalUnitId
    });

    await user.save();

    const populated = await User.findById(user._id).select("-password").populate("unitId", "namaUnit");

    return NextResponse.json({ data: populated, message: "User berhasil dibuat" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
