import mongoose, { Schema, Document } from 'mongoose';

export interface IRealisasi extends Document {
  pengajuanId: mongoose.Types.ObjectId;
  nominalRealisasi: number;
  buktiGambar: string; 
  keterangan?: string;
  status: 'Menunggu Verifikasi' | 'Disetujui' | 'Ditolak';
}

const RealisasiSchema: Schema = new Schema({
  pengajuanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pengajuan', required: true, unique: true },
  nominalRealisasi: { type: Number, required: true },
  buktiGambar: { type: String, required: true },
  keterangan: { type: String },
  status: {
    type: String,
    required: true,
    enum: ['Menunggu Verifikasi', 'Disetujui', 'Ditolak'],
    default: 'Menunggu Verifikasi'
  }
}, { timestamps: true });

export default mongoose.models.Realisasi || mongoose.model<IRealisasi>('Realisasi', RealisasiSchema);
