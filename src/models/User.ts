import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password?: string; // Hashed password
  namaLengkap: string;
  divisi: string;
  role: 'user' | 'admin_keuangan' | 'wk2_keuangan' | 'ketua';
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  namaLengkap: { type: String, required: true },
  divisi: { type: String, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['user', 'admin_keuangan', 'wk2_keuangan', 'ketua'],
    default: 'user'
  }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
