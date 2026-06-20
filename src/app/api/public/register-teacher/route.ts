import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, or } from 'drizzle-orm';

// POST /api/public/register-teacher
// Creates a teacher user with pending status (no org yet)
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { firstName, lastName, email, phone, password } = body;

        if (!firstName || !password || (!email && !phone)) {
            return NextResponse.json(
                { message: 'First name, password, and email or phone are required.' },
                { status: 400 }
            );
        }

        // Check duplicate email/phone
        const conditions = [];
        if (email) conditions.push(eq(users.email, email));
        if (phone) conditions.push(eq(users.phone, phone));

        const existing = conditions.length > 0
            ? await db.select({ id: users.id }).from(users)
                .where(conditions.length === 1 ? conditions[0] : or(...conditions))
                .limit(1)
            : [];

        if (existing.length > 0) {
            return NextResponse.json(
                { message: 'An account with this email or phone already exists.' },
                { status: 409 }
            );
        }

        const [newUser] = await db.insert(users).values({
            firstName: firstName.trim(),
            lastName: (lastName || '').trim(),
            email: email || null,
            phone: phone || null,
            password,
            role: 'teacher',
            status: 'pending', // no org linked yet
            organizationId: null,
        }).returning({
            id: users.id,
            email: users.email,
            firstName: users.firstName,
            role: users.role,
        });

        return NextResponse.json({ success: true, user: newUser }, { status: 201 });

    } catch (error) {
        console.error('[REGISTER_TEACHER_POST]', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
