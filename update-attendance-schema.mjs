import postgres from 'postgres';

const connectionString = "postgresql://postgres.pshmvaeogdhehpiydtrt:Swwsskarg4%40@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres";
const sql = postgres(connectionString);

async function main() {
  try {
    console.log("Adding class_id to attendance table...");
    
    // Add class_id column
    await sql`ALTER TABLE attendance ADD COLUMN IF NOT EXISTS class_id uuid REFERENCES classes(id);`;
    
    // Drop old unique constraint
    await sql`ALTER TABLE attendance DROP CONSTRAINT IF EXISTS attendance_user_date_org_unique;`;
    
    // Add new unique constraint including class_id
    await sql`
      ALTER TABLE attendance 
      ADD CONSTRAINT attendance_user_date_org_class_unique UNIQUE (organization_id, user_id, date, class_id);
    `;
    
    console.log("Database updated successfully!");
  } catch (err) {
    console.error("Error updating database:", err);
  } finally {
    process.exit(0);
  }
}

main();
