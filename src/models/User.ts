import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password?: string; // Hashed password
  namaLengkap: string;
  divisi: string;
  role: 'admin' | 'ketua' | 'user';
  unitId?: mongoose.Types.ObjectId;
  isSuperAdmin?: boolean;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  namaLengkap: { type: String, required: true },
  divisi: { type: String, default: '' },
  role: { 
    type: String, 
    required: true, 
    enum: ['admin', 'ketua', 'user'],
    default: 'user'
  },
  unitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
  isSuperAdmin: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
