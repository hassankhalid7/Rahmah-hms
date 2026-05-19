import postgres from 'postgres';

const connectionString = "postgresql://postgres.pshmvaeogdhehpiydtrt:Swwsskarg4%40@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres";
const sql = postgres(connectionString);

async function main() {
  try {
    const result = await sql`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_name = 'organizations';
    `;
    console.log("Tables:", result);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    process.exit(0);
  }
}

main();
