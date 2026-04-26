import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

// GET /api/attendance - Get attendance records
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const institute_id = searchParams.get('institute_id');
    const class_id = searchParams.get('class_id');
    const student_id = searchParams.get('student_id');
    const date = searchParams.get('date');
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');
    
    if (!institute_id) {
      return NextResponse.json(
        { error: 'institute_id is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('attendance')
      .select(`
        *,
        student:student_id(first_name, last_name, registration_number),
        class:class_id(name),
        marked_by_profile:marked_by(first_name, last_name)
      `)
      .eq('institute_id', institute_id);

    if (class_id) query = query.eq('class_id', class_id);
    if (student_id) query = query.eq('student_id', student_id);
    if (date) query = query.eq('date', date);
    if (start_date) query = query.gte('date', start_date);
    if (end_date) query = query.lte('date', end_date);

    query = query.order('date', { ascending: false });

    const { data: attendance, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch attendance', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ attendance: attendance || [] });

  } catch (error) {
    console.error('Get attendance error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/attendance/mark - Mark attendance (bulk or single)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      institute_id,
      class_id,
      date,
      attendance_records, // Array of { student_id, status, notes }
      marked_by,
    } = body;

    if (!institute_id || !date || !attendance_records || !Array.isArray(attendance_records)) {
      return NextResponse.json(
        { error: 'Missing required fields: institute_id, date, attendance_records' },
        { status: 400 }
      );
    }

    // Prepare records
    const records = attendance_records.map((record: any) => ({
      institute_id,
      class_id,
      date,
      student_id: record.student_id,
      status: record.status, // 'present', 'absent', 'late', 'excused'
      notes: record.notes || null,
      marked_by,
    }));

    // Upsert attendance (insert or update if exists)
    const { data, error } = await supabase
      .from('attendance')
      .upsert(records, {
        onConflict: 'student_id,date',
        ignoreDuplicates: false,
      })
      .select();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to mark attendance', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Attendance marked successfully',
      records: data,
    }, { status: 201 });

  } catch (error) {
    console.error('Mark attendance error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
