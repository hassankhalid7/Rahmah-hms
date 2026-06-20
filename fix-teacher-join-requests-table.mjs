import postgres from 'postgres';

const DATABASE_URL = 'postgresql://postgres.pshmvaeogdhehpiydtrt:Swwsskarg4%40@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres';

const sql = postgres(DATABASE_URL, { prepare: false });

async function fixDatabase() {
  console.log('🔧 Fixing database tables...\n');

  try {
    // 1. Check which tables exist
    const tables = await sql`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    console.log('📋 Existing tables:', tables.map(t => t.table_name).join(', '));

    // 2. Create teacher_join_requests table if missing
    await sql`
      CREATE TABLE IF NOT EXISTS "teacher_join_requests" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "teacher_user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "organization_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
        "message" text,
        "status" text NOT NULL DEFAULT 'pending',
        "reviewed_by" uuid REFERENCES "users"("id"),
        "reviewed_at" timestamp,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `;
    console.log('✅ teacher_join_requests table created/verified');

    // 3. Check join_requests table exists
    await sql`
      CREATE TABLE IF NOT EXISTS "join_requests" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "student_user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "organization_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
        "message" text,
        "status" text NOT NULL DEFAULT 'pending',
        "reviewed_by" uuid REFERENCES "users"("id"),
        "reviewed_at" timestamp,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `;
    console.log('✅ join_requests table created/verified');

    // 4. Check users table has password column
    const userCols = await sql`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'users' AND table_schema = 'public';
    `;
    const colNames = userCols.map(c => c.column_name);
    console.log('📋 Users columns:', colNames.join(', '));

    if (!colNames.includes('password')) {
      await sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password" text;`;
      console.log('✅ Added password column to users');
    }

    if (!colNames.includes('first_name')) {
      await sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "first_name" varchar(100);`;
      console.log('✅ Added first_name column to users');
    }

    if (!colNames.includes('last_name')) {
      await sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "last_name" varchar(100);`;
      console.log('✅ Added last_name column to users');
    }

    // 5. Final table list
    const finalTables = await sql`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    console.log('\n✅ Final tables:', finalTables.map(t => t.table_name).join(', '));
    console.log('\n🎉 Database fix complete!');

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await sql.end();
  }
}

fixDatabase();
