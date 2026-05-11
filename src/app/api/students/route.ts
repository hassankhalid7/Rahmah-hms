import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { students, users, classEnrollments, classes } from '@/db/schema';
import { eq, and, desc, ilike, or } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';
import { isDemoMode } from '@/lib/auth-constants';
import { studentSchema } from '@/lib/validations/student';
import { getMockStudents } from '@/lib/mock-db';

export async function GET(req: NextRequest) {
    try {
        const { userId, orgId } = await getAuth();

        if (!userId || !orgId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const searchParams = req.nextUrl.searchParams;
        const query = searchParams.get('query') || '';
        const track = searchParams.get('track');

        // Build base query
        // We need to join students with users to get name/email etc.
        // We also want to fetch the current active class name if possible

        const data = await db
            .select({
                id: students.id,
                studentId: students.studentNumber,
                name: users.firstName, // Assuming we store full name or constructing it
                lastName: users.lastName,
                status: users.status,
                joiningDate: students.admissionDate,
                // We will fetch class name separately or via lateral join if supported, 
                // but for now let's just get student info and improve later
                userId: users.id,
                email: users.email,
            })
            .from(students)
            .innerJoin(users, eq(students.userId, users.id))
            .where(
                and(
                    eq(students.organizationId, orgId),
                    query
                        ? or(
                            ilike(users.firstName, `%${query}%`),
                            ilike(users.lastName, `%${query}%`),
                            ilike(students.studentNumber, `%${query}%`)
                        )
                        : undefined
                )
            )
            .orderBy(desc(students.admissionDate));

        // Format names
        const formattedStudents = data.map(s => ({
            ...s,
            name: `${s.name} ${s.lastName || ''}`.trim(),
        }));

        return NextResponse.json(formattedStudents);

    } catch (error) {
        console.error('[STUDENTS_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userId: currentUserId, orgId } = await getAuth();

        if (!currentUserId || !orgId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const validation = studentSchema.safeParse(body);

        if (!validation.success) {
            return new NextResponse(validation.error.message, { status: 400 });
        }

        const {
            firstName, lastName, email, phone, dateOfBirth, gender,
            guardianFirstName, guardianLastName, guardianRelation, guardianPhone, guardianEmail,
            assignedClass, admissionDate, address
        } = validation.data;

        // Transaction to create users and student record
        const result = await db.transaction(async (tx) => {
            // 1. Create Guardian User (if needed) - simplified: always create new or find by email?
            // For MVP, creating new user for guardian (assuming guardians might not be shared yet or need unique emails)
            // Ideally we check if guardian exists.
            let guardianId: string | undefined;

            if (guardianEmail) {
                const existingGuardian = await tx.query.users.findFirst({
                    where: and(
                        eq(users.email, guardianEmail),
                        eq(users.organizationId, orgId)
                    )
                });

                if (existingGuardian) {
                    guardianId = existingGuardian.id;
                }
            }

            if (!guardianId) {
                const [newGuardian] = await tx.insert(users).values({
                    firstName: guardianFirstName,
                    lastName: guardianLastName,
                    email: guardianEmail || null,
                    phone: guardianPhone,
                    role: 'parent',
                    status: 'active',
                    organizationId: orgId,
                    // clerkUserId is nullable now
                }).returning({ id: users.id });
                guardianId = newGuardian.id;
            }

            // 2. Create Student User
            const [newStudentUser] = await tx.insert(users).values({
                firstName,
                lastName,
                email: email || null,
                phone: phone || null,
                role: 'student',
                status: 'active',
                organizationId: orgId,
            }).returning({ id: users.id });

            // 3. Create Student Profile
            const [newStudent] = await tx.insert(students).values({
                userId: newStudentUser.id,
                organizationId: orgId,
                guardianId: guardianId,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : null,
                admissionDate: admissionDate ? new Date(admissionDate).toISOString() : new Date().toISOString(),
                // Generate student number?
                studentNumber: `STU-${Date.now().toString().slice(-6)}`,
                metadata: { gender, address },
            }).returning();

            // 4. Assign Class if selected
            // We need classId, but the form might send class name or ID. 
            // The plan said "Connect Admission Form to API". The form currently has hardcoded options.
            // We will assume for now we skip class enrollment or need to lookup class.
            // For MVP, ignoring exact class assignment until Class module is ready.

            return newStudent;
        });

        return NextResponse.json(result);

    } catch (error) {
        console.error('[STUDENTS_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
