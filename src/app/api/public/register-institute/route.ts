import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
    try {
        const [{ db }, { organizations }, { users }] = await Promise.all([
            import('@/db'),
            import('@/db/schema/organizations'),
            import('@/db/schema/users'),
        ]);

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
        const nameStr = String(name || '');
        const slug = nameStr.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .trim();

        if (!slug) {
            return NextResponse.json({ message: 'Invalid institute name' }, { status: 400 });
        }

        // Check if slug already exists
        const existingOrg = await db
            .select({ id: organizations.id })
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
                })
                .returning({
                    id: organizations.id,
                    name: organizations.name,
                    slug: organizations.slug,
                    address: organizations.address,
                    phone: organizations.phone,
                    email: organizations.email,
                });

            const [admin] = await tx.insert(users).values({
                firstName: adminName.trim().split(/\s+/)[0],
                lastName: adminName.trim().split(/\s+/).slice(1).join(' ') || '',
                email: email || null,
                phone: phone,
                password: password,
                role: 'institute_admin' as const,
                status: 'active' as const,
                organizationId: org.id,
            }).returning({
                id: users.id,
                email: users.email,
            });

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
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const envHint = errorMessage.includes('DATABASE_URL')
            ? 'DATABASE_URL missing. Create .env.local (copy from .env.example) and set DATABASE_URL, then restart the dev server.'
            : errorMessage;
        return NextResponse.json({ 
            message: 'Internal Error', 
            error: envHint,
        }, { status: 500 });
    }
}
