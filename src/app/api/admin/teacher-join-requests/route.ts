import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { teacherJoinRequests, users } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';

// GET /api/admin/teacher-join-requests
// Returns pending teacher join requests for the admin's organization
export async function GET(req: NextRequest) {
    try {
        const { userId, orgId } = await getAuth();
        if (!userId || !orgId) return new NextResponse('Unauthorized', { status: 401 });

        const requests = await db
            .select({
                id: teacherJoinRequests.id,
                teacherName: users.firstName,
                teacherLastName: users.lastName,
                teacherEmail: users.email,
                teacherPhone: users.phone,
                message: teacherJoinRequests.message,
                status: teacherJoinRequests.status,
                createdAt: teacherJoinRequests.createdAt,
            })
            .from(teacherJoinRequests)
            .innerJoin(users, eq(teacherJoinRequests.teacherUserId, users.id))
            .where(
                and(
                    eq(teacherJoinRequests.organizationId, orgId),
                    eq(teacherJoinRequests.status, 'pending')
                )
            )
            .orderBy(desc(teacherJoinRequests.createdAt));

        return NextResponse.json({ requests, total: requests.length });

    } catch (error) {
        console.error('[ADMIN_TEACHER_JOIN_REQUESTS_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
