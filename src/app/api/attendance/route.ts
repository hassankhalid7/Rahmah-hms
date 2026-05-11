import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { attendance, users, students } from '@/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';

// GET /api/attendance - Get attendance records
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await getAuth();
    
    if (!userId || !orgId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const student_id = searchParams.get('student_id');
    const date = searchParams.get('date');
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');

    const records = await db
        .select()
        .from(attendance)
        .where(
            and(
                eq(attendance.organizationId, orgId),
                student_id ? eq(attendance.userId, student_id) : undefined,
                date ? eq(attendance.date, date) : undefined,
                start_date ? gte(attendance.date, start_date) : undefined,
                end_date ? lte(attendance.date, end_date) : undefined
            )
        );

    return NextResponse.json({ attendance: records });

  } catch (error) {
    console.error('Get attendance error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/attendance/mark - Mark attendance
export async function POST(request: NextRequest) {
  try {
    const { userId: currentUserId, orgId } = await getAuth();
    if (!currentUserId || !orgId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { date, student_id, status, remarks } = body;

    const [record] = await db.insert(attendance).values({
        organizationId: orgId,
        userId: student_id,
        date,
        status,
        remarks,
        markedBy: currentUserId
    }).returning();

    return NextResponse.json(record);

  } catch (error) {
    console.error('Mark attendance error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
