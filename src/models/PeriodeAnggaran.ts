import mongoose, { Schema, Document } from 'mongoose';

export interface IPeriodeAnggaran extends Document {
  semester: 'Ganjil' | 'Genap';
  tahunAjaran: string; // e.g., "2026/2027"
  paguMaster: number; // Total budget allocated for this period
  sisaPagu: number; // Remaining budget after proker validations / direct pengajuan
  isActive: boolean; // Only one period can be active at a time
  createdBy: mongoose.Types.ObjectId;
}

const PeriodeAnggaranSchema: Schema = new Schema({
  semester: { type: String, enum: ['Ganjil', 'Genap'], required: true },
  tahunAjaran: { type: String, required: true },
  paguMaster: { type: Number, required: true, default: 0 },
  sisaPagu: { type: Number, required: true, default: 0 },
  isActive: { type: Boolean, required: true, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Ensure only one period can be active at a time
PeriodeAnggaranSchema.pre('save', async function() {
  if (this.isActive) {
    await mongoose.models.PeriodeAnggaran.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isActive: false } }
    );
  }
});

export default mongoose.models.PeriodeAnggaran || mongoose.model<IPeriodeAnggaran>('PeriodeAnggaran', PeriodeAnggaranSchema);
