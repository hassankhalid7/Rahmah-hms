import { pgTable, uuid, text, timestamp, integer, numeric } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { organizations } from './organizations';
import { students } from './users';

export const feeStructures = pgTable('fee_structures', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id),
    name: text('name').notNull(),
    description: text('description'),
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    frequency: text('frequency').notNull().default('monthly'), // monthly, yearly, one-time
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const invoices = pgTable('invoices', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id),
    studentId: uuid('student_id').notNull().references(() => students.id),
    feeStructureId: uuid('fee_structure_id').references(() => feeStructures.id),
    invoiceNumber: text('invoice_number').notNull(),
    month: integer('month'),
    year: integer('year'),
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    discountAmount: numeric('discount_amount', { precision: 10, scale: 2 }).default('0'),
    finalAmount: numeric('final_amount', { precision: 10, scale: 2 }).notNull(),
    paidAmount: numeric('paid_amount', { precision: 10, scale: 2 }).default('0'),
    status: text('status').notNull().default('pending'), // pending, partial, paid, overdue
    dueDate: timestamp('due_date'),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const payments = pgTable('payments', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id),
    invoiceId: uuid('invoice_id').notNull().references(() => invoices.id),
    studentId: uuid('student_id').notNull().references(() => students.id),
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    paymentMethod: text('payment_method'), // cash, bank_transfer, online
    paymentDate: timestamp('payment_date').defaultNow().notNull(),
    referenceNumber: text('reference_number'),
    notes: text('notes'),
    receivedBy: uuid('received_by'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const feeStructuresRelations = relations(feeStructures, ({ one, many }) => ({
    organization: one(organizations, {
        fields: [feeStructures.organizationId],
        references: [organizations.id],
    }),
    invoices: many(invoices),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
    organization: one(organizations, {
        fields: [invoices.organizationId],
        references: [organizations.id],
    }),
    student: one(students, {
        fields: [invoices.studentId],
        references: [students.id],
    }),
    feeStructure: one(feeStructures, {
        fields: [invoices.feeStructureId],
        references: [feeStructures.id],
    }),
    payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
    invoice: one(invoices, {
        fields: [payments.invoiceId],
        references: [invoices.id],
    }),
    student: one(students, {
        fields: [payments.studentId],
        references: [students.id],
    }),
}));
