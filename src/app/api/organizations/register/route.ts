import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { organizations, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';
import { isDemoMode } from '@/lib/auth-constants';
import { addMockOrganization, getMockOrganizations } from '@/lib/mock-db';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, address, phone, email } = body;

        const { userId } = await getAuth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Validate required fields
        if (!name || !address || !phone) {
            return new NextResponse('Name, address, and phone are required', { status: 400 });
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
            return new NextResponse('An organization with this name already exists', { status: 400 });
        }

        // Create organization
        const [newOrganization] = await db
            .insert(organizations)
            .values({
                name,
                slug,
                address,
                phone,
                email: email || null,
            })
            .returning();

        // Update user to be admin of this organization
        await db
            .update(users)
            .set({
                organizationId: newOrganization.id,
                role: 'institute_admin',
                status: 'active',
                updatedAt: new Date()
            })
            .where(eq(users.id, userId));

        return NextResponse.json({
            success: true,
            message: 'Organization registered successfully! You are now the admin.',
            organization: {
                id: newOrganization.id,
                name: newOrganization.name,
                slug: newOrganization.slug,
                address: newOrganization.address,
                phone: newOrganization.phone,
                email: newOrganization.email
            }
        });

    } catch (error) {
        console.error('[ORGANIZATIONS_REGISTER_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}