import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { students, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { orgId } = await getAuth();

        if (!orgId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Fetch student with user and guardian details
        const student = await db.query.students.findFirst({
            where: and(
                eq(students.id, id),
                eq(students.organizationId, orgId)
            ),
            with: {
                user: true,
                guardian: true,
            }
        });

        if (!student) {
            return new NextResponse('Student not found', { status: 404 });
        }

        return NextResponse.json(student);

    } catch (error) {
        console.error('[STUDENT_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { orgId } = await getAuth();

        if (!orgId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Check if exists
        const student = await db.query.students.findFirst({
            where: and(
                eq(students.id, id),
                eq(students.organizationId, orgId)
            ),
        });

        if (!student) {
            return new NextResponse('Student not found', { status: 404 });
        }

        // Delete student record (cascade should handle related? No, manual deletion often safer)
        // users table has cascade for students.userId -> users.id? 
        // Schema: students.userId references users.id { onDelete: 'cascade' }
        // So deleting USER should delete student.
        // But we have student ID here. We need to get userId.

        // Wait, schema: students.userId references users.id with cascade DELETE on user?
        // "userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),"
        // This means if USER is deleted, STUDENT is deleted.
        // So we should delete the USER record associated with this student.

        await db.delete(users).where(eq(users.id, student.userId));

        return new NextResponse('Deleted', { status: 200 });

    } catch (error) {
        console.error('[STUDENT_DELETE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
