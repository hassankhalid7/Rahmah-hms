const postgres = require('postgres');

const connectionString = "postgresql://postgres:Swwsskarg4%40@db.xjpciylnrdeznwerahmd.supabase.co:5432/postgres?sslmode=require";
const sql = postgres(connectionString);

async function test() {
    try {
        console.log("Connecting...");
        const result = await sql`SELECT 1 as connected`;
        console.log("Success:", result);
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

test();
