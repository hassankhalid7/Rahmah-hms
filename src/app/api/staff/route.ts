import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, teachers, organizations } from '@/db/schema';
import { eq, and, or, ilike, desc } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';
import { isDemoMode } from '@/lib/auth-constants';
import { staffSchema } from '@/lib/validations/staff';

export async function POST(req: NextRequest) {
    try {
        const { userId: currentUserId, orgId } = await getAuth();

        if (!currentUserId || !orgId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();

        if (isDemoMode) {
            // Mock success for demo mode
            return NextResponse.json({
                id: 'demo-staff-' + Date.now(),
                firstName: body.firstName || 'Demo',
                lastName: body.lastName || 'Staff',
                email: body.email || 'demo@staff.com',
                role: body.role || 'teacher',
                status: 'active'
            });
        }
        const validation = staffSchema.safeParse(body);

        if (!validation.success) {
            return new NextResponse(validation.error.message, { status: 400 });
        }

        const {
            firstName, lastName, email, phone, role,
            specialization, joiningDate, employeeNumber, gender
        } = validation.data;

        // Transaction to create user and teacher record
        const result = await db.transaction(async (tx) => {
            // 1. Create User
            // Note: We are creating a user *without* a Clerk ID initially.
            // They can "claim" this account later or we invite them.
            // For now, we just store their profile.
            const [newUser] = await tx.insert(users).values({
                firstName,
                lastName,
                email,
                phone,
                role: role as any,
                organizationId: orgId,
                status: 'active', // Auto-activate for now
            }).returning();

            // 2. If role is teacher, create teacher record
            if (role === 'teacher') {
                await tx.insert(teachers).values({
                    userId: newUser.id,
                    organizationId: orgId,
                    employeeNumber,
                    specialization,
                    joinDate: joiningDate ? new Date(joiningDate).toISOString() : null,
                    metadata: { gender }
                });
            }

            return newUser;
        });

        return NextResponse.json(result);

    } catch (error) {
        console.error('[STAFF_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { userId, orgId } = await getAuth();

        if (isDemoMode) {
            return NextResponse.json([
                { id: '1', firstName: 'Abdur', lastName: 'Rahman', email: 'rahman@sahl.edu', role: 'teacher', status: 'active', employeeNumber: 'T-001', specialization: 'Hifz' },
                { id: '2', firstName: 'Zaid', lastName: 'Ibn Thabit', email: 'zaid@sahl.edu', role: 'teacher', status: 'active', employeeNumber: 'T-002', specialization: 'Tajweed' },
                { id: '3', firstName: 'Fatima', lastName: 'Zahra', email: 'fatima@sahl.edu', role: 'teacher', status: 'active', employeeNumber: 'T-003', specialization: 'Arabic' },
            ]);
        }

        if (!userId || !orgId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const searchParams = req.nextUrl.searchParams;
        const query = searchParams.get('query') || '';
        const role = searchParams.get('role');

        const data = await db
            .select({
                id: users.id,
                firstName: users.firstName,
                lastName: users.lastName,
                email: users.email,
                phone: users.phone,
                role: users.role,
                status: users.status,
                // Teacher specific (left join)
                teacherId: teachers.id,
                specialization: teachers.specialization,
                employeeNumber: teachers.employeeNumber,
            })
            .from(users)
            .leftJoin(teachers, eq(users.id, teachers.userId))
            .where(
                and(
                    eq(users.organizationId, orgId),
                    role ? eq(users.role, role as any) : or(eq(users.role, 'teacher'), eq(users.role, 'institute_admin')),
                    query
                        ? or(
                            ilike(users.firstName, `%${query}%`),
                            ilike(users.lastName, `%${query}%`),
                            ilike(users.email, `%${query}%`)
                        )
                        : undefined
                )
            )
            .orderBy(desc(users.createdAt));

        return NextResponse.json(data);

    } catch (error) {
        console.error('[STAFF_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
