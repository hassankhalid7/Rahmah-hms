import postgres from 'postgres';

const connectionString = "postgresql://postgres.pshmvaeogdhehpiydtrt:Swwsskarg4%40@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres";
const sql = postgres(connectionString);

async function main() {
  try {
    console.log("Fixing daily_progress table...");
    
    // Rename tenant_id to organization_id if it exists
    await sql`
      DO $$ 
      BEGIN 
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'daily_progress' AND column_name = 'tenant_id') THEN
          ALTER TABLE daily_progress RENAME COLUMN tenant_id TO organization_id;
        END IF;
      END $$;
    `;

    // Ensure admission_date in students is date
    await sql`
      ALTER TABLE students ALTER COLUMN admission_date TYPE date USING admission_date::date;
    `;

    console.log("Database updated successfully!");
  } catch (err) {
    console.error("Error updating database:", err);
  } finally {
    process.exit(0);
  }
}

main();
