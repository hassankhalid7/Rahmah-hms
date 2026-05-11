import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { classEnrollments, classes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';
import { enrollmentSchema } from '@/lib/validations/class';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: classId } = await params;
        const { orgId } = await getAuth();

        if (!orgId) return new NextResponse('Unauthorized', { status: 401 });

        const body = await req.json();
        const validation = enrollmentSchema.safeParse(body);

        if (!validation.success) {
            return new NextResponse(validation.error.message, { status: 400 });
        }

        const { studentId, enrollmentDate } = validation.data;

        // Check if class belongs to org
        const classExists = await db.query.classes.findFirst({
            where: and(eq(classes.id, classId), eq(classes.organizationId, orgId))
        });

        if (!classExists) {
            return new NextResponse('Class not found', { status: 404 });
        }

        // Check if already enrolled
        const existing = await db.query.classEnrollments.findFirst({
            where: and(
                eq(classEnrollments.classId, classId),
                eq(classEnrollments.studentId, studentId)
            )
        });

        if (existing) {
            return new NextResponse('Student already enrolled', { status: 400 });
        }

        await db.insert(classEnrollments).values({
            classId,
            studentId,
            enrollmentDate: enrollmentDate ? new Date(enrollmentDate) : new Date(),
            status: 'active'
        });

        return new NextResponse('Enrolled', { status: 200 });

    } catch (error) {
        console.error('[CLASS_ENROLL]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    // Note: Deleting enrollment needs studentId. 
    // Usually DELETE body is not standard, so we might need a query param or a different route param.
    // Let's assume the route is /api/classes/[id]/enroll?studentId=...
    try {
        const { id: classId } = await params;
        const { orgId } = await getAuth();

        if (!orgId) return new NextResponse('Unauthorized', { status: 401 });

        const searchParams = req.nextUrl.searchParams;
        const studentId = searchParams.get('studentId');

        if (!studentId) {
            return new NextResponse('Student ID required', { status: 400 });
        }

        await db.delete(classEnrollments)
            .where(and(
                eq(classEnrollments.classId, classId),
                eq(classEnrollments.studentId, studentId)
            ));

        return new NextResponse('Unenrolled', { status: 200 });

    } catch (error) {
        console.error('[CLASS_UNENROLL]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
