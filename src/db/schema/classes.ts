import { pgTable, uuid, text, timestamp, date, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { organizations } from './organizations';
import { teachers, students } from './users';

export const classes = pgTable('classes', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id),
    name: text('name').notNull(),
    description: text('description'),
    teacherId: uuid('teacher_id').references(() => teachers.id),
    schedule: jsonb('schedule'),
    startDate: date('start_date'),
    endDate: date('end_date'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const classEnrollments = pgTable('class_enrollments', {
    id: uuid('id').defaultRandom().primaryKey(),
    classId: uuid('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
    studentId: uuid('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
    enrollmentDate: timestamp('enrollment_date').defaultNow().notNull(),
    status: text('status').default('active'),
});

// Relations
export const classesRelations = relations(classes, ({ one, many }) => ({
    organization: one(organizations, {
        fields: [classes.organizationId],
        references: [organizations.id],
    }),
    teacher: one(teachers, {
        fields: [classes.teacherId],
        references: [teachers.id],
    }),
    enrollments: many(classEnrollments),
}));

export const classEnrollmentsRelations = relations(classEnrollments, ({ one }) => ({
    class: one(classes, {
        fields: [classEnrollments.classId],
        references: [classes.id],
    }),
    student: one(students, {
        fields: [classEnrollments.studentId],
        references: [students.id],
    }),
}));

export type Class = typeof classes.$inferSelect;
export type ClassEnrollment = typeof classEnrollments.$inferSelect;
