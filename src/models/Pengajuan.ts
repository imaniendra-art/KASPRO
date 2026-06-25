import mongoose, { Schema, Document } from 'mongoose';

export interface IRabItem {
  namaItem: string;
  jumlah: number;
  satuan: string;
  hargaSatuan: number;
  total: number;
  catatan?: string;
  lampiran?: string;
}

export interface IPengajuan extends Document {
  judul: string;
  deskripsi: string;
  prokerId?: mongoose.Types.ObjectId;
  pengusulId: mongoose.Types.ObjectId;
  totalNominal: number;
  totalDisetujui: number;
  status: 'Review Admin' | 'Menunggu Ketua' | 'Disetujui Ketua' | 'Dicairkan' | 'Ditolak' | 'Selesai';
  rab: IRabItem[];
  buktiLpj?: string;
  potongPaguMaster?: boolean;
}

const RabItemSchema = new Schema<IRabItem>({
  namaItem: { type: String, required: true },
  jumlah: { type: Number, required: true, default: 1 },
  satuan: { type: String, required: true },
  hargaSatuan: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true, default: 0 },
  catatan: { type: String },
  lampiran: { type: String }
});

const PengajuanSchema: Schema = new Schema({
  judul: { type: String, required: true },
  deskripsi: { type: String, required: true },
  prokerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Proker' },
  pengusulId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalNominal: { type: Number, required: true, default: 0 },
  totalDisetujui: { type: Number, default: 0 },
  status: { 
    type: String, 
    required: true, 
    enum: ['Review Admin', 'Menunggu Ketua', 'Disetujui Ketua', 'Dicairkan', 'Ditolak', 'Selesai'],
    default: 'Review Admin'
  },
  buktiLpj: { type: String },
  potongPaguMaster: { type: Boolean, default: true },
  rab: [RabItemSchema]
}, { timestamps: true });

export default mongoose.models.Pengajuan || mongoose.model<IPengajuan>('Pengajuan', PengajuanSchema);
