import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, students, teachers, classes, attendance, dailyProgress } from '@/db/schema';
import { eq, and, count, sql, desc, gte } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const { userId, orgId } = await getAuth();

        if (!userId || !orgId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split('T')[0];
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0];

        const safeCount = async (query: Promise<any[]>) => {
            try { const r = await query; return r[0]?.count || 0; } catch { return 0; }
        };

        const [
            totalStudents,
            totalStaff,
            totalClasses,
            todayAttendanceResult,
            monthlyStudents,
            lastMonthStudents,
            recentProgressResult,
            staffOverviewResult
        ] = await Promise.all([
            safeCount(
                db.select({ count: count() }).from(students)
                    .innerJoin(users, eq(students.userId, users.id))
                    .where(and(eq(students.organizationId, orgId), eq(users.status, 'active')))
            ),
            safeCount(
                db.select({ count: count() }).from(users)
                    .where(and(
                        eq(users.organizationId, orgId),
                        eq(users.status, 'active'),
                        sql`${users.role} IN ('teacher', 'institute_admin')`
                    ))
            ),
            safeCount(
                db.select({ count: count() }).from(classes)
                    .where(eq(classes.organizationId, orgId))
            ),
            db.select({ status: attendance.status, count: count() })
                .from(attendance)
                .where(and(eq(attendance.organizationId, orgId), eq(attendance.date, todayStr)))
                .groupBy(attendance.status)
                .catch(() => []),
            safeCount(
                db.select({ count: count() }).from(students)
                    .where(and(eq(students.organizationId, orgId), gte(students.admissionDate, startOfMonth)))
            ),
            safeCount(
                db.select({ count: count() }).from(students)
                    .where(and(
                        eq(students.organizationId, orgId),
                        gte(students.admissionDate, lastMonthStart),
                        sql`${students.admissionDate} <= ${lastMonthEnd}`
                    ))
            ),
            db.select({
                studentName: sql<string>`${users.firstName} || ' ' || COALESCE(${users.lastName}, '')`,
                learningType: dailyProgress.learningType,
                date: dailyProgress.date,
                attendanceStatus: dailyProgress.attendanceStatus,
                teacherRemarks: dailyProgress.teacherRemarks,
            })
                .from(dailyProgress)
                .innerJoin(students, eq(dailyProgress.studentId, students.id))
                .innerJoin(users, eq(students.userId, users.id))
                .where(eq(dailyProgress.tenantId, orgId))
                .orderBy(desc(dailyProgress.createdAt))
                .limit(5)
                .catch(() => []),
            db.select({
                name: sql<string>`${users.firstName} || ' ' || COALESCE(${users.lastName}, '')`,
                role: users.role,
                specialization: teachers.specialization,
            })
                .from(users)
                .leftJoin(teachers, eq(users.id, teachers.userId))
                .where(and(
                    eq(users.organizationId, orgId),
                    eq(users.status, 'active'),
                    sql`${users.role} IN ('teacher', 'institute_admin')`
                ))
                .limit(10)
                .catch(() => []),
        ]);

        const attendanceData = Array.isArray(todayAttendanceResult) ? todayAttendanceResult : [];
        const totalAttendanceMarked = attendanceData.reduce((sum: number, item: any) => sum + (Number(item.count) || 0), 0);
        const presentCount = attendanceData.find((item: any) => item.status === 'present')?.count || 0;
        const overallAttendance = totalAttendanceMarked > 0
            ? Math.round((Number(presentCount) / totalAttendanceMarked) * 100)
            : 0;
        const monthlyGrowth = Number(lastMonthStudents) > 0
            ? Math.round(((Number(monthlyStudents) - Number(lastMonthStudents)) / Number(lastMonthStudents)) * 100)
            : Number(monthlyStudents) > 0 ? 100 : 0;

        return NextResponse.json({
            stats: {
                totalStudents: Number(totalStudents),
                totalStaff: Number(totalStaff),
                overallAttendance,
                classesRunning: Number(totalClasses),
                monthlyGrowth,
            },
            recentProgress: recentProgressResult || [],
            staffOverview: staffOverviewResult || [],
            message: Number(totalStudents) === 0
                ? 'No data yet. Start by adding students and staff.'
                : null,
        });

    } catch (error) {
        console.error('[DASHBOARD_STATS_GET]', error);
        return NextResponse.json({
            stats: { totalStudents: 0, totalStaff: 0, overallAttendance: 0, classesRunning: 0, monthlyGrowth: 0 },
            recentProgress: [],
            staffOverview: [],
            message: 'Could not load stats.',
        });
    }
}
