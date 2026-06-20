import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { teacherJoinRequests, users, teachers } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';

// PATCH /api/teacher-join-requests/[id]
// Admin approves or rejects a teacher's join request
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: requestId } = await params;
        const { userId, orgId } = await getAuth();

        if (!userId || !orgId) return new NextResponse('Unauthorized', { status: 401 });

        const body = await req.json();
        const { action } = body; // 'approve' | 'reject'

        if (!action || !['approve', 'reject'].includes(action)) {
            return NextResponse.json({ message: 'Invalid action. Use "approve" or "reject".' }, { status: 400 });
        }

        // Fetch the request — must belong to admin's org and still be pending
        const [joinRequest] = await db
            .select()
            .from(teacherJoinRequests)
            .where(
                and(
                    eq(teacherJoinRequests.id, requestId),
                    eq(teacherJoinRequests.organizationId, orgId),
                    eq(teacherJoinRequests.status, 'pending')
                )
            )
            .limit(1);

        if (!joinRequest) {
            return new NextResponse('Request not found or already processed.', { status: 404 });
        }

        const newStatus = action === 'approve' ? 'approved' : 'rejected';

        // Update request status
        await db
            .update(teacherJoinRequests)
            .set({ status: newStatus, reviewedBy: userId, reviewedAt: new Date(), updatedAt: new Date() })
            .where(eq(teacherJoinRequests.id, requestId));

        if (action === 'approve') {
            // Link teacher user to the organization and activate account
            await db
                .update(users)
                .set({ organizationId: joinRequest.organizationId, status: 'active', updatedAt: new Date() })
                .where(eq(users.id, joinRequest.teacherUserId));

            // Check if a teachers record already exists for this user (shouldn't, but be safe)
            const [existing] = await db
                .select({ id: teachers.id })
                .from(teachers)
                .where(eq(teachers.userId, joinRequest.teacherUserId))
                .limit(1);

            if (!existing) {
                await db.insert(teachers).values({
                    userId: joinRequest.teacherUserId,
                    organizationId: joinRequest.organizationId,
                    joinDate: new Date().toISOString().split('T')[0],
                });
            }
        }

        return NextResponse.json({
            success: true,
            message: `Teacher request ${action}d successfully.${action === 'approve' ? ' Teacher has been linked to your madrassa.' : ''}`,
        });

    } catch (error) {
        console.error('[TEACHER_JOIN_REQUEST_PATCH]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
