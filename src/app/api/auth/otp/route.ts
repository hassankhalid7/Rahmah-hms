import { NextRequest, NextResponse } from 'next/server';

/**
 * Mock OTP API for Demo Mode.
 * In a real application, this would send an email via Resend/Postmark.
 */
export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        console.log(`[DEMO MODE] Sending OTP 123456 to ${email}`);

        // In demo mode, we always use 123456
        return NextResponse.json({
            success: true,
            message: 'OTP sent successfully to ' + email,
            demo_code: '123456'
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
