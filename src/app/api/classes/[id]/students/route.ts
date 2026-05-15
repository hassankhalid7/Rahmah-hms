import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { classes, classEnrollments, students, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';

// GET /api/classes/[id]/students — enrolled students in a class
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: classId } = await params;
        const { orgId } = await getAuth();
        if (!orgId) return new NextResponse('Unauthorized', { status: 401 });

        const rows = await db
            .select({
                studentId: students.id,
                userId:    users.id,
                firstName: users.firstName,
                lastName:  users.lastName,
            })
            .from(classEnrollments)
            .innerJoin(students, eq(classEnrollments.studentId, students.id))
            .innerJoin(users,    eq(students.userId, users.id))
            .where(
                and(
                    eq(classEnrollments.classId, classId),
                    eq(classEnrollments.status, 'active')
                )
            );

        return NextResponse.json(
            rows.map(r => ({
                id:   r.studentId,
                userId: r.userId,
                name: `${r.firstName || ''} ${r.lastName || ''}`.trim(),
            }))
        );
    } catch (error) {
        console.error('[CLASS_STUDENTS_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
