import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, students, teachers, classes, attendance, dailyProgress } from '@/db/schema';
import { eq, and, count, sql, desc, gte } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';
import { isDemoMode } from '@/lib/auth-constants';

export async function GET(req: NextRequest) {
    try {
        const { userId, orgId } = await getAuth();

        if (!userId || !orgId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Get current date for calculations
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

        // Get all stats in parallel
        const [
            totalStudentsResult,
            totalStaffResult,
            totalClassesResult,
            todayAttendanceResult,
            monthlyStudentsResult,
            lastMonthStudentsResult,
            recentProgressResult,
            staffOverviewResult
        ] = await Promise.all([
            // Total active students
            db.select({ count: count() })
                .from(students)
                .innerJoin(users, eq(students.userId, users.id))
                .where(and(
                    eq(students.organizationId, orgId),
                    eq(users.status, 'active')
                )),

            // Total active staff (teachers + admins)
            db.select({ count: count() })
                .from(users)
                .where(and(
                    eq(users.organizationId, orgId),
                    eq(users.status, 'active'),
                    sql`${users.role} IN ('teacher', 'institute_admin')`
                )),

            // Total active classes
            db.select({ count: count() })
                .from(classes)
                .where(eq(classes.organizationId, orgId)),

            // Today's attendance
            db.select({
                status: attendance.status,
                count: count()
            })
                .from(attendance)
                .where(and(
                    eq(attendance.organizationId, orgId),
                    eq(attendance.date, today.toISOString().split('T')[0])
                ))
                .groupBy(attendance.status),

            // Students added this month
            db.select({ count: count() })
                .from(students)
                .where(and(
                    eq(students.organizationId, orgId),
                    gte(students.admissionDate, startOfMonth.toISOString())
                )),

            // Students added last month
            db.select({ count: count() })
                .from(students)
                .where(and(
                    eq(students.organizationId, orgId),
                    gte(students.admissionDate, lastMonth.toISOString()),
                    sql`${students.admissionDate} <= ${endOfLastMonth.toISOString()}`
                )),

            // Recent progress (last 5 entries)
            db.select({
                studentName: sql<string>`${users.firstName} || ' ' || COALESCE(${users.lastName}, '')`,
                teacherName: sql<string>`teacher_users.first_name || ' ' || COALESCE(teacher_users.last_name, '')`,
                learningType: dailyProgress.learningType,
                date: dailyProgress.date,
                attendanceStatus: dailyProgress.attendanceStatus,
                teacherRemarks: dailyProgress.teacherRemarks
            })
                .from(dailyProgress)
                .innerJoin(students, eq(dailyProgress.studentId, students.id))
                .innerJoin(users, eq(students.userId, users.id))
                .innerJoin(teachers, eq(dailyProgress.teacherId, teachers.id))
                .innerJoin(sql`users teacher_users`, sql`teachers.user_id = teacher_users.id`)
                .where(eq(dailyProgress.tenantId, orgId))
                .orderBy(desc(dailyProgress.createdAt))
                .limit(5),

            // Staff overview
            db.select({
                name: sql<string>`${users.firstName} || ' ' || COALESCE(${users.lastName}, '')`,
                role: users.role,
                specialization: teachers.specialization,
                studentCount: sql<number>`COALESCE(student_counts.count, 0)`
            })
                .from(users)
                .leftJoin(teachers, eq(users.id, teachers.userId))
                .leftJoin(
                    sql`(
                        SELECT t.user_id, COUNT(DISTINCT ce.student_id) as count
                        FROM teachers t
                        LEFT JOIN classes c ON t.id = c.teacher_id
                        LEFT JOIN class_enrollments ce ON c.id = ce.class_id
                        WHERE ce.status = 'active'
                        GROUP BY t.user_id
                    ) student_counts`,
                    sql`users.id = student_counts.user_id`
                )
                .where(and(
                    eq(users.organizationId, orgId),
                    eq(users.status, 'active'),
                    sql`${users.role} IN ('teacher', 'institute_admin')`
                ))
                .limit(10)
        ]);

        // Calculate statistics
        const totalStudents = totalStudentsResult[0]?.count || 0;
        const totalStaff = totalStaffResult[0]?.count || 0;
        const totalClasses = totalClassesResult[0]?.count || 0;
        const monthlyStudents = monthlyStudentsResult[0]?.count || 0;
        const lastMonthStudents = lastMonthStudentsResult[0]?.count || 0;

        // Calculate attendance percentage
        const attendanceData = todayAttendanceResult || [];
        const totalAttendanceMarked = attendanceData.reduce((sum, item) => sum + (item.count || 0), 0);
        const presentCount = attendanceData.find(item => item.status === 'present')?.count || 0;
        const overallAttendance = totalAttendanceMarked > 0 ? Math.round((presentCount / totalAttendanceMarked) * 100) : 0;

        // Calculate monthly growth
        const monthlyGrowth = lastMonthStudents > 0 
            ? Math.round(((monthlyStudents - lastMonthStudents) / lastMonthStudents) * 100)
            : monthlyStudents > 0 ? 100 : 0;

        return NextResponse.json({
            stats: {
                totalStudents,
                totalStaff,
                overallAttendance,
                classesRunning: totalClasses,
                monthlyGrowth,
            },
            recentProgress: recentProgressResult || [],
            staffOverview: staffOverviewResult || [],
            message: totalStudents === 0 ? 'No data available. Start by adding students and staff to see real statistics.' : null
        });

    } catch (error) {
        console.error('[DASHBOARD_STATS_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}