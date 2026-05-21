import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

// GET /api/hifz/sessions - Get Hifz sessions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const institute_id = searchParams.get('institute_id');
    const student_id = searchParams.get('student_id');
    const teacher_id = searchParams.get('teacher_id');
    const class_id = searchParams.get('class_id');
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');
    
    if (!institute_id) {
      return NextResponse.json(
        { error: 'institute_id is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('hifz_sessions')
      .select(`
        *,
        student:student_id(first_name, last_name, registration_number),
        teacher:teacher_id(first_name, last_name),
        class:class_id(name)
      `)
      .eq('institute_id', institute_id);

    if (student_id) query = query.eq('student_id', student_id);
    if (teacher_id) query = query.eq('teacher_id', teacher_id);
    if (class_id) query = query.eq('class_id', class_id);
    if (start_date) query = query.gte('session_date', start_date);
    if (end_date) query = query.lte('session_date', end_date);

    query = query.order('session_date', { ascending: false });

    const { data: sessions, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch Hifz sessions', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ sessions: sessions || [] });

  } catch (error) {
    console.error('Get Hifz sessions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/hifz/sessions - Create new Hifz session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      institute_id,
      student_id,
      teacher_id,
      class_id,
      session_date,
      // Sabq (current lesson)
      sabq_from_surah,
      sabq_from_ayah,
      sabq_to_surah,
      sabq_to_ayah,
      // Sabqi (revision)
      sabqi_from_surah,
      sabqi_from_ayah,
      sabqi_to_surah,
      sabqi_to_ayah,
      // Manzil (old revision)
      manzil_from_surah,
      manzil_from_ayah,
      manzil_to_surah,
      manzil_to_ayah,
      // Quality
      quality_score,
      mistakes_count,
      notes,
    } = body;

    if (!institute_id || !student_id) {
      return NextResponse.json(
        { error: 'institute_id and student_id are required' },
        { status: 400 }
      );
    }

    const { data: session, error } = await supabase
      .from('hifz_sessions')
      .insert({
        institute_id,
        student_id,
        teacher_id,
        class_id,
        session_date: session_date || new Date().toISOString().split('T')[0],
        sabq_from_surah,
        sabq_from_ayah,
        sabq_to_surah,
        sabq_to_ayah,
        sabqi_from_surah,
        sabqi_from_ayah,
        sabqi_to_surah,
        sabqi_to_ayah,
        manzil_from_surah,
        manzil_from_ayah,
        manzil_to_surah,
        manzil_to_ayah,
        quality_score,
        mistakes_count,
        notes,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create Hifz session', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Hifz session recorded successfully',
      session,
    }, { status: 201 });

  } catch (error) {
    console.error('Create Hifz session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
