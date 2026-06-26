import mongoose, { Schema, Document } from 'mongoose';

export interface IUnit extends Document {
  namaUnit: string;
}

const UnitSchema: Schema = new Schema({
  namaUnit: { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.models.Unit || mongoose.model<IUnit>('Unit', UnitSchema);
