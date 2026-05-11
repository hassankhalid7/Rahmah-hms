import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { organizations } from '@/db/schema';
import { ilike, or } from 'drizzle-orm';
import { isDemoMode } from '@/lib/auth-constants';
import { getMockOrganizations } from '@/lib/mock-db';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q') || '';

        let searchResults;

        if (!query) {
            // Return all organizations when no search query
            searchResults = await db
                .select({
                    id: organizations.id,
                    name: organizations.name,
                    address: organizations.address,
                    phone: organizations.phone,
                    email: organizations.email,
                    logoUrl: organizations.logoUrl,
                })
                .from(organizations)
                .orderBy(organizations.name)
                .limit(20);
        } else {
            // Search organizations by name, address, or phone
            searchResults = await db
                .select({
                    id: organizations.id,
                    name: organizations.name,
                    address: organizations.address,
                    phone: organizations.phone,
                    email: organizations.email,
                    logoUrl: organizations.logoUrl,
                })
                .from(organizations)
                .where(
                    or(
                        ilike(organizations.name, `%${query}%`),
                        ilike(organizations.address, `%${query}%`),
                        ilike(organizations.phone, `%${query}%`)
                    )
                )
                .limit(10);
        }

        return NextResponse.json({
            organizations: searchResults,
            total: searchResults.length
        });

    } catch (error) {
        console.error('[ORGANIZATIONS_SEARCH_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}