import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAttendance extends Document {
  personnelId: mongoose.Types.ObjectId;
  personnelModel: 'User' | 'Trainee';
  date: string; // YYYY-MM-DD format
  checkInTime: Date;
  checkOutTime?: Date;
}

const AttendanceSchema: Schema = new Schema({
  personnelId: { type: Schema.Types.ObjectId, required: true, refPath: 'personnelModel' },
  personnelModel: { type: String, required: true, enum: ['User', 'Trainee'] },
  date: { type: String, required: true },
  checkInTime: { type: Date, required: true },
  checkOutTime: { type: Date },
}, { timestamps: true });

export const Attendance: Model<IAttendance> = mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema);
