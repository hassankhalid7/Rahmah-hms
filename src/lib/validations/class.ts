import { z } from 'zod';

export const classSchema = z.object({
    name: z.string().min(3, "Class name is too short"),
    description: z.string().optional(),
    teacherId: z.string().uuid("Invalid teacher ID").optional().or(z.literal('')),
    startDate: z.string().optional(), // YYYY-MM-DD
    endDate: z.string().optional(),
    schedule: z.array(z.object({
        day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
        startTime: z.string(), // HH:mm
        endTime: z.string(),
    })).optional(),
});

export const enrollmentSchema = z.object({
    studentId: z.string().uuid("Invalid student ID"),
    enrollmentDate: z.string().optional(),
});

export type ClassFormValues = z.infer<typeof classSchema>;
export type EnrollmentFormValues = z.infer<typeof enrollmentSchema>;
