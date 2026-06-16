import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { organizations, users, joinRequests } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { isDemoMode } from '@/lib/auth-constants';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { organizationId, fullName, phone, email, message } = body;

        if (isDemoMode) {
            return NextResponse.json({
                success: true,
                message: 'Demo mode - Join request simulated successfully'
            });
        }

        if (!organizationId || !fullName || !phone) {
            return new NextResponse('Organization ID, name, and phone are required', { status: 400 });
        }

        // Verify organization exists
        const [organization] = await db
            .select()
            .from(organizations)
            .where(eq(organizations.id, organizationId))
            .limit(1);

        if (!organization) {
            return new NextResponse('Organization not found', { status: 404 });
        }

        // Create a temporary user record (or check if exists by phone)
        let userId;
        const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.phone, phone))
            .limit(1);

        if (existingUser) {
            userId = existingUser.id;
        } else {
            // Create new user
            const nameParts = fullName.trim().split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ') || '';

            const [newUser] = await db
                .insert(users)
                .values({
                    firstName,
                    lastName,
                    phone,
                    email: email || null,
                    role: 'student',
                    status: 'pending',
                })
                .returning();

            userId = newUser.id;
        }

        // Check for existing pending request
        const [existingRequest] = await db
            .select()
            .from(joinRequests)
            .where(eq(joinRequests.studentUserId, userId))
            .limit(1);

        if (existingRequest && existingRequest.status === 'pending') {
            return new NextResponse('You already have a pending request for this organization', { status: 400 });
        }

        // Create join request
        await db
            .insert(joinRequests)
            .values({
                studentUserId: userId,
                organizationId,
                message: message || null,
                status: 'pending'
            });

        return NextResponse.json({
            success: true,
            message: 'Join request sent successfully! The admin will review your request.'
        });

    } catch (error) {
        console.error('[PUBLIC_JOIN_REQUEST_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}