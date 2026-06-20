import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { organizations } from '@/db/schema/organizations';
import { users } from '@/db/schema/users';
import { eq, or } from 'drizzle-orm';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, address, phone, email, password, adminName } = body;

        // Validate required fields
        if (!name || !address || !password || !adminName) {
            return NextResponse.json({ message: 'Please fill all required fields: Institute Name, Address, Admin Name, and Password' }, { status: 400 });
        }

        // Validate email or phone — at least one required for login
        if (!email && !phone) {
            return NextResponse.json({ message: 'Please provide an Email or Phone number to use for login' }, { status: 400 });
        }

        // Create base slug from name
        const nameStr = String(name || '');
        let baseSlug = nameStr.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')   // Remove special characters
            .replace(/\s+/g, '-')             // Replace spaces with hyphens
            .replace(/-+/g, '-')              // Replace multiple hyphens with single
            .trim();

        if (!baseSlug) {
            return NextResponse.json({ message: 'Invalid institute name' }, { status: 400 });
        }

        // Auto-generate unique slug — append random number if already taken
        let slug = baseSlug;
        const existingOrg = await db
            .select({ id: organizations.id })
            .from(organizations)
            .where(eq(organizations.slug, slug))
            .limit(1);

        if (existingOrg.length > 0) {
            // Append random 4-digit number to make it unique
            slug = `${baseSlug}-${Math.floor(Math.random() * 9000) + 1000}`;
        }

        // Check if admin email/phone already registered
        const conditions: any[] = [];
        if (email) conditions.push(eq(users.email, email));
        if (phone) conditions.push(eq(users.phone, phone));

        if (conditions.length > 0) {
            const existingAdmin = await db
                .select({ id: users.id })
                .from(users)
                .where(conditions.length === 1 ? conditions[0] : or(...conditions))
                .limit(1);

            if (existingAdmin.length > 0) {
                return NextResponse.json({ message: 'An account with this email or phone already exists. Please login instead.' }, { status: 400 });
            }
        }

        // Create organization and Admin User with transaction
        const result = await db.transaction(async (tx) => {
            const [org] = await tx
                .insert(organizations)
                .values({
                    name,
                    slug,
                    address,
                    phone: phone || null,
                    email: email || null,
                    metadata: {},
                })
                .returning();

            const [admin] = await tx.insert(users).values({
                firstName: adminName.trim().split(/\s+/)[0],
                lastName: adminName.trim().split(/\s+/).slice(1).join(' ') || '',
                email: email || null,
                phone: phone || null,
                password: password,
                role: 'institute_admin',
                status: 'active',
                organizationId: org.id,
            }).returning();

            return { org, admin };
        });

        return NextResponse.json({
            success: true,
            message: 'Institute and Admin registered successfully!',
            organization: result.org,
            admin: { id: result.admin.id, email: result.admin.email }
        });

    } catch (error: any) {
        console.error('[PUBLIC_ORGANIZATIONS_REGISTER_POST] Error:', error);

        const rootErrorMessage = error?.cause?.message || error?.cause || null;

        return NextResponse.json({
            message: 'Internal Error',
            error: error instanceof Error ? error.message : 'Unknown error',
            details: rootErrorMessage
        }, { status: 500 });
    }
}
