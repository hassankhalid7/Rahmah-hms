import postgres from 'postgres';

const connectionString = "postgresql://postgres.pshmvaeogdhehpiydtrt:Swwsskarg4%40@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres";
const sql = postgres(connectionString);

async function main() {
  try {
    console.log("Checking organizations table columns...");
    const columns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'organizations';
    `;
    console.log("Columns found:", columns);

    // If logo_url is missing, add it
    const hasLogoUrl = columns.some(c => c.column_name === 'logo_url');
    if (!hasLogoUrl) {
      console.log("Adding logo_url column...");
      await sql`ALTER TABLE organizations ADD COLUMN IF NOT EXISTS logo_url TEXT;`;
    }

    // If updated_at is missing, add it
    const hasUpdatedAt = columns.some(c => c.column_name === 'updated_at');
    if (!hasUpdatedAt) {
      console.log("Adding updated_at column...");
      await sql`ALTER TABLE organizations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL;`;
    }

    console.log("Database structure verification complete!");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    process.exit(0);
  }
}

main();
