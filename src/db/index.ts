import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

// Database connection
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

// Optimized Connection for Supabase Pooler
export const client = postgres(connectionString, { 
    prepare: false,
    max: 1, // Limited connections for serverless
    idle_timeout: 20,
    connect_timeout: 10,
});

export const db = drizzle(client, { schema });

// Export schema
export { schema };
