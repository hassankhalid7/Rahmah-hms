import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

// GET /api/fees/invoices - Get invoices with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const institute_id = searchParams.get('institute_id');
    const student_id = searchParams.get('student_id');
    const status = searchParams.get('status');
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const due_only = searchParams.get('due_only') === 'true';
    
    if (!institute_id) {
      return NextResponse.json(
        { error: 'institute_id is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('invoices')
      .select(`
        *,
        student:student_id(first_name, last_name, registration_number),
        payments!left(amount)
      `)
      .eq('institute_id', institute_id);

    if (student_id) query = query.eq('student_id', student_id);
    if (status) query = query.eq('status', status);
    if (month) query = query.eq('month', parseInt(month));
    if (year) query = query.eq('year', parseInt(year));
    
    if (due_only) {
      query = query.in('status', ['pending', 'partial', 'overdue']);
    }

    query = query.order('created_at', { ascending: false });

    const { data: invoices, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch invoices', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ invoices: invoices || [] });

  } catch (error) {
    console.error('Get invoices error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/fees/invoices - Generate new invoice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      institute_id,
      student_id,
      month,
      year,
      fee_structure_id,
      discount_amount = 0,
      due_date,
      notes,
    } = body;

    if (!institute_id || !student_id || !month || !year) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get fee amount from fee structure or use default
    let total_amount = 0;
    if (fee_structure_id) {
      const { data: feeStructure } = await supabase
        .from('fee_structures')
        .select('amount')
        .eq('id', fee_structure_id)
        .single();
      
      if (feeStructure) {
        total_amount = feeStructure.amount;
      }
    }

    // Generate invoice number
    const invoice_number = `INV-${year}${month.toString().padStart(2, '0')}-${student_id.slice(0, 8)}`;

    const final_amount = total_amount - discount_amount;

    const { data: invoice, error } = await supabase
      .from('invoices')
      .insert({
        institute_id,
        student_id,
        invoice_number,
        month,
        year,
        total_amount,
        discount_amount,
        final_amount,
        paid_amount: 0,
        status: 'pending',
        due_date,
        notes,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create invoice', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Invoice created successfully',
      invoice,
    }, { status: 201 });

  } catch (error) {
    console.error('Create invoice error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
