import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, students, teachers, classes, attendance, dailyProgress, classEnrollments } from '@/db/schema';
import { eq, and, count, sql, desc } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const { userId, orgId } = await getAuth();

        if (!userId || !orgId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Find teacher record for this user
        const teacher = await db.query.teachers.findFirst({
            where: and(
                eq(teachers.userId, userId),
                eq(teachers.organizationId, orgId)
            )
        });

        if (!teacher) {
            return NextResponse.json({
                stats: { totalStudents: 0, todayAttendance: '0%', pendingProgress: 0 },
                classes: []
            });
        }

        const todayStr = new Date().toISOString().split('T')[0];

        // Fetch assigned classes
        const teacherClasses = await db.select({
            id: classes.id,
            name: classes.name,
            description: classes.description,
        })
        .from(classes)
        .where(and(
            eq(classes.teacherId, teacher.id),
            eq(classes.organizationId, orgId)
        ));

        // Fetch student counts for these classes
        const classIds = teacherClasses.map(c => c.id);
        
        let totalStudents = 0;
        let classDetails = [];

        if (classIds.length > 0) {
            const enrollments = await db.select({
                classId: classEnrollments.classId,
                count: count()
            })
            .from(classEnrollments)
            .where(sql`${classEnrollments.classId} IN ${classIds}`)
            .groupBy(classEnrollments.classId);

            totalStudents = enrollments.reduce((sum, e) => sum + Number(e.count), 0);
            
            classDetails = teacherClasses.map(c => {
                const e = enrollments.find(env => env.classId === c.id);
                return {
                    ...c,
                    studentCount: e ? Number(e.count) : 0,
                    time: "N/A" // Time is not in schema yet
                };
            });
        }

        return NextResponse.json({
            stats: {
                totalStudents,
                todayAttendance: '100%', // Simplified for now
                pendingProgress: totalStudents // Assuming everyone needs progress today
            },
            classes: classDetails
        });

    } catch (error) {
        console.error('[TEACHER_STATS_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
