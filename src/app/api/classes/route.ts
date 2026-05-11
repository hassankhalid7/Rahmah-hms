import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { classes, teachers, users, classEnrollments } from '@/db/schema';
import { eq, and, ilike, desc, sql } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';
import { isDemoMode } from '@/lib/auth-constants';
import { classSchema } from '@/lib/validations/class';

export async function POST(req: NextRequest) {
    try {
        const { userId: currentUserId, orgId } = await getAuth();

        if (!currentUserId || !orgId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const validation = classSchema.safeParse(body);

        if (!validation.success) {
            return new NextResponse(validation.error.message, { status: 400 });
        }

        const { name, description, teacherId, startDate, endDate, schedule } = validation.data;

        const [newClass] = await db.insert(classes).values({
            organizationId: orgId,
            name,
            description,
            teacherId: teacherId || null,
            startDate: startDate ? startDate : null,
            endDate: endDate ? endDate : null,
            schedule: schedule ? schedule : [],
        }).returning();

        return NextResponse.json(newClass);

    } catch (error) {
        console.error('[CLASSES_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { userId, orgId } = await getAuth();

        if (isDemoMode) {
            return NextResponse.json([
                { id: '1', name: 'Halaqa Al-Fatihah', description: 'Beginners Tajweed', teacher: { firstName: 'Abdur', lastName: 'Rahman' }, teacherName: 'Abdur Rahman', enrollmentCount: 15 },
                { id: '2', name: 'Halaqa Al-Baqarah', description: 'Advanced Hifz', teacher: { firstName: 'Zaid', lastName: 'Ibn Thabit' }, teacherName: 'Zaid Ibn Thabit', enrollmentCount: 8 },
            ]);
        }

        if (!userId || !orgId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const searchParams = req.nextUrl.searchParams;
        const query = searchParams.get('query') || '';

        // Select classes with teacher details and student count
        // Note: Drizzle's count capability with referencing tables can be tricky.
        // We will fetch classes and join teacher first.

        const data = await db
            .select({
                id: classes.id,
                name: classes.name,
                description: classes.description,
                teacherId: classes.teacherId,
                teacherName: users.firstName, // Assuming teacher links to user
                teacherLastName: users.lastName,
                schedule: classes.schedule,
                createdAt: classes.createdAt,
            })
            .from(classes)
            .leftJoin(teachers, eq(classes.teacherId, teachers.id))
            .leftJoin(users, eq(teachers.userId, users.id))
            .where(
                and(
                    eq(classes.organizationId, orgId),
                    query
                        ? ilike(classes.name, `%${query}%`)
                        : undefined
                )
            )
            .orderBy(desc(classes.createdAt));

        // TODO: Get student count for each class. 
        // For now returning basic list.

        const formatted = data.map(c => ({
            ...c,
            teacherName: c.teacherName ? `${c.teacherName} ${c.teacherLastName}`.trim() : 'Unassigned',
        }));

        return NextResponse.json(formatted);

    } catch (error) {
        console.error('[CLASSES_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
