import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { supabase } from '@/lib/supabase/client';

// POST /api/auth/register-institute - Create new institute with admin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      institute_name, 
      institute_slug, 
      admin_email, 
      admin_password,
      admin_first_name,
      admin_last_name,
      admin_phone 
    } = body;

    // Validation
    if (!institute_name || !institute_slug || !admin_email || !admin_password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 1. Create institute
    const { data: institute, error: instituteError } = await supabaseAdmin
      .from('institutes')
      .insert({
        name: institute_name,
        slug: institute_slug,
        email: admin_email,
      })
      .select()
      .single();

    if (instituteError) {
      return NextResponse.json(
        { error: 'Failed to create institute', details: instituteError.message },
        { status: 500 }
      );
    }

    // 2. Create auth user
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: admin_email,
      password: admin_password,
      email_confirm: true,
    });

    if (authError) {
      // Rollback institute creation
      await supabaseAdmin.from('institutes').delete().eq('id', institute.id);
      return NextResponse.json(
        { error: 'Failed to create user', details: authError.message },
        { status: 500 }
      );
    }

    // 3. Create profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authUser.user.id,
        institute_id: institute.id,
        first_name: admin_first_name || 'Admin',
        last_name: admin_last_name || 'User',
        phone: admin_phone,
        role: 'admin',
      })
      .select()
      .single();

    if (profileError) {
      // Rollback
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      await supabaseAdmin.from('institutes').delete().eq('id', institute.id);
      return NextResponse.json(
        { error: 'Failed to create profile', details: profileError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Institute created successfully',
      institute: {
        id: institute.id,
        name: institute.name,
        slug: institute.slug,
      },
      admin: {
        id: authUser.user.id,
        email: admin_email,
        role: 'admin',
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Register institute error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
