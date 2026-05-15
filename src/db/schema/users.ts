import { pgTable, uuid, timestamp, text, date, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { organizations } from './organizations';

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    password: text('password'),
    organizationId: uuid('organization_id').references(() => organizations.id),
    role: text('role').notNull().default('student'),
    status: text('status').notNull().default('pending'),
    firstName: text('first_name'),
    lastName: text('last_name'),
    email: text('email'),
    phone: text('phone'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const teachers = pgTable('teachers', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id),
    employeeNumber: text('employee_number'),
    specialization: text('specialization'),
    joinDate: date('join_date'),
    metadata: jsonb('metadata'),
});

export const students = pgTable('students', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id),
    studentNumber: text('student_number'),
    admissionDate: date('admission_date'),
    dateOfBirth: date('date_of_birth'),
    guardianId: uuid('guardian_id').references(() => users.id),
    metadata: jsonb('metadata'),
});

// Relations
export const usersRelations = relations(users, ({ one }) => ({
    organization: one(organizations, {
        fields: [users.organizationId],
        references: [organizations.id],
    }),
}));

export const teachersRelations = relations(teachers, ({ one }) => ({
    user: one(users, {
        fields: [teachers.userId],
        references: [users.id],
    }),
}));

export const studentsRelations = relations(students, ({ one }) => ({
    user: one(users, {
        fields: [students.userId],
        references: [users.id],
    }),
    guardian: one(users, {
        fields: [students.guardianId],
        references: [users.id],
    }),
}));

export type User = typeof users.$inferSelect;
export type Teacher = typeof teachers.$inferSelect;
export type Student = typeof students.$inferSelect;
