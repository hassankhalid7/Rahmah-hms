import { pgTable, unique, uuid, text, jsonb, timestamp, varchar } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const organizations = pgTable("organizations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	logoUrl: text("logo_url"),
	address: text(),
	phone: text(),
	email: text(),
	metadata: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("organizations_slug_unique").on(table.slug),
]);

export const joinRequests = pgTable("join_requests", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	studentUserId: uuid("student_user_id").notNull(),
	organizationId: uuid("organization_id").notNull(),
	message: text(),
	status: text().default('pending').notNull(),
	reviewedBy: uuid("reviewed_by"),
	reviewedAt: timestamp("reviewed_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const students = pgTable("students", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	organizationId: uuid("organization_id").notNull(),
	studentNumber: text("student_number"),
	admissionDate: text("admission_date"),
	status: text().default('active').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	learningTrack: varchar("learning_track", { length: 50 }),
	currentClassId: uuid("current_class_id"),
});

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text(),
	phone: text(),
	role: text().default('student').notNull(),
	status: text().default('pending').notNull(),
	organizationId: uuid("organization_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	password: text(),
});
