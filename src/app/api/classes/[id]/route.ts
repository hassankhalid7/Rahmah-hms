import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { classes, classEnrollments, students, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';
import { classSchema } from '@/lib/validations/class';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { orgId } = await getAuth();

        if (!orgId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const classData = await db.query.classes.findFirst({
            where: and(eq(classes.id, id), eq(classes.organizationId, orgId)),
            with: {
                teacher: {
                    with: { user: true }
                },
                enrollments: {
                    with: {
                        student: {
                            with: { user: true }
                        }
                    }
                }
            }
        });

        if (!classData) {
            return new NextResponse('Class not found', { status: 404 });
        }

        return NextResponse.json(classData);

    } catch (error) {
        console.error('[CLASS_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { orgId } = await getAuth();

        if (!orgId) return new NextResponse('Unauthorized', { status: 401 });

        const body = await req.json();
        const validation = classSchema.partial().safeParse(body);

        if (!validation.success) {
            return new NextResponse(validation.error.message, { status: 400 });
        }

        const { name, description, teacherId, startDate, endDate, schedule } = validation.data;

        await db.update(classes)
            .set({
                name, description, teacherId: teacherId || null,
                startDate, endDate, schedule,
                updatedAt: new Date()
            })
            .where(and(eq(classes.id, id), eq(classes.organizationId, orgId)));

        return new NextResponse('Updated', { status: 200 });

    } catch (error) {
        console.error('[CLASS_PATCH]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { orgId } = await getAuth();

        if (!orgId) return new NextResponse('Unauthorized', { status: 401 });

        await db.delete(classes)
            .where(and(eq(classes.id, id), eq(classes.organizationId, orgId)));

        return new NextResponse('Deleted', { status: 200 });

    } catch (error) {
        console.error('[CLASS_DELETE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
