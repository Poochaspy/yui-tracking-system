import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IShiftAssignment extends Document {
  shiftId: mongoose.Types.ObjectId;
  personnelId: mongoose.Types.ObjectId;
  personnelModel: 'User' | 'Trainee';
  date: string; // YYYY-MM-DD
}

const ShiftAssignmentSchema: Schema = new Schema({
  shiftId: { type: Schema.Types.ObjectId, required: true, ref: 'Shift' },
  personnelId: { type: Schema.Types.ObjectId, required: true, refPath: 'personnelModel' },
  personnelModel: { type: String, required: true, enum: ['User', 'Trainee'] },
  date: { type: String, required: true },
}, { timestamps: true });

export const ShiftAssignment: Model<IShiftAssignment> = mongoose.models.ShiftAssignment || mongoose.model<IShiftAssignment>('ShiftAssignment', ShiftAssignmentSchema);
