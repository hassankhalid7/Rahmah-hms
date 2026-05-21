import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { joinRequests, users } from '@/db/schema';
import { isDemoMode } from '@/lib/auth-constants';
import { addMockJoinRequest } from '@/lib/mock-db';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { organizationId, fullName, phone, email, message } = body;

        if (!organizationId || !fullName || !phone) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        // Create student user first (minimal profile)
        const [newUser] = await db.insert(users).values({
            firstName: fullName.split(' ')[0],
            lastName: fullName.split(' ').slice(1).join(' ') || '',
            email: email || null,
            phone: phone,
            role: 'student',
            status: 'pending',
            organizationId: organizationId,
        }).returning();

        // Create join request
        const [newRequest] = await db.insert(joinRequests).values({
            studentUserId: newUser.id,
            organizationId: organizationId,
            message: message || null,
            status: 'pending'
        }).returning();

        return NextResponse.json({
            success: true,
            message: 'Join request sent successfully!',
            request: newRequest
        });

    } catch (error) {
        console.error('[PUBLIC_JOIN_REQUEST_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
