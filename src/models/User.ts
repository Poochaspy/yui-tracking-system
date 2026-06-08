import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  role: 'admin' | 'employee';
  status: 'Working' | 'Available' | 'On Break' | 'Off Duty';
  departmentId?: mongoose.Types.ObjectId;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
  status: { 
    type: String, 
    enum: ['Working', 'Available', 'On Break', 'Off Duty'], 
    default: 'Off Duty' 
  },
  departmentId: { type: Schema.Types.ObjectId, ref: 'Department' },
}, { timestamps: true });

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
