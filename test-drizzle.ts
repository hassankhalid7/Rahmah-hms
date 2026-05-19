import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './src/db/schema/index';
import { eq } from 'drizzle-orm';

const connectionString = "postgresql://postgres.pshmvaeogdhehpiydtrt:Swwsskarg4%40@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres";

const client = postgres(connectionString, { 
    prepare: false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
});

const db = drizzle(client, { schema });

async function main() {
    try {
        console.log("Testing query with drizzle...");
        const result = await db.select().from(schema.organizations).where(eq(schema.organizations.slug, "jj")).limit(1);
        console.log("Success:", result);
    } catch (err) {
        console.error("Error:", err);
    } finally {
        process.exit(0);
    }
}

main();
