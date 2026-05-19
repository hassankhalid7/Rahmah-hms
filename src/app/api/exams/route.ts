import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { exams, examResults, students, users } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';
import { isDemoMode } from '@/lib/auth-constants';

// GET /api/exams - List exams
export async function GET(req: NextRequest) {
    try {
        const { userId, orgId } = await getAuth();

        if (isDemoMode) {
            return NextResponse.json({
                exams: [
                    { id: '1', name: 'Monthly Hifz Assessment', examType: 'Monthly', date: '2026-02-28', status: 'Scheduled' },
                    { id: '2', name: 'Nazra Para 1-5 Final', examType: 'Final', date: '2026-03-15', status: 'Draft' },
                ]
            });
        }

        if (!userId || !orgId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const searchParams = req.nextUrl.searchParams;
        const examType = searchParams.get('examType');

        const data = await db
            .select()
            .from(exams)
            .where(
                and(
                    eq(exams.organizationId, orgId),
                    examType ? eq(exams.examType, examType) : undefined
                )
            )
            .orderBy(desc(exams.date));

        return NextResponse.json({ exams: data });

    } catch (error) {
        console.error('[EXAMS_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

// POST /api/exams - Create new exam
export async function POST(req: NextRequest) {
    try {
        const { userId, orgId } = await getAuth();

        if (!userId || !orgId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { name, examType, date, syllabus, metadata } = body;

        if (!name) {
            return new NextResponse('Exam name is required', { status: 400 });
        }

        const [newExam] = await db
            .insert(exams)
            .values({
                organizationId: orgId,
                name,
                examType,
                date,
                syllabus,
                metadata: metadata || {},
            })
            .returning();

        return NextResponse.json(newExam);

    } catch (error) {
        console.error('[EXAMS_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
