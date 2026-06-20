import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { organizations, teacherJoinRequests, users } from '@/db/schema';
import { eq, and, ilike, desc } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';

// GET /api/teacher-join-requests?status=pending|all
// Used by a teacher to see their own requests
export async function GET(req: NextRequest) {
    try {
        const { userId } = await getAuth();
        if (!userId) return new NextResponse('Unauthorized', { status: 401 });

        const requests = await db
            .select({
                id: teacherJoinRequests.id,
                status: teacherJoinRequests.status,
                message: teacherJoinRequests.message,
                createdAt: teacherJoinRequests.createdAt,
                organizationId: teacherJoinRequests.organizationId,
                organizationName: organizations.name,
                organizationAddress: organizations.address,
            })
            .from(teacherJoinRequests)
            .innerJoin(organizations, eq(teacherJoinRequests.organizationId, organizations.id))
            .where(eq(teacherJoinRequests.teacherUserId, userId))
            .orderBy(desc(teacherJoinRequests.createdAt));

        return NextResponse.json({ requests });
    } catch (error) {
        console.error('[TEACHER_JOIN_REQUESTS_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

// POST /api/teacher-join-requests
// A teacher submits a request to join a madrassa
export async function POST(req: NextRequest) {
    try {
        const { userId } = await getAuth();
        if (!userId) return new NextResponse('Unauthorized', { status: 401 });

        // Ensure the user is actually a teacher
        const [user] = await db.select({ role: users.role }).from(users).where(eq(users.id, userId)).limit(1);
        if (!user || user.role !== 'teacher') {
            return new NextResponse('Only teachers can submit teacher join requests', { status: 403 });
        }

        const body = await req.json();
        const { organizationId, message } = body;

        if (!organizationId) {
            return NextResponse.json({ message: 'organizationId is required' }, { status: 400 });
        }

        // Verify organization exists
        const [org] = await db.select({ id: organizations.id }).from(organizations)
            .where(eq(organizations.id, organizationId)).limit(1);
        if (!org) return NextResponse.json({ message: 'Organization not found' }, { status: 404 });

        // Block duplicate pending/approved requests
        const [existing] = await db.select({ id: teacherJoinRequests.id, status: teacherJoinRequests.status })
            .from(teacherJoinRequests)
            .where(
                and(
                    eq(teacherJoinRequests.teacherUserId, userId),
                    eq(teacherJoinRequests.organizationId, organizationId)
                )
            ).limit(1);

        if (existing) {
            if (existing.status === 'pending') {
                return NextResponse.json({ message: 'You already have a pending request for this madrassa.' }, { status: 409 });
            }
            if (existing.status === 'approved') {
                return NextResponse.json({ message: 'You are already a member of this madrassa.' }, { status: 409 });
            }
        }

        const [newRequest] = await db.insert(teacherJoinRequests).values({
            teacherUserId: userId,
            organizationId,
            message: message || null,
            status: 'pending',
        }).returning();

        return NextResponse.json({ success: true, requestId: newRequest.id }, { status: 201 });

    } catch (error) {
        console.error('[TEACHER_JOIN_REQUESTS_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
