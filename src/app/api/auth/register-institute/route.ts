import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';

// POST /api/auth/register-institute - Create new institute with admin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      firstName, 
      lastName, 
      email, 
      phone,
      role
    } = body;

    // This is for student/teacher interest registration
    const [newUser] = await db.insert(users).values({
      firstName,
      lastName,
      email: email || null,
      phone: phone || null,
      role: role || 'student',
      status: 'pending'
    }).returning();

    return NextResponse.json({
      message: 'Registration successful',
      user: newUser
    }, { status: 201 });

  } catch (error) {
    console.error('Register institute error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
