import postgres from 'postgres';

const connectionString = "postgresql://postgres.pshmvaeogdhehpiydtrt:Swwsskarg4%40@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres";
const sql = postgres(connectionString);

async function main() {
  try {
    const result = await sql`SELECT id, first_name, email, role, organization_id FROM users;`;
    console.log("Users in DB:", result);
    
    const orgs = await sql`SELECT id, name FROM organizations;`;
    console.log("Orgs in DB:", orgs);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    process.exit(0);
  }
}

main();
