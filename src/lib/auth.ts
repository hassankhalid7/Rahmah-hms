import { currentUser as clerkCurrentUser, auth as clerkAuth } from '@clerk/nextjs/server';
import { isDemoMode } from './auth-constants';

export { isDemoMode };

/**
 * A helper to provide either real Clerk auth or mock auth for Demo Mode.
 * This prevents the app from crashing when API keys are missing.
 */
export async function getAuth() {
    if (isDemoMode) {
        return {
            userId: 'demo_user_123',
            orgId: 'demo_org_123',
            role: 'institute_admin', // Default to admin for demo
            isDemo: true,
        };
    }

    const { userId, sessionClaims } = await clerkAuth();
    return {
        userId,
        role: (sessionClaims?.metadata as any)?.role || 'student',
        isDemo: false,
    };
}

export async function getCurrentUser() {
    if (isDemoMode) {
        return {
            id: 'demo_user_123',
            firstName: 'Demo',
            lastName: 'User',
            emailAddresses: [{ emailAddress: 'demo@rahmah.app' }],
            publicMetadata: { role: 'institute_admin' },
            isDemo: true,
        };
    }

    return await clerkCurrentUser();
}
