import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IShift extends Document {
  name: string;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

const ShiftSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
}, { timestamps: true });

export const Shift: Model<IShift> = mongoose.models.Shift || mongoose.model<IShift>('Shift', ShiftSchema);
