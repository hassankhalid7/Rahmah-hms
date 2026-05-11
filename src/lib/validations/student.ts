import { z } from "zod";

export const studentSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    phone: z.string().optional(),
    dateOfBirth: z.string().optional(), // YYYY-MM-DD
    gender: z.enum(["Male", "Female"]),
    guardianFirstName: z.string().min(2, "Guardian first name is required"),
    guardianLastName: z.string().min(2, "Guardian last name is required"),
    guardianRelation: z.string().min(2, "Relation is required"),
    guardianPhone: z.string().min(10, "Valid phone number is required"),
    guardianEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
    assignedClass: z.string().optional(),
    admissionDate: z.string().optional(),
    address: z.string().optional(),
});

export type StudentFormValues = z.infer<typeof studentSchema>;
