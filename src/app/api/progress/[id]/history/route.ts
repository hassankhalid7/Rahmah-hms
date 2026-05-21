import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { progressEditHistory } from '@/db/schema/progress';
import { eq, desc } from 'drizzle-orm';

// GET /api/progress/[id]/history - Get edit history for a progress record
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const history = await db
            .select()
            .from(progressEditHistory)
            .where(eq(progressEditHistory.progressId, id))
            .orderBy(desc(progressEditHistory.editedAt));

        return NextResponse.json(history);
    } catch (error) {
        console.error('Error fetching edit history:', error);
        return NextResponse.json(
            { error: 'Failed to fetch edit history' },
            { status: 500 }
        );
    }
}
