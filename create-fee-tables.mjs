import postgres from 'postgres';

const connectionString = "postgresql://postgres.pshmvaeogdhehpiydtrt:Swwsskarg4%40@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres";
const sql = postgres(connectionString);

async function main() {
  try {
    console.log("Creating fee management tables in Supabase...");

    // 1. fee_structures
    await sql`
      CREATE TABLE IF NOT EXISTS fee_structures (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id UUID NOT NULL REFERENCES organizations(id),
        name TEXT NOT NULL,
        description TEXT,
        amount NUMERIC(10, 2) NOT NULL,
        frequency TEXT NOT NULL DEFAULT 'monthly',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `;
    console.log("- fee_structures table created.");

    // 2. invoices
    await sql`
      CREATE TABLE IF NOT EXISTS invoices (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id UUID NOT NULL REFERENCES organizations(id),
        student_id UUID NOT NULL REFERENCES students(id),
        fee_structure_id UUID REFERENCES fee_structures(id),
        invoice_number TEXT NOT NULL,
        month INTEGER,
        year INTEGER,
        amount NUMERIC(10, 2) NOT NULL,
        discount_amount NUMERIC(10, 2) DEFAULT 0,
        final_amount NUMERIC(10, 2) NOT NULL,
        paid_amount NUMERIC(10, 2) DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'pending',
        due_date TIMESTAMP WITH TIME ZONE,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `;
    console.log("- invoices table created.");

    // 3. payments
    await sql`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id UUID NOT NULL REFERENCES organizations(id),
        invoice_id UUID NOT NULL REFERENCES invoices(id),
        student_id UUID NOT NULL REFERENCES students(id),
        amount NUMERIC(10, 2) NOT NULL,
        payment_method TEXT,
        payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        reference_number TEXT,
        notes TEXT,
        received_by UUID,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `;
    console.log("- payments table created.");

    console.log("All fee management tables created successfully!");
  } catch (err) {
    console.error("Error creating tables:", err);
  } finally {
    process.exit(0);
  }
}

main();
