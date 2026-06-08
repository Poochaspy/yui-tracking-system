import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITraineeAllocation extends Document {
  traineeId: mongoose.Types.ObjectId;
  departmentId: mongoose.Types.ObjectId;
  startDate: string;
  endDate?: string;
  status: 'Active' | 'Completed';
}

const TraineeAllocationSchema: Schema = new Schema({
  traineeId: { type: Schema.Types.ObjectId, ref: 'Trainee', required: true, index: true },
  departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true, index: true },
  startDate: { type: String, required: true },
  endDate: { type: String },
  status: { type: String, enum: ['Active', 'Completed'], default: 'Active' }
}, { timestamps: true });

export const TraineeAllocation: Model<ITraineeAllocation> = mongoose.models.TraineeAllocation || mongoose.model<ITraineeAllocation>('TraineeAllocation', TraineeAllocationSchema);
