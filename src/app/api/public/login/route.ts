import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { eq, and } from 'drizzle-orm';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        let { email, password, role } = body;

        console.log('Login attempt:', { email, role });

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        // Map UI role to DB role
        const dbRole = role === 'admin' ? 'institute_admin' : role;

        // Find user by email and role
        const users_list = await db
            .select({
                id: users.id,
                password: users.password,
                organizationId: users.organizationId,
                role: users.role,
                status: users.status,
                firstName: users.firstName,
                lastName: users.lastName,
                email: users.email,
                phone: users.phone,
                createdAt: users.createdAt,
                updatedAt: users.updatedAt,
            })
            .from(users)
            .where(
                and(
                    eq(users.email, email),
                    eq(users.role, dbRole as any)
                )
            );
        
        const user = users_list[0];

        if (!user) {
            console.log('User not found:', email, 'with role:', dbRole);
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Check password (In production, use bcrypt.compare)
        if (user.password !== password) {
            console.log('Invalid password for user:', email);
            return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
        }

        // Check status
        if (user.status === 'pending') {
            return NextResponse.json({ message: 'Your account is pending approval' }, { status: 403 });
        }

        // Success - Return user data and set session cookie
        const response = NextResponse.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                organizationId: user.organizationId
            }
        });

        // Set session cookie (HTTP-only for security)
        response.cookies.set('session', JSON.stringify({
            userId: user.id,
            organizationId: user.organizationId,
            role: user.role
        }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });

        return response;

    } catch (error) {
        console.error('[LOGIN_POST] Detailed Error:', error);
        return NextResponse.json({ 
            message: 'Internal Server Error', 
            error: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
    }
}
