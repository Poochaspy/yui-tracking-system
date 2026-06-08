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
import { TraineeAllocation } from '@/models/TraineeAllocation';

type EntityModel = 'User' | 'Trainee' | 'Department' | 'Assignment' | 'Shift';

async function logActivity(entityId: string, entityModel: EntityModel | string, action: string, description: string) {
  try {
    await ActivityLog.create({ entityId, entityModel: entityModel as EntityModel, action, description });
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

    const newTrainee = await Trainee.create(data);
    
    if (departmentId) {
      await TraineeAllocation.create({ traineeId: newTrainee._id, departmentId, startDate: new Date().toISOString() });
    }
    
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
    
    const [assignedModel, assignedTo] = personnelData.split(':') as ['User' | 'Trainee', string];

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
    
    const [personnelModel, personnelId] = personnelData.split(':') as ['User' | 'Trainee', string];

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
    let personnel;
    if (modelType === 'User') {
      personnel = await User.findByIdAndUpdate(personnelId, { status: newStatus }, { new: true });
    } else {
      personnel = await Trainee.findByIdAndUpdate(personnelId, { status: newStatus }, { new: true });
    }
    
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

// ----------------------------------------------------------------------
// UPDATE & DELETE ACTIONS
// ----------------------------------------------------------------------

export async function updateDepartment(formData: FormData) {
  try {
    await dbConnect();
    const id = formData.get('_id') as string;
    const name = formData.get('name') as string;
    const capacity = parseInt(formData.get('capacity') as string, 10);
    const description = formData.get('description') as string;
    if (!name || capacity < 1) throw new Error('Invalid data');
    await Department.findByIdAndUpdate(id, { name, capacity, description });
    revalidatePath('/departments');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteDepartment(id: string) {
  try {
    await dbConnect();
    const usersCount = await User.countDocuments({ departmentId: id });
    if (usersCount > 0) return { success: false, error: 'Cannot delete: Department has assigned employees.' };
    const traineesCount = await Trainee.countDocuments({ departmentId: id });
    if (traineesCount > 0) return { success: false, error: 'Cannot delete: Department has assigned trainees.' };
    await Department.findByIdAndDelete(id);
    revalidatePath('/departments');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateEmployee(formData: FormData) {
  try {
    await dbConnect();
    const id = formData.get('_id') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const role = formData.get('role') as string;
    const departmentId = formData.get('departmentId') as string;
    const data: any = { name, email, role };
    if (departmentId) data.departmentId = departmentId;
    await User.findByIdAndUpdate(id, data);
    revalidatePath('/employees');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteEmployee(id: string) {
  try {
    await dbConnect();
    await User.findByIdAndDelete(id);
    revalidatePath('/employees');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateTrainee(formData: FormData) {
  try {
    await dbConnect();
    const id = formData.get('_id') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const departmentId = formData.get('departmentId') as string;
    const data: any = { name, email };
    if (departmentId) data.departmentId = departmentId;
    
    const existing = await Trainee.findById(id);
    await Trainee.findByIdAndUpdate(id, data);
    
    if (departmentId && existing?.departmentId?.toString() !== departmentId) {
      await TraineeAllocation.updateMany({ traineeId: id, status: 'Active' }, { status: 'Completed', endDate: new Date().toISOString() });
      await TraineeAllocation.create({ traineeId: id, departmentId, startDate: new Date().toISOString() });
    }
    
    revalidatePath('/trainees');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteTrainee(id: string) {
  try {
    await dbConnect();
    await Trainee.findByIdAndDelete(id);
    revalidatePath('/trainees');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateAssignment(formData: FormData) {
  try {
    await dbConnect();
    const id = formData.get('_id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    await Assignment.findByIdAndUpdate(id, { title, description });
    revalidatePath('/assignments');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteAssignment(id: string) {
  try {
    await dbConnect();
    await Assignment.findByIdAndDelete(id);
    revalidatePath('/assignments');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateShift(formData: FormData) {
  try {
    await dbConnect();
    const id = formData.get('_id') as string;
    const name = formData.get('name') as string;
    const startTime = formData.get('startTime') as string;
    const endTime = formData.get('endTime') as string;
    await Shift.findByIdAndUpdate(id, { name, startTime, endTime });
    revalidatePath('/shifts');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteShift(id: string) {
  try {
    await dbConnect();
    await Shift.findByIdAndDelete(id);
    revalidatePath('/shifts');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
