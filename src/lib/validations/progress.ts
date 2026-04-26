import { z } from 'zod';

// Enums
export const learningTypeSchema = z.enum(['qaida', 'nazra', 'hifz']);
export const attendanceStatusSchema = z.enum(['present', 'absent', 'late', 'excused']);

// Ayah reference validation (format: "Surah:Ayah" e.g., "2:255")
const ayahReferenceSchema = z.string().regex(
    /^\d{1,3}:\d{1,3}$/,
    'Ayah reference must be in format "Surah:Ayah" (e.g., "2:255")'
);

// Base progress schema
const baseProgressSchema = z.object({
    studentId: z.string().uuid('Invalid student ID'),
    date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    attendanceStatus: attendanceStatusSchema,
    teacherRemarks: z.string().max(1000).optional(),
});

// Qaida progress schema
export const qaidaProgressSchema = baseProgressSchema.extend({
    learningType: z.literal('qaida'),
    qaidaLessonNumber: z.number().int().positive('Lesson number must be positive'),
    qaidaPageNumber: z.number().int().positive('Page number must be positive'),
    qaidaTopic: z.string().min(1, 'Topic is required').max(100),
    qaidaMistakesCount: z.number().int().min(0, 'Mistakes count cannot be negative'),
});

// Nazra progress schema
export const nazraProgressSchema = baseProgressSchema.extend({
    learningType: z.literal('nazra'),
    nazraParaNumber: z.number().int().min(1).max(30, 'Para number must be between 1 and 30'),
    nazraFromAyah: ayahReferenceSchema,
    nazraToAyah: ayahReferenceSchema,
    nazraMistakesCount: z.number().int().min(0, 'Mistakes count cannot be negative'),
});

// Hifz ayat mistake schema
const hifzAyatMistakeSchema = z.object({
    ayah: ayahReferenceSchema,
    mistakes: z.number().int().min(0, 'Mistakes count cannot be negative'),
});

// Hifz progress schema
export const hifzProgressSchema = baseProgressSchema.extend({
    learningType: z.literal('hifz'),
    hifzSabaq: z.string().min(1, 'Sabaq is required').max(100),
    hifzSabqi: z.string().min(1, 'Sabqi is required').max(100),
    hifzManzil: z.string().min(1, 'Manzil is required').max(100),
    hifzAyatMistakes: z.array(hifzAyatMistakeSchema).min(1, 'At least one ayat mistake entry is required'),
});

// Discriminated union for create/update
export const createProgressSchema = z.discriminatedUnion('learningType', [
    qaidaProgressSchema,
    nazraProgressSchema,
    hifzProgressSchema,
]);

// Update schema (partial)
export const updateProgressSchema = z.discriminatedUnion('learningType', [
    qaidaProgressSchema.partial().required({ learningType: true }),
    nazraProgressSchema.partial().required({ learningType: true }),
    hifzProgressSchema.partial().required({ learningType: true }),
]);

// Query parameters schema
export const progressListQuerySchema = z.object({
    studentId: z.string().uuid().optional(),
    teacherId: z.string().uuid().optional(),
    dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    learningType: learningTypeSchema.optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});

// Type exports
export type CreateProgressInput = z.infer<typeof createProgressSchema>;
export type UpdateProgressInput = z.infer<typeof updateProgressSchema>;
export type ProgressListQuery = z.infer<typeof progressListQuerySchema>;
