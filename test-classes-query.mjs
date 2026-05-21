import postgres from 'postgres';

const connectionString = "postgresql://postgres.pshmvaeogdhehpiydtrt:Swwsskarg4%40@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres";
const sql = postgres(connectionString);

async function main() {
  try {
    const orgId = '4a48975b-e424-4fbe-8b63-1b283306ca4a';
    console.log("Testing query for orgId:", orgId);
    
    const result = await sql`
      SELECT 
        c.id, c.name, c.description, c.teacher_id, 
        u.first_name as teacher_name, u.last_name as teacher_last_name
      FROM classes c
      LEFT JOIN teachers t ON c.teacher_id = t.id
      LEFT JOIN users u ON t.user_id = u.id
      WHERE c.organization_id = ${orgId}
    `;
    console.log("Query Result:", result);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    process.exit(0);
  }
}

main();
