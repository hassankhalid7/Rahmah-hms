import { pgTable, uuid, text, integer, timestamp, date, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { students, teachers, users } from './users';
import { organizations } from './organizations';

export const dailyProgress = pgTable('daily_progress', {
    id: uuid('id').defaultRandom().primaryKey(),
    studentId: uuid('student_id').notNull().references(() => students.id),
    teacherId: uuid('teacher_id').notNull().references(() => teachers.id),
    date: date('date').notNull(),
    learningType: text('learning_type').notNull(),
    attendanceStatus: text('attendance_status').notNull(),
    teacherRemarks: text('teacher_remarks'),
    qaidaLessonNumber: integer('qaida_lesson_number'),
    qaidaPageNumber: integer('qaida_page_number'),
    qaidaTopic: text('qaida_topic'),
    qaidaMistakesCount: integer('qaida_mistakes_count'),
    nazraParaNumber: integer('nazra_para_number'),
    nazraFromAyah: text('nazra_from_ayah'),
    nazraToAyah: text('nazra_to_ayah'),
    nazraMistakesCount: integer('nazra_mistakes_count'),
    hifzSabaq: text('hifz_sabaq'),
    hifzSabqi: text('hifz_sabqi'),
    hifzManzil: text('hifz_manzil'),
    hifzAyatMistakes: jsonb('hifz_ayat_mistakes').$type<Array<{ ayah: string; mistakes: number }>>(),
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
