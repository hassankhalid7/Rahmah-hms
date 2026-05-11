import { pgTable, uuid, varchar, timestamp, text, pgEnum, date, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { organizations } from './organizations';

export const userRoleEnum = pgEnum('user_role', ['super_admin', 'institute_admin', 'teacher', 'student', 'parent']);
export const userStatusEnum = pgEnum('user_status', ['active', 'inactive', 'pending']);

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    password: text('password'), // Store hashed password for custom auth
    organizationId: uuid('organization_id').references(() => organizations.id),
    role: userRoleEnum('role').notNull().default('student'),
    status: userStatusEnum('status').notNull().default('pending'),
    firstName: varchar('first_name', { length: 100 }),
    lastName: varchar('last_name', { length: 100 }),
    email: varchar('email', { length: 255 }),
    phone: varchar('phone', { length: 50 }),
    avatarUrl: text('avatar_url'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const teachers = pgTable('teachers', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id),
    employeeNumber: varchar('employee_number', { length: 50 }),
    specialization: text('specialization'),
    joinDate: date('join_date'),
    metadata: jsonb('metadata'),
});

export const students = pgTable('students', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id),
    studentNumber: varchar('student_number', { length: 50 }),
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
