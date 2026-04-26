const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export const isDemoMode = !publishableKey || 
                          publishableKey === 'your_publishable_key_here' || 
                          !publishableKey.startsWith('pk_');
