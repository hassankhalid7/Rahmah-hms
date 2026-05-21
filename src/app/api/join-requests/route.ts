import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { joinRequests, users, organizations } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';
import { isDemoMode } from '@/lib/auth-constants';
import { getMockJoinRequests } from '@/lib/mock-db';

// GET - Get join requests for admin dashboard
export async function GET(req: NextRequest) {
    try {
        const { userId, orgId } = await getAuth();

        if (!userId || !orgId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Get pending join requests for this organization
        const requests = await db
            .select({
                id: joinRequests.id,
                studentName: users.firstName,
                studentLastName: users.lastName,
                studentEmail: users.email,
                studentPhone: users.phone,
                message: joinRequests.message,
                status: joinRequests.status,
                createdAt: joinRequests.createdAt,
            })
            .from(joinRequests)
            .innerJoin(users, eq(joinRequests.studentUserId, users.id))
            .where(
                and(
                    eq(joinRequests.organizationId, orgId),
                    eq(joinRequests.status, 'pending')
                )
            )
            .orderBy(desc(joinRequests.createdAt));

        return NextResponse.json({
            requests,
            total: requests.length
        });

    } catch (error) {
        console.error('[JOIN_REQUESTS_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

// POST - Create new join request (from student)
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { organizationId, message } = body;

        const { userId } = await getAuth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!organizationId) {
            return new NextResponse('Organization ID is required', { status: 400 });
        }

        // Check if user already has a pending request for this organization
        const existingRequest = await db
            .select()
            .from(joinRequests)
            .where(
                and(
                    eq(joinRequests.studentUserId, userId),
                    eq(joinRequests.organizationId, organizationId)
                )
            )
            .limit(1);

        if (existingRequest.length > 0) {
            const status = existingRequest[0].status;
            if (status === 'pending') {
                return new NextResponse('You already have a pending request for this organization', { status: 400 });
            } else if (status === 'approved') {
                return new NextResponse('You are already a member of this organization', { status: 400 });
            }
        }

        // Create new join request
        const [newRequest] = await db
            .insert(joinRequests)
            .values({
                studentUserId: userId,
                organizationId,
                message: message || null,
                status: 'pending'
            })
            .returning();

        return NextResponse.json({
            success: true,
            requestId: newRequest.id,
            message: 'Join request sent successfully! The admin will review your request.'
        });

    } catch (error) {
        console.error('[JOIN_REQUESTS_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}