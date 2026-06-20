import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { organizations } from './organizations';

export const teacherJoinRequests = pgTable('teacher_join_requests', {
    id: uuid('id').defaultRandom().primaryKey(),
    teacherUserId: uuid('teacher_user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    message: text('message'),
    status: text('status').notNull().default('pending'), // 'pending' | 'approved' | 'rejected'
    reviewedBy: uuid('reviewed_by').references(() => users.id),
    reviewedAt: timestamp('reviewed_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const teacherJoinRequestsRelations = relations(teacherJoinRequests, ({ one }) => ({
    teacher: one(users, {
        fields: [teacherJoinRequests.teacherUserId],
        references: [users.id],
        relationName: 'teacher_join_requests',
    }),
    organization: one(organizations, {
        fields: [teacherJoinRequests.organizationId],
        references: [organizations.id],
        relationName: 'teacher_join_org',
    }),
    reviewer: one(users, {
        fields: [teacherJoinRequests.reviewedBy],
        references: [users.id],
        relationName: 'teacher_join_reviewer',
    }),
}));

export type TeacherJoinRequest = typeof teacherJoinRequests.$inferSelect;
export type NewTeacherJoinRequest = typeof teacherJoinRequests.$inferInsert;
