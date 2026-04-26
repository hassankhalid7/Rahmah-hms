import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

// POST /api/fees/payments - Record a payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      institute_id,
      invoice_id,
      student_id,
      amount,
      payment_method,
      payment_date,
      reference_number,
      notes,
      received_by,
    } = body;

    if (!institute_id || !invoice_id || !student_id || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Record payment
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        institute_id,
        invoice_id,
        student_id,
        amount,
        payment_method,
        payment_date: payment_date || new Date().toISOString().split('T')[0],
        reference_number,
        notes,
        received_by,
      })
      .select()
      .single();

    if (paymentError) {
      return NextResponse.json(
        { error: 'Failed to record payment', details: paymentError.message },
        { status: 500 }
      );
    }

    // Update invoice paid amount and status
    const { data: invoice } = await supabase
      .from('invoices')
      .select('paid_amount, final_amount')
      .eq('id', invoice_id)
      .single();

    if (invoice) {
      const newPaidAmount = (invoice.paid_amount || 0) + amount;
      let newStatus = 'partial';
      
      if (newPaidAmount >= invoice.final_amount) {
        newStatus = 'paid';
      }

      await supabase
        .from('invoices')
        .update({
          paid_amount: newPaidAmount,
          status: newStatus,
        })
        .eq('id', invoice_id);
    }

    return NextResponse.json({
      message: 'Payment recorded successfully',
      payment,
    }, { status: 201 });

  } catch (error) {
    console.error('Record payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/fees/payments - Get payment history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const institute_id = searchParams.get('institute_id');
    const student_id = searchParams.get('student_id');
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');
    
    if (!institute_id) {
      return NextResponse.json(
        { error: 'institute_id is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('payments')
      .select(`
        *,
        student:student_id(first_name, last_name, registration_number),
        invoice:invoice_id(invoice_number, month, year),
        received_by_profile:received_by(first_name, last_name)
      `)
      .eq('institute_id', institute_id);

    if (student_id) query = query.eq('student_id', student_id);
    if (start_date) query = query.gte('payment_date', start_date);
    if (end_date) query = query.lte('payment_date', end_date);

    query = query.order('payment_date', { ascending: false });

    const { data: payments, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch payments', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ payments: payments || [] });

  } catch (error) {
    console.error('Get payments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
