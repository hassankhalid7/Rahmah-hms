import { pgTable, uuid, varchar, text, integer, timestamp, date, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { students, teachers, users } from './users';
import { organizations } from './organizations';

// Enums
export const learningTypeEnum = pgEnum('learning_type', ['qaida', 'nazra', 'hifz']);
// Note: progressAttendanceStatusEnum is used here to avoid conflict with marking attendance
export const progressAttendanceStatusEnum = pgEnum('progress_attendance_status', ['present', 'absent', 'late', 'excused']);

// Daily Progress Table
export const dailyProgress = pgTable('daily_progress', {
    id: uuid('id').defaultRandom().primaryKey(),
    studentId: uuid('student_id').notNull().references(() => students.id),
    teacherId: uuid('teacher_id').notNull().references(() => teachers.id),
    date: date('date').notNull(),
    learningType: learningTypeEnum('learning_type').notNull(),
    attendanceStatus: progressAttendanceStatusEnum('attendance_status').notNull(),
    teacherRemarks: text('teacher_remarks'),

    // Qaida-specific fields
    qaidaLessonNumber: integer('qaida_lesson_number'),
    qaidaPageNumber: integer('qaida_page_number'),
    qaidaTopic: varchar('qaida_topic', { length: 100 }),
    qaidaMistakesCount: integer('qaida_mistakes_count'),

    // Nazra-specific fields
    nazraParaNumber: integer('nazra_para_number'),
    nazraFromAyah: varchar('nazra_from_ayah', { length: 20 }),
    nazraToAyah: varchar('nazra_to_ayah', { length: 20 }),
    nazraMistakesCount: integer('nazra_mistakes_count'),

    // Hifz-specific fields
    hifzSabaq: varchar('hifz_sabaq', { length: 100 }),
    hifzSabqi: varchar('hifz_sabqi', { length: 100 }),
    hifzManzil: varchar('hifz_manzil', { length: 100 }),
    hifzAyatMistakes: jsonb('hifz_ayat_mistakes').$type<Array<{ ayah: string; mistakes: number }>>(),

    // Metadata
    tenantId: uuid('tenant_id').notNull().references(() => organizations.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Progress Edit History Table
export const progressEditHistory = pgTable('progress_edit_history', {
    id: uuid('id').defaultRandom().primaryKey(),
    progressId: uuid('progress_id').notNull().references(() => dailyProgress.id, { onDelete: 'cascade' }),
    editedBy: uuid('edited_by').notNull().references(() => users.id),
    editedAt: timestamp('edited_at').defaultNow().notNull(),
    previousState: jsonb('previous_state').notNull(),
    changesSummary: text('changes_summary'),
});

// Relations
export const dailyProgressRelations = relations(dailyProgress, ({ many }) => ({
    editHistory: many(progressEditHistory),
}));

export const progressEditHistoryRelations = relations(progressEditHistory, ({ one }) => ({
    progress: one(dailyProgress, {
        fields: [progressEditHistory.progressId],
        references: [dailyProgress.id],
    }),
}));

// Types
export type DailyProgress = typeof dailyProgress.$inferSelect;
export type NewDailyProgress = typeof dailyProgress.$inferInsert;
export type ProgressEditHistory = typeof progressEditHistory.$inferSelect;
export type NewProgressEditHistory = typeof progressEditHistory.$inferInsert;
