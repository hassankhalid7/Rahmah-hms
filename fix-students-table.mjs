import postgres from 'postgres';

const connectionString = "postgresql://postgres.pshmvaeogdhehpiydtrt:Swwsskarg4%40@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres";
const sql = postgres(connectionString);

async function main() {
  try {
    console.log("Updating students table...");
    
    // Add date_of_birth
    console.log("Adding date_of_birth...");
    await sql`ALTER TABLE students ADD COLUMN IF NOT EXISTS date_of_birth date;`;
    
    // Add guardian_id
    console.log("Adding guardian_id...");
    await sql`ALTER TABLE students ADD COLUMN IF NOT EXISTS guardian_id uuid REFERENCES users(id);`;
    
    // Add metadata
    console.log("Adding metadata...");
    await sql`ALTER TABLE students ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;`;
    
    // Change admission_date from text to date if it's text
    console.log("Checking admission_date type...");
    const columns = await sql`
      SELECT data_type 
      FROM information_schema.columns 
      WHERE table_name = 'students' AND column_name = 'admission_date';
    `;
    
    if (columns.length > 0 && columns[0].data_type === 'text') {
        console.log("Converting admission_date to date...");
        await sql`ALTER TABLE students ALTER COLUMN admission_date TYPE date USING admission_date::date;`;
    }

    console.log("Students table updated successfully!");
  } catch (err) {
    console.error("Error updating students table:", err);
  } finally {
    process.exit(0);
  }
}

main();
