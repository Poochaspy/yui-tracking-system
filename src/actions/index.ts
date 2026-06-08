'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/mongodb';
import { Department } from '@/models/Department';
import { User } from '@/models/User';
import { Trainee } from '@/models/Trainee';
import { Assignment } from '@/models/Assignment';
import { Shift } from '@/models/Shift';
import { ShiftAssignment } from '@/models/ShiftAssignment';
import { Attendance } from '@/models/Attendance';
import { ActivityLog } from '@/models/ActivityLog';

async function logActivity(entityId: string, entityModel: string, action: string, description: string) {
  try {
    await ActivityLog.create({ entityId, entityModel, action, description });
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
}

export async function createDepartment(formData: FormData) {
  try {
    await dbConnect();
    
    const name = formData.get('name') as string;
    const capacity = parseInt(formData.get('capacity') as string, 10);
    const description = formData.get('description') as string;

    await Department.create({ name, capacity, description });
    
    revalidatePath('/departments');
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || 'Failed to create department' };
  }
}

export async function createEmployee(formData: FormData) {
  try {
    await dbConnect();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const departmentId = formData.get('departmentId') as string;

    const data: any = { name, email };
    if (departmentId) data.departmentId = departmentId;

    await User.create(data);
    
    revalidatePath('/employees');
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || 'Failed to create employee' };
  }
}

export async function createTrainee(formData: FormData) {
  try {
    await dbConnect();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const departmentId = formData.get('departmentId') as string;

    const data: any = { name, email };
    if (departmentId) data.departmentId = departmentId;

    await Trainee.create(data);
    
    revalidatePath('/trainees');
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || 'Failed to create trainee' };
  }
}

export async function createAssignment(formData: FormData) {
  try {
    await dbConnect();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const personnelData = formData.get('assignedTo') as string; // Format: "Model:ID"
    
    const [assignedModel, assignedTo] = personnelData.split(':');

    await Assignment.create({ title, description, assignedTo, assignedModel, status: 'Pending' });
    await logActivity(assignedTo, assignedModel, 'Task Assigned', `Assigned task: ${title}`);
    
    revalidatePath('/assignments');
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || 'Failed to create assignment' };
  }
}

export async function createShift(formData: FormData) {
  try {
    await dbConnect();
    
    const name = formData.get('name') as string;
    const startTime = formData.get('startTime') as string;
    const endTime = formData.get('endTime') as string;

    await Shift.create({ name, startTime, endTime });
    
    revalidatePath('/shifts');
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || 'Failed to create shift' };
  }
}

export async function createShiftAssignment(formData: FormData) {
  try {
    await dbConnect();
    
    const shiftId = formData.get('shiftId') as string;
    const personnelData = formData.get('personnelId') as string; // Format: "Model:ID"
    const date = formData.get('date') as string;
    
    const [personnelModel, personnelId] = personnelData.split(':');

    await ShiftAssignment.create({ shiftId, personnelId, personnelModel, date });
    await logActivity(personnelId, personnelModel, 'Shift Assigned', `Assigned to shift on ${date}`);
    
    revalidatePath('/shifts');
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || 'Failed to assign shift' };
  }
}

export async function checkIn(personnelId: string, personnelModel: 'User' | 'Trainee') {
  try {
    await dbConnect();
    const date = new Date().toISOString().split('T')[0];
    
    const existing = await Attendance.findOne({ personnelId, date });
    if (existing) {
      return { success: false, error: 'Already checked in today' };
    }

    await Attendance.create({
      personnelId,
      personnelModel,
      date,
      checkInTime: new Date()
    });
    await logActivity(personnelId, personnelModel, 'Clock In', 'Clocked in for the day');
    
    revalidatePath('/attendance');
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || 'Failed to check in' };
  }
}

export async function updateStatus(personnelId: string, modelType: 'User' | 'Trainee', newStatus: string) {
  try {
    await dbConnect();
    const Model = modelType === 'User' ? User : Trainee;
    const personnel = await Model.findByIdAndUpdate(personnelId, { status: newStatus }, { new: true });
    
    if (personnel) {
      await logActivity(personnelId, modelType, 'Status Changed', `Status updated to '${newStatus}'`);
    }

    revalidatePath('/employees');
    revalidatePath('/trainees');
    revalidatePath('/logs');
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || 'Failed to update status' };
  }
}

export async function updateAssignmentStatus(assignmentId: string, newStatus: string) {
  try {
    await dbConnect();
    const assignment = await Assignment.findByIdAndUpdate(assignmentId, { status: newStatus }, { new: true });
    
    if (assignment) {
      await logActivity(assignment.assignedTo.toString(), assignment.assignedModel, 'Task Updated', `Task '${assignment.title}' marked as ${newStatus}`);
    }

    revalidatePath('/assignments');
    revalidatePath('/logs');
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || 'Failed to update task status' };
  }
}
