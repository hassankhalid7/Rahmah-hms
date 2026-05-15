import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { organizations } from '@/db/schema/organizations';
import { users } from '@/db/schema/users';
import { eq } from 'drizzle-orm';

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

        // Create slug from name
        const slug = name.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .trim();

        // Check if slug already exists
        const existingOrg = await db
            .select()
            .from(organizations)
            .where(eq(organizations.slug, slug))
            .limit(1);

        if (existingOrg.length > 0) {
            return NextResponse.json({ message: 'An institute with this name already exists. Please use a different name.' }, { status: 400 });
        }

        // Create organization and Admin User with transaction
        const { newOrganization, newAdmin } = await db.transaction(async (tx) => {
            const [org] = await tx
                .insert(organizations)
                .values({
                    name,
                    slug,
                    address,
                    phone,
                    email: email || null,
                    metadata: {},
                })
                .returning();

            const [admin] = await tx.insert(users).values({
                firstName: adminName.trim().split(/\s+/)[0],
                lastName: adminName.trim().split(/\s+/).slice(1).join(' ') || '',
                email: email || null,
                phone: phone,
                password: password,
                role: 'institute_admin' as const,
                status: 'active' as const,
                organizationId: org.id,
            }).returning();

            return { newOrganization: org, newAdmin: admin };
        });

        return NextResponse.json({
            success: true,
            message: 'Institute and Admin registered successfully!',
            organization: newOrganization,
            admin: { id: newAdmin.id, email: newAdmin.email }
        });

    } catch (error) {
        console.error('[PUBLIC_ORGANIZATIONS_REGISTER_POST] Detailed Error:', error);
        return NextResponse.json({ 
            message: 'Internal Error', 
            error: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
    }
}
