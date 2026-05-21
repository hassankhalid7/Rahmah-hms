import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { invoices, students, users, payments, feeStructures } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';

// GET /api/fees/invoices - Get invoices with filters
export async function GET(request: NextRequest) {
  try {
    const { orgId } = await getAuth();
    if (!orgId) return new NextResponse('Unauthorized', { status: 401 });

    const { searchParams } = new URL(request.url);
    const student_id = searchParams.get('student_id');
    const status = searchParams.get('status');
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    
    const data = await db
      .select({
        id: invoices.id,
        invoiceNumber: invoices.invoiceNumber,
        amount: invoices.amount,
        finalAmount: invoices.finalAmount,
        paidAmount: invoices.paidAmount,
        status: invoices.status,
        month: invoices.month,
        year: invoices.year,
        dueDate: invoices.dueDate,
        studentName: users.firstName,
        studentLastName: users.lastName,
      })
      .from(invoices)
      .innerJoin(students, eq(invoices.studentId, students.id))
      .innerJoin(users, eq(students.userId, users.id))
      .where(
        and(
          eq(invoices.organizationId, orgId),
          student_id ? eq(invoices.studentId, student_id) : undefined,
          status ? eq(invoices.status, status) : undefined,
          month ? eq(invoices.month, parseInt(month)) : undefined,
          year ? eq(invoices.year, parseInt(year)) : undefined,
        )
      )
      .orderBy(desc(invoices.createdAt));

    return NextResponse.json({ invoices: data });

  } catch (error) {
    console.error('[INVOICES_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// POST /api/fees/invoices - Generate new invoice
export async function POST(request: NextRequest) {
  try {
    const { orgId } = await getAuth();
    if (!orgId) return new NextResponse('Unauthorized', { status: 401 });

    const body = await request.json();
    const {
      student_id,
      month,
      year,
      fee_structure_id,
      discount_amount = 0,
      due_date,
      notes,
    } = body;

    if (!student_id || !month || !year) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Get fee amount
    let amount = 0;
    if (fee_structure_id) {
      const fee = await db.query.feeStructures.findFirst({
        where: eq(feeStructures.id, fee_structure_id)
      });
      if (fee) amount = Number(fee.amount);
    }

    const finalAmount = amount - Number(discount_amount);
    const invoice_number = `INV-${year}${String(month).padStart(2, '0')}-${student_id.slice(0, 5)}`;

    const [newInvoice] = await db
      .insert(invoices)
      .values({
        organizationId: orgId,
        studentId: student_id,
        feeStructureId: fee_structure_id,
        invoiceNumber: invoice_number,
        month: parseInt(month),
        year: parseInt(year),
        amount: String(amount),
        discountAmount: String(discount_amount),
        finalAmount: String(finalAmount),
        paidAmount: '0',
        status: 'pending',
        dueDate: due_date ? new Date(due_date) : null,
        notes,
      })
      .returning();

    return NextResponse.json(newInvoice);

  } catch (error) {
    console.error('[INVOICES_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
