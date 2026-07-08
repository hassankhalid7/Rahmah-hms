import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { organizations } from '@/db/schema';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        // Test database connection
        const orgs = await db.select().from(organizations).limit(5);
        
        return NextResponse.json({
            status: 'ok',
            database: 'connected',
            organizationsCount: orgs.length,
            organizations: orgs.map(o => ({
                id: o.id,
                name: o.name,
                slug: o.slug,
            })),
            timestamp: new Date().toISOString(),
            env: {
                hasDatabaseUrl: !!process.env.DATABASE_URL,
                nodeEnv: process.env.NODE_ENV,
            }
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            database: 'disconnected',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
            env: {
                hasDatabaseUrl: !!process.env.DATABASE_URL,
                nodeEnv: process.env.NODE_ENV,
            }
        }, { status: 500 });
    }
}