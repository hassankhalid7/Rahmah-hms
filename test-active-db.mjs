import postgres from 'postgres';

const connectionString = "postgresql://postgres:Swwsskarg4%40@db.xjpciylnrdeznwerahmd.supabase.co:5432/postgres";
const sql = postgres(connectionString);

async function main() {
  try {
    console.log("Connecting to active database...");
    const slug = 'asdasd';
    // Run the exact query from the error report
    const result = await sql`
      select "id", "name", "slug", "logo_url", "address", "phone", "email", "metadata", "created_at", "updated_at" 
      from "organizations" 
      where "organizations"."slug" = ${slug} 
      limit 1
    `;
    console.log("Success! Query result:", result);
  } catch (err) {
    console.error("Error executing query:");
    console.error(err);
    if (err.cause) {
      console.error("Cause:", err.cause);
    }
  } finally {
    await sql.end();
    process.exit(0);
  }
}

main();
