import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

// GET /api/teachers - List all teachers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const institute_id = searchParams.get('institute_id');
    const is_active = searchParams.get('is_active') || 'true';
    
    if (!institute_id) {
      return NextResponse.json(
        { error: 'institute_id is required' },
        { status: 400 }
      );
    }

    const { data: teachers, error } = await supabase
      .from('profiles')
      .select(`
        *,
        classes!left(id, name)
      `)
      .eq('institute_id', institute_id)
      .eq('role', 'teacher')
      .eq('is_active', is_active === 'true');

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch teachers', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ teachers: teachers || [] });

  } catch (error) {
    console.error('Get teachers error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/teachers - Add new teacher
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      institute_id,
      email,
      password,
      first_name,
      last_name,
      phone,
    } = body;

    if (!institute_id || !email || !password || !first_name || !last_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Note: In production, use supabaseAdmin for user creation
    // This is simplified for demonstration
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create teacher account', details: error.message },
        { status: 500 }
      );
    }

    // Create profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user!.id,
        institute_id,
        first_name,
        last_name,
        phone,
        role: 'teacher',
      })
      .select()
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: 'Failed to create teacher profile', details: profileError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Teacher created successfully',
      teacher: profile,
    }, { status: 201 });

  } catch (error) {
    console.error('Create teacher error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
