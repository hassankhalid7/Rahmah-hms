import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';

const connectionString = "postgresql://postgres.pshmvaeogdhehpiydtrt:Swwsskarg4%40@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres";

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

const organizations = pgTable('organizations', {
    id: uuid('id').primaryKey(),
    slug: text('slug').notNull(),
});

async function main() {
    try {
        console.log("Testing with numeric string '12'...");
        const result = await db.select().from(organizations).where(eq(organizations.slug, "12")).limit(1);
        console.log("Success:", result);
    } catch (err) {
        console.error("Caught Error:", err);
    } finally {
        await client.end();
    }
}

main();
