import { cookies } from 'next/headers';
import { isDemoMode } from './auth-constants';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export { isDemoMode };

/**
 * A helper to provide either custom session auth or mock auth for Demo Mode.
 */
export async function getAuth() {
    if (isDemoMode) {
        return {
            userId: 'demo_user_123',
            orgId: 'demo_org_123',
            role: 'institute_admin',
            isDemo: true,
        };
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
        return {
            userId: null,
            role: null,
            isDemo: false,
        };
    }

    try {
        const session = JSON.parse(sessionCookie.value);
        return {
            userId: session.userId,
            orgId: session.organizationId,
            role: session.role || 'student',
            isDemo: false,
        };
    } catch (e) {
        return {
            userId: null,
            role: null,
            isDemo: false,
        };
    }
}

export async function getCurrentUser() {
    const auth = await getAuth();
    
    if (!auth.userId) return null;

    if (auth.isDemo) {
        return {
            id: auth.userId,
            firstName: 'Demo',
            lastName: 'User',
            email: 'demo@rahmah.app',
            role: auth.role,
            isDemo: true,
        };
    }

    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, auth.userId))
        .limit(1);

    if (!user) return null;

    return {
        ...user,
        isDemo: false,
    };
}
