import postgres from 'postgres';

const connectionString = "postgresql://postgres.pshmvaeogdhehpiydtrt:Swwsskarg4%40@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres";
const sql = postgres(connectionString);

async function main() {
  try {
    const slug = 'jj';
    const result = await sql`select "id", "name", "slug", "logo_url", "address", "phone", "email", "metadata", "created_at", "updated_at" from "organizations" where "organizations"."slug" = ${slug} limit 1`;
    console.log("Success:", result);
  } catch (err) {
    console.error("Error executing query:", err);
  } finally {
    process.exit(0);
  }
}

main();
