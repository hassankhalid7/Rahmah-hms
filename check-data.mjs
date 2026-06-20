import postgres from 'postgres';

const DATABASE_URL = 'postgresql://postgres.pshmvaeogdhehpiydtrt:Swwsskarg4%40@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres';
const sql = postgres(DATABASE_URL, { prepare: false });

async function checkData() {
  console.log('📋 Checking organizations...');
  const orgs = await sql`SELECT id, name, slug, created_at FROM organizations ORDER BY created_at DESC;`;
  console.log('Organizations:', JSON.stringify(orgs, null, 2));

  console.log('\n📋 Checking users...');
  const users = await sql`SELECT id, first_name, last_name, email, phone, role, status, organization_id FROM users ORDER BY created_at DESC LIMIT 10;`;
  console.log('Users:', JSON.stringify(users, null, 2));

  await sql.end();
}

checkData().catch(console.error);
