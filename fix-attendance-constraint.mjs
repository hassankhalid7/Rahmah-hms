import postgres from 'postgres';

const connectionString = "postgresql://postgres.pshmvaeogdhehpiydtrt:Swwsskarg4%40@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres";
const sql = postgres(connectionString);

async function main() {
  try {
    console.log("Adding unique constraint to attendance table...");
    // First, remove duplicates if any (keep only the latest)
    await sql`
      DELETE FROM attendance a
      WHERE a.id NOT IN (
        SELECT id
        FROM (
          SELECT id, ROW_NUMBER() OVER (PARTITION BY organization_id, user_id, date ORDER BY created_at DESC) as rn
          FROM attendance
        ) t
        WHERE t.rn = 1
      );
    `;
    
    // Add unique constraint
    await sql`
      ALTER TABLE attendance 
      ADD CONSTRAINT attendance_user_date_org_unique UNIQUE (organization_id, user_id, date);
    `;
    
    console.log("Constraint added successfully!");
  } catch (err) {
    console.error("Error adding constraint:", err);
  } finally {
    process.exit(0);
  }
}

main();
