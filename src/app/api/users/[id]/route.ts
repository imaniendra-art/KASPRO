import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Unit from "@/models/Unit";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const resolvedParams = await params;
    const isSelfEdit = session.user.id === resolvedParams.id;

    if (session.user.role !== "admin" && !isSelfEdit) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { namaLengkap, username, password, role, unitId } = await req.json();

    await dbConnect();
    const user = await User.findById(resolvedParams.id);
    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    // Everyone can update username and password
    if (username !== undefined) user.username = username;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // Only admin can update namaLengkap, role, and unitId
    if (session.user?.role === "admin") {
      if (namaLengkap !== undefined) user.namaLengkap = namaLengkap;
      if (role !== undefined) user.role = role;
      
      if (!user.isSuperAdmin) {
        if (user.role === "ketua") {
          const pimpinanUnit = await Unit.findOneAndUpdate({ namaUnit: "Pimpinan" }, { namaUnit: "Pimpinan" }, { upsert: true, new: true });
          user.unitId = pimpinanUnit._id;
        } else if (user.role === "admin") {
          const keuanganUnit = await Unit.findOneAndUpdate({ namaUnit: "Keuangan" }, { namaUnit: "Keuangan" }, { upsert: true, new: true });
          user.unitId = keuanganUnit._id;
        } else if (user.role === "user") {
          if (unitId !== undefined) user.unitId = unitId;
        }
      }
    }

    await user.save();

    const populated = await User.findById(user._id).select("-password").populate("unitId", "namaUnit");

    return NextResponse.json({ data: populated, message: "User berhasil diperbarui" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const resolvedParams = await params;
    
    // Prevent deleting self
    if (resolvedParams.id === session.user.id) {
      return NextResponse.json({ error: "Tidak bisa menghapus akun sendiri" }, { status: 400 });
    }

    const userToDelete = await User.findById(resolvedParams.id);
    if (!userToDelete) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    if (userToDelete.isSuperAdmin) {
      return NextResponse.json({ error: "Akun Super Admin tidak bisa dihapus" }, { status: 403 });
    }

    await User.findByIdAndDelete(resolvedParams.id);

    return NextResponse.json({ message: "User berhasil dihapus" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
