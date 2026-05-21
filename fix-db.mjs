import postgres from 'postgres';

const connectionString = "postgresql://postgres.pshmvaeogdhehpiydtrt:Swwsskarg4%40@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres";
const sql = postgres(connectionString);

async function main() {
  try {
    console.log("Adding logo_url...");
    await sql`ALTER TABLE organizations ADD COLUMN IF NOT EXISTS logo_url text;`;
    
    console.log("Adding address...");
    await sql`ALTER TABLE organizations ADD COLUMN IF NOT EXISTS address text;`;
    
    console.log("Adding phone...");
    await sql`ALTER TABLE organizations ADD COLUMN IF NOT EXISTS phone text;`;
    
    console.log("Adding email...");
    await sql`ALTER TABLE organizations ADD COLUMN IF NOT EXISTS email text;`;
    
    console.log("Adding metadata...");
    await sql`ALTER TABLE organizations ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;`;
    
    console.log("Database schema updated successfully!");
  } catch (err) {
    console.error("Error updating schema:", err);
  } finally {
    process.exit(0);
  }
}

main();
