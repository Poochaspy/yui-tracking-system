import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITrainee extends Document {
  name: string;
  email: string;
  status: 'Working' | 'Available' | 'On Break' | 'Off Duty';
  departmentId?: mongoose.Types.ObjectId;
}

const TraineeSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    enum: ['Working', 'Available', 'On Break', 'Off Duty'], 
    default: 'Off Duty' 
  },
  departmentId: { type: Schema.Types.ObjectId, ref: 'Department' },
}, { timestamps: true });

export const Trainee: Model<ITrainee> = mongoose.models.Trainee || mongoose.model<ITrainee>('Trainee', TraineeSchema);
