import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivityLog extends Document {
  entityId: mongoose.Types.ObjectId;
  entityModel: 'User' | 'Trainee' | 'Department' | 'Assignment' | 'Shift';
  action: string;
  description: string;
}

const ActivityLogSchema: Schema = new Schema({
  entityId: { type: Schema.Types.ObjectId, required: true, refPath: 'entityModel' },
  entityModel: { type: String, required: true, enum: ['User', 'Trainee', 'Department', 'Assignment', 'Shift'] },
  action: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

export const ActivityLog: Model<IActivityLog> = mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
