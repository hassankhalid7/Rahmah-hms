import { z } from 'zod';

export const staffSchema = z.object({
    firstName: z.string().min(2, "First name is too short"),
    lastName: z.string().min(2, "Last name is too short"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number is too short"),
    role: z.enum(['teacher', 'institute_admin', 'super_admin']),
    // Teacher specific fields
    specialization: z.string().optional(),
    joiningDate: z.string().optional(),
    employeeNumber: z.string().optional(),
    gender: z.enum(['male', 'female']),
});

export type StaffFormValues = z.infer<typeof staffSchema>;
