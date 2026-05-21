import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { payments, invoices, students, users } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';

// POST /api/fees/payments - Record a payment
export async function POST(request: NextRequest) {
  try {
    const { userId: currentUserId, orgId } = await getAuth();
    if (!orgId) return new NextResponse('Unauthorized', { status: 401 });

    const body = await request.json();
    const {
      invoice_id,
      student_id,
      amount,
      payment_method,
      payment_date,
      reference_number,
      notes,
    } = body;

    if (!invoice_id || !student_id || !amount) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Record payment in transaction
    const result = await db.transaction(async (tx) => {
      const [payment] = await tx
        .insert(payments)
        .values({
          organizationId: orgId,
          invoiceId: invoice_id,
          studentId: student_id,
          amount: String(amount),
          paymentMethod: payment_method,
          paymentDate: payment_date ? new Date(payment_date) : new Date(),
          referenceNumber: reference_number,
          notes,
          receivedBy: currentUserId,
        })
        .returning();

      // Update invoice
      const invoice = await tx.query.invoices.findFirst({
        where: eq(invoices.id, invoice_id)
      });

      if (invoice) {
        const newPaidAmount = Number(invoice.paidAmount || 0) + Number(amount);
        let newStatus = 'partial';
        if (newPaidAmount >= Number(invoice.finalAmount)) {
          newStatus = 'paid';
        }

        await tx.update(invoices)
          .set({
            paidAmount: String(newPaidAmount),
            status: newStatus,
            updatedAt: new Date(),
          })
          .where(eq(invoices.id, invoice_id));
      }

      return payment;
    });

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error('[PAYMENTS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// GET /api/fees/payments - Get payment history
export async function GET(request: NextRequest) {
  try {
    const { orgId } = await getAuth();
    if (!orgId) return new NextResponse('Unauthorized', { status: 401 });

    const { searchParams } = new URL(request.url);
    const student_id = searchParams.get('student_id');
    const invoice_id = searchParams.get('invoice_id');
    
    const data = await db
      .select({
        id: payments.id,
        amount: payments.amount,
        paymentMethod: payments.paymentMethod,
        paymentDate: payments.paymentDate,
        referenceNumber: payments.referenceNumber,
        invoiceNumber: invoices.invoiceNumber,
        studentName: users.firstName,
        studentLastName: users.lastName,
      })
      .from(payments)
      .innerJoin(invoices, eq(payments.invoiceId, invoices.id))
      .innerJoin(students, eq(payments.studentId, students.id))
      .innerJoin(users, eq(students.userId, users.id))
      .where(
        and(
          eq(payments.organizationId, orgId),
          student_id ? eq(payments.studentId, student_id) : undefined,
          invoice_id ? eq(payments.invoiceId, invoice_id) : undefined,
        )
      )
      .orderBy(desc(payments.paymentDate));

    return NextResponse.json({ payments: data });

  } catch (error) {
    console.error('[PAYMENTS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
