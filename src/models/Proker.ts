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

const RabItemSchema = new Schema<IRabItem>({
  namaItem: { type: String, required: true },
  jumlah: { type: Number, required: true, default: 1 },
  satuan: { type: String, required: true },
  hargaSatuan: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true, default: 0 },
  catatan: { type: String },
  lampiran: { type: String }
});

export interface IProker extends Document {
  judul: string;
  deskripsi: string;
  capaian: string;
  baseLine: number;
  target: number;
  waktuPelaksanaan: string;
  sasaran: string;
  pesertaMitra: string;
  estimasiAnggaran: number;
  sisaAnggaran: number;
  periodeId?: mongoose.Types.ObjectId;
  status: 'Draft' | 'Menunggu Validasi' | 'Divalidasi Keuangan' | 'Ditolak';
  pengusulId: mongoose.Types.ObjectId;
  catatan?: string;
  rab: IRabItem[];
}

const ProkerSchema: Schema = new Schema({
  judul: { type: String, required: true },
  deskripsi: { type: String, required: true },
  capaian: { type: String, default: '' },
  baseLine: { type: Number, default: 0 },
  target: { type: Number, default: 0 },
  waktuPelaksanaan: { type: String, default: '' },
  sasaran: { type: String, default: '' },
  pesertaMitra: { type: String, default: '' },
  estimasiAnggaran: { type: Number, required: true, default: 0 },
  sisaAnggaran: { type: Number, default: 0 },
  periodeId: { type: mongoose.Schema.Types.ObjectId, ref: 'PeriodeAnggaran' },
  status: { 
    type: String, 
    required: true, 
    enum: ['Draft', 'Menunggu Validasi', 'Divalidasi Keuangan', 'Ditolak'],
    default: 'Draft'
  },
  catatan: { type: String },
  pengusulId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rab: [RabItemSchema]
}, { timestamps: true });

export default mongoose.models.Proker || mongoose.model<IProker>('Proker', ProkerSchema);
