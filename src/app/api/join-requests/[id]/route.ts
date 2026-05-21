import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { joinRequests, users, students } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';
import { isDemoMode } from '@/lib/auth-constants';
import { updateMockJoinRequest, addMockStudent, getMockJoinRequests } from '@/lib/mock-db';

// PATCH - Approve or reject join request
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: requestId } = await params;
        const { userId, orgId } = await getAuth();
        const body = await req.json();
        const { action } = body; // 'approve' or 'reject'

        if (!userId || !orgId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!action || !['approve', 'reject'].includes(action)) {
            return new NextResponse('Invalid action. Use "approve" or "reject"', { status: 400 });
        }


        // Get the join request
        const [joinRequest] = await db
            .select()
            .from(joinRequests)
            .where(
                and(
                    eq(joinRequests.id, requestId),
                    eq(joinRequests.organizationId, orgId),
                    eq(joinRequests.status, 'pending')
                )
            )
            .limit(1);

        if (!joinRequest) {
            return new NextResponse('Join request not found or already processed', { status: 404 });
        }

        const newStatus = action === 'approve' ? 'approved' : 'rejected';

        // Update join request status
        await db
            .update(joinRequests)
            .set({
                status: newStatus,
                reviewedBy: userId,
                reviewedAt: new Date(),
                updatedAt: new Date()
            })
            .where(eq(joinRequests.id, requestId));

        // If approved, create student record and update user organization
        if (action === 'approve') {
            // Update user's organization
            await db
                .update(users)
                .set({
                    organizationId: joinRequest.organizationId,
                    status: 'active',
                    updatedAt: new Date()
                })
                .where(eq(users.id, joinRequest.studentUserId));

            // Create student record
            await db
                .insert(students)
                .values({
                    userId: joinRequest.studentUserId,
                    organizationId: joinRequest.organizationId,
                    admissionDate: new Date().toISOString().split('T')[0], // Today's date
                    studentNumber: `STU-${Date.now().toString().slice(-6)}`,
                });
        }

        return NextResponse.json({
            success: true,
            message: `Join request ${action}d successfully${action === 'approve' ? '. Student has been added to your organization.' : '.'}`
        });

    } catch (error) {
        console.error('[JOIN_REQUEST_PATCH]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}