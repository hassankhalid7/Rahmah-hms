import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { dailyProgress, progressEditHistory } from '@/db/schema/progress';
import { updateProgressSchema } from '@/lib/validations/progress';
import { eq } from 'drizzle-orm';
import { generateChangesSummary } from '@/lib/progress/formatters';

// GET /api/progress/[id] - Get single progress record
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const [record] = await db
            .select()
            .from(dailyProgress)
            .where(eq(dailyProgress.id, id))
            .limit(1);

        if (!record) {
            return NextResponse.json(
                { error: 'Progress record not found' },
                { status: 404 }
            );
        }

        // TODO: Check tenant access
        // if (record.tenantId !== currentUser.tenantId) {
        //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        // }

        return NextResponse.json(record);
    } catch (error) {
        console.error('Error fetching progress record:', error);
        return NextResponse.json(
            { error: 'Failed to fetch progress record' },
            { status: 500 }
        );
    }
}

// PATCH /api/progress/[id] - Update progress record
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Get existing record
        const [existingRecord] = await db
            .select()
            .from(dailyProgress)
            .where(eq(dailyProgress.id, id))
            .limit(1);

        if (!existingRecord) {
            return NextResponse.json(
                { error: 'Progress record not found' },
                { status: 404 }
            );
        }

        // TODO: Check permissions
        // Only teacher who created it or admin can edit
        // if (existingRecord.teacherId !== currentUser.id && !currentUser.isAdmin) {
        //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        // }

        // Validate update data
        const validationResult = updateProgressSchema.safeParse({
            ...body,
            learningType: existingRecord.learningType, // Keep same learning type
        });

        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validationResult.error.format() },
                { status: 400 }
            );
        }

        const updateData = validationResult.data;

        // Prepare update object
        const updates: any = {
            attendanceStatus: updateData.attendanceStatus ?? existingRecord.attendanceStatus,
            teacherRemarks: updateData.teacherRemarks ?? existingRecord.teacherRemarks,
            updatedAt: new Date(),
        };

        // Add type-specific fields based on learning type
        if (existingRecord.learningType === 'qaida' && updateData.learningType === 'qaida') {
            if (updateData.qaidaLessonNumber !== undefined) updates.qaidaLessonNumber = updateData.qaidaLessonNumber;
            if (updateData.qaidaPageNumber !== undefined) updates.qaidaPageNumber = updateData.qaidaPageNumber;
            if (updateData.qaidaTopic !== undefined) updates.qaidaTopic = updateData.qaidaTopic;
            if (updateData.qaidaMistakesCount !== undefined) updates.qaidaMistakesCount = updateData.qaidaMistakesCount;
        } else if (existingRecord.learningType === 'nazra' && updateData.learningType === 'nazra') {
            if (updateData.nazraParaNumber !== undefined) updates.nazraParaNumber = updateData.nazraParaNumber;
            if (updateData.nazraFromAyah !== undefined) updates.nazraFromAyah = updateData.nazraFromAyah;
            if (updateData.nazraToAyah !== undefined) updates.nazraToAyah = updateData.nazraToAyah;
            if (updateData.nazraMistakesCount !== undefined) updates.nazraMistakesCount = updateData.nazraMistakesCount;
        } else if (existingRecord.learningType === 'hifz' && updateData.learningType === 'hifz') {
            if (updateData.hifzSabaq !== undefined) updates.hifzSabaq = updateData.hifzSabaq;
            if (updateData.hifzSabqi !== undefined) updates.hifzSabqi = updateData.hifzSabqi;
            if (updateData.hifzManzil !== undefined) updates.hifzManzil = updateData.hifzManzil;
            if (updateData.hifzAyatMistakes !== undefined) updates.hifzAyatMistakes = updateData.hifzAyatMistakes;
        }

        // Create audit trail entry
        const changesSummary = generateChangesSummary(existingRecord, { ...existingRecord, ...updates });

        // TODO: Get current user ID
        const editedBy = 'placeholder-user-id';

        await db.insert(progressEditHistory).values({
            progressId: id,
            editedBy,
            previousState: existingRecord as any,
            changesSummary,
        });

        // Update the record
        const [updatedRecord] = await db
            .update(dailyProgress)
            .set(updates)
            .where(eq(dailyProgress.id, id))
            .returning();

        return NextResponse.json(updatedRecord);
    } catch (error) {
        console.error('Error updating progress record:', error);
        return NextResponse.json(
            { error: 'Failed to update progress record' },
            { status: 500 }
        );
    }
}

// DELETE /api/progress/[id] - Delete progress record (soft delete)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Get existing record
        const [existingRecord] = await db
            .select()
            .from(dailyProgress)
            .where(eq(dailyProgress.id, id))
            .limit(1);

        if (!existingRecord) {
            return NextResponse.json(
                { error: 'Progress record not found' },
                { status: 404 }
            );
        }

        // TODO: Check permissions - only admin should be able to delete

        // For now, hard delete (could implement soft delete with a deletedAt field)
        await db.delete(dailyProgress).where(eq(dailyProgress.id, id));

        return NextResponse.json({ message: 'Progress record deleted successfully' });
    } catch (error) {
        console.error('Error deleting progress record:', error);
        return NextResponse.json(
            { error: 'Failed to delete progress record' },
            { status: 500 }
        );
    }
}
