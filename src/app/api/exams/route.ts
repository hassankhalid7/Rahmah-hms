import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { isDemoMode } from '@/lib/auth';

// GET /api/exams - List exams
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const institute_id = searchParams.get('institute_id');
    const class_id = searchParams.get('class_id');
    const exam_type = searchParams.get('exam_type');

    if (isDemoMode) {
      return NextResponse.json({
        exams: [
          { id: '1', name: 'Monthly Hifz Assessment', type: 'Monthly', date: 'Feb 28, 2026', status: 'Scheduled', students: 45, class: { name: 'Halaqa Zaid' } },
          { id: '2', name: 'Nazra Para 1-5 Final', type: 'Final', date: 'Mar 15, 2026', status: 'Draft', students: 28, class: { name: 'Halaqa Abu Bakr' } },
          { id: '3', name: 'Qaida Completion Test', type: 'Certification', date: 'Feb 10, 2026', status: 'Completed', students: 12, class: { name: 'Noorani Group' } },
        ]
      });
    }

    if (!institute_id) {
      return NextResponse.json(
        { error: 'institute_id is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('exams')
      .select(`
        *,
        class:class_id(name),
        marks!left(student_id, marks_obtained)
      `)
      .eq('institute_id', institute_id);

    if (class_id) query = query.eq('class_id', class_id);
    if (exam_type) query = query.eq('exam_type', exam_type);

    query = query.order('exam_date', { ascending: false });

    const { data: exams, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch exams', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ exams: exams || [] });

  } catch (error) {
    console.error('Get exams error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/exams - Create new exam
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      institute_id,
      class_id,
      name,
      exam_type,
      subject,
      total_marks,
      passing_marks,
      exam_date,
    } = body;

    if (!institute_id || !name || !total_marks) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data: exam, error } = await supabase
      .from('exams')
      .insert({
        institute_id,
        class_id,
        name,
        exam_type,
        subject,
        total_marks,
        passing_marks,
        exam_date,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create exam', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Exam created successfully',
      exam,
    }, { status: 201 });

  } catch (error) {
    console.error('Create exam error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
