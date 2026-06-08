'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/mongodb';
import { Department } from '@/models/Department';
import { User } from '@/models/User';
import { Trainee } from '@/models/Trainee';

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
