import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import { isDemoMode } from '@/lib/auth-constants';

export async function POST(req: NextRequest) {
    try {
        const { userId, orgId } = await getAuth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { type, message } = body;

        if (!type || !message) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        console.log(`[FEEDBACK] Received from ${userId} (${orgId}):`, { type, message });

        // In a real app, we would save this to a 'feedback' table.
        // For now, we simulate success, especially in demo mode.

        return NextResponse.json({
            success: true,
            message: 'Feedback received successfully. Thank you!'
        });

    } catch (error) {
        console.error('[FEEDBACK_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
