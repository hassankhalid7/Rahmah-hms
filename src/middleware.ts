import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { isDemoMode } from './lib/auth-constants';

const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhooks(.*)',
]);

const clerk = clerkMiddleware(async (auth, request) => {
    if (isDemoMode) {
        return; // Bypass all protection in demo mode
    }

    if (!isPublicRoute(request)) {
        await auth.protect();
    }
});

export default function middleware(request: any, event: any) {
    if (isDemoMode) {
        return;
    }

    return clerk(request, event);
}

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
