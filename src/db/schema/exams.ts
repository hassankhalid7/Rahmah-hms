import { pgTable, uuid, varchar, text, integer, decimal, timestamp, date, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { organizations } from './organizations';
import { students, teachers, users } from './users';

export const exams = pgTable('exams', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id),
    name: varchar('name', { length: 255 }).notNull(),
    examType: varchar('exam_type', { length: 100 }), // Weekly, Monthly, Final, Jalsa, etc.
    syllabus: text('syllabus'),
    date: date('date'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const examResults = pgTable('exam_results', {
    id: uuid('id').defaultRandom().primaryKey(),
    examId: uuid('exam_id').notNull().references(() => exams.id, { onDelete: 'cascade' }),
    studentId: uuid('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
    examinerId: uuid('examiner_id').references(() => teachers.id),
    marks: decimal('marks', { precision: 5, scale: 2 }),
    rating: varchar('rating', { length: 50 }), // Mumtaz, Jayyid, etc.
    mistakesCount: integer('mistakes_count'),
    pausesCount: integer('pauses_count'),
    remarks: text('remarks'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const examsRelations = relations(exams, ({ many }) => ({
    results: many(examResults),
}));

export const examResultsRelations = relations(examResults, ({ one }) => ({
    exam: one(exams, {
        fields: [examResults.examId],
        references: [exams.id],
    }),
    student: one(students, {
        fields: [examResults.studentId],
        references: [students.id],
    }),
    examiner: one(teachers, {
        fields: [examResults.examinerId],
        references: [teachers.id],
    }),
}));

export type Exam = typeof exams.$inferSelect;
export type ExamResult = typeof examResults.$inferSelect;
