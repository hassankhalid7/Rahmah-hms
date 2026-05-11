import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { dailyProgress, progressEditHistory } from '@/db/schema/progress';
import { createProgressSchema, progressListQuerySchema } from '@/lib/validations/progress';
import { eq, and, gte, lte, desc } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';

// GET /api/progress - List progress records
export async function GET(request: NextRequest) {
    try {
        const { userId, orgId } = await getAuth();
        if (!userId || !orgId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);

        // Parse and validate query parameters
        const queryResult = progressListQuerySchema.safeParse({
            studentId: searchParams.get('studentId'),
            teacherId: searchParams.get('teacherId'),
            dateFrom: searchParams.get('dateFrom'),
            dateTo: searchParams.get('dateTo'),
            learningType: searchParams.get('learningType'),
            page: searchParams.get('page'),
            limit: searchParams.get('limit'),
        });

        if (!queryResult.success) {
            return NextResponse.json(
                { error: 'Invalid query parameters', details: queryResult.error.format() },
                { status: 400 }
            );
        }

        const { studentId, teacherId, dateFrom, dateTo, learningType, page, limit } = queryResult.data;

        // Build query conditions
        const conditions = [];

        if (studentId) conditions.push(eq(dailyProgress.studentId, studentId));
        if (teacherId) conditions.push(eq(dailyProgress.teacherId, teacherId));
        if (learningType) conditions.push(eq(dailyProgress.learningType, learningType));
        if (dateFrom) conditions.push(gte(dailyProgress.date, dateFrom));
        if (dateTo) conditions.push(lte(dailyProgress.date, dateTo));

        // Filter by organization/tenant
        conditions.push(eq(dailyProgress.tenantId, orgId));

        // Execute query with pagination
        const offset = (page - 1) * limit;

        const [records, totalCount] = await Promise.all([
            db
                .select()
                .from(dailyProgress)
                .where(conditions.length > 0 ? and(...conditions) : undefined)
                .orderBy(desc(dailyProgress.date))
                .limit(limit)
                .offset(offset),
            db
                .select({ count: dailyProgress.id })
                .from(dailyProgress)
                .where(conditions.length > 0 ? and(...conditions) : undefined),
        ]);

        return NextResponse.json({
            data: records,
            total: totalCount.length,
            page,
            limit,
        });
    } catch (error) {
        console.error('Error fetching progress records:', error);
        return NextResponse.json(
            { error: 'Failed to fetch progress records' },
            { status: 500 }
        );
    }
}

// POST /api/progress - Create new progress record
export async function POST(request: NextRequest) {
    try {
        const { userId, orgId } = await getAuth();
        if (!userId || !orgId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Validate request body
        const validationResult = createProgressSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validationResult.error.format() },
                { status: 400 }
            );
        }

        const data = validationResult.data;

        const teacherId = data.teacherId || userId;
        const tenantId = orgId;

        // Prepare insert data based on learning type
        const insertData: any = {
            studentId: data.studentId,
            teacherId,
            tenantId,
            date: data.date,
            learningType: data.learningType,
            attendanceStatus: data.attendanceStatus,
            teacherRemarks: data.teacherRemarks,
        };

        // Add type-specific fields
        if (data.learningType === 'qaida') {
            insertData.qaidaLessonNumber = data.qaidaLessonNumber;
            insertData.qaidaPageNumber = data.qaidaPageNumber;
            insertData.qaidaTopic = data.qaidaTopic;
            insertData.qaidaMistakesCount = data.qaidaMistakesCount;
        } else if (data.learningType === 'nazra') {
            insertData.nazraParaNumber = data.nazraParaNumber;
            insertData.nazraFromAyah = data.nazraFromAyah;
            insertData.nazraToAyah = data.nazraToAyah;
            insertData.nazraMistakesCount = data.nazraMistakesCount;
        } else if (data.learningType === 'hifz') {
            insertData.hifzSabaq = data.hifzSabaq;
            insertData.hifzSabqi = data.hifzSabqi;
            insertData.hifzManzil = data.hifzManzil;
            insertData.hifzAyatMistakes = data.hifzAyatMistakes;
        }

        // Insert into database
        const [newRecord] = await db.insert(dailyProgress).values(insertData).returning();

        return NextResponse.json(newRecord, { status: 201 });
    } catch (error) {
        console.error('Error creating progress record:', error);
        return NextResponse.json(
            { error: 'Failed to create progress record' },
            { status: 500 }
        );
    }
}
