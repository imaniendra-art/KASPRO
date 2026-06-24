import mongoose, { Schema, Document } from 'mongoose';

export interface IProker extends Document {
  judul: string;
  deskripsi: string;
  estimasiAnggaran: number;
  status: 'Draft' | 'Menunggu Persetujuan' | 'Disetujui' | 'Ditolak';
  pengusulId: mongoose.Types.ObjectId;
}

const ProkerSchema: Schema = new Schema({
  judul: { type: String, required: true },
  deskripsi: { type: String, required: true },
  estimasiAnggaran: { type: Number, required: true, default: 0 },
  status: { 
    type: String, 
    required: true, 
    enum: ['Draft', 'Menunggu Persetujuan', 'Disetujui', 'Ditolak'],
    default: 'Draft'
  },
  pengusulId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.models.Proker || mongoose.model<IProker>('Proker', ProkerSchema);
