import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import PeriodeAnggaran from "@/models/PeriodeAnggaran";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.role === "keuangan") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isActive } = await req.json();

    await dbConnect();

    const resolvedParams = await params;
    const periode = await PeriodeAnggaran.findById(resolvedParams.id);
    if (!periode) {
      return NextResponse.json({ error: "Periode tidak ditemukan" }, { status: 404 });
    }

    // Using save() triggers the pre-save hook which handles deactivating others
    periode.isActive = isActive;
    await periode.save();

    return NextResponse.json({ data: periode, message: "Status periode diperbarui" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.role === "keuangan") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const resolvedParams = await params;
    await PeriodeAnggaran.findByIdAndDelete(resolvedParams.id);

    return NextResponse.json({ message: "Periode berhasil dihapus" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
