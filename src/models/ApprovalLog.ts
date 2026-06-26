import mongoose, { Schema, Document } from 'mongoose';

export interface IApprovalLog extends Document {
  pengajuanId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: string;
  aksi: 'Approve' | 'Reject' | 'Kembalikan' | 'Teruskan' | 'Upload Bukti';
  catatan?: string;
  tujuanCatatan: 'user' | 'admin' | 'umum';
}

const ApprovalLogSchema: Schema = new Schema({
  pengajuanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pengajuan', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, required: true },
  aksi: { 
    type: String, 
    required: true,
    enum: ['Approve', 'Reject', 'Kembalikan', 'Teruskan', 'Upload Bukti']
  },
  catatan: { type: String },
  tujuanCatatan: {
    type: String,
    enum: ['user', 'admin', 'umum'],
    default: 'umum'
  }
}, { timestamps: true });

export default mongoose.models.ApprovalLog || mongoose.model<IApprovalLog>('ApprovalLog', ApprovalLogSchema);
