import { pgTable, uuid, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { organizations } from './organizations';

export const joinRequestStatusEnum = pgEnum('join_request_status', ['pending', 'approved', 'rejected']);

export const joinRequests = pgTable('join_requests', {
    id: uuid('id').defaultRandom().primaryKey(),
    studentUserId: uuid('student_user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    message: text('message'), // Optional message from student
    status: joinRequestStatusEnum('status').default('pending').notNull(),
    reviewedBy: uuid('reviewed_by').references(() => users.id), // Admin who reviewed
    reviewedAt: timestamp('reviewed_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    // Unique constraint to prevent duplicate requests
    studentOrganizationUnique: {
        columns: [table.studentUserId, table.organizationId],
        name: 'join_requests_student_organization_unique'
    }
}));

// Relations
export const joinRequestsRelations = relations(joinRequests, ({ one }) => ({
    student: one(users, {
        fields: [joinRequests.studentUserId],
        references: [users.id],
        relationName: 'student_join_requests'
    }),
    organization: one(organizations, {
        fields: [joinRequests.organizationId],
        references: [organizations.id],
        relationName: 'organization_join_requests'
    }),
    reviewer: one(users, {
        fields: [joinRequests.reviewedBy],
        references: [users.id],
        relationName: 'reviewer_join_requests'
    }),
}));

export type JoinRequest = typeof joinRequests.$inferSelect;
export type NewJoinRequest = typeof joinRequests.$inferInsert;