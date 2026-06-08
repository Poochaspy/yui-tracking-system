import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAssignment extends Document {
  title: string;
  description: string;
  assignedTo: mongoose.Types.ObjectId;
  assignedModel: 'User' | 'Trainee';
  status: 'Pending' | 'In Progress' | 'Completed';
}

const AssignmentSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  assignedTo: { type: Schema.Types.ObjectId, required: true, refPath: 'assignedModel' },
  assignedModel: { type: String, required: true, enum: ['User', 'Trainee'] },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
}, { timestamps: true });

export const Assignment: Model<IAssignment> = mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', AssignmentSchema);
