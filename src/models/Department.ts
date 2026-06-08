import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDepartment extends Document {
  name: string;
  description: string;
  capacity: number;
}

const DepartmentSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  capacity: { type: Number, required: true, default: 10 },
}, { timestamps: true });

export const Department: Model<IDepartment> = mongoose.models.Department || mongoose.model<IDepartment>('Department', DepartmentSchema);
