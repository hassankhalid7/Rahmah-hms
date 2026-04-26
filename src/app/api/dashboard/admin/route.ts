import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

// GET /api/dashboard/admin - Admin dashboard stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const institute_id = searchParams.get('institute_id');
    
    if (!institute_id) {
      return NextResponse.json(
        { error: 'institute_id is required' },
        { status: 400 }
      );
    }

    // Get stats in parallel
    const [
      studentsCount,
      teachersCount,
      classesCount,
      attendanceToday,
      feesDue,
      recentPayments,
    ] = await Promise.all([
      // Total students
      supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('institute_id', institute_id)
        .eq('status', 'active'),
      
      // Total teachers
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('institute_id', institute_id)
        .eq('role', 'teacher')
        .eq('is_active', true),
      
      // Total classes
      supabase
        .from('classes')
        .select('*', { count: 'exact', head: true })
        .eq('institute_id', institute_id)
        .eq('is_active', true),
      
      // Today's attendance
      supabase
        .from('attendance')
        .select('status')
        .eq('institute_id', institute_id)
        .eq('date', new Date().toISOString().split('T')[0]),
      
      // Fees due
      supabase
        .from('invoices')
        .select('final_amount, paid_amount')
        .eq('institute_id', institute_id)
        .in('status', ['pending', 'partial', 'overdue']),
      
      // Recent payments (last 7 days)
      supabase
        .from('payments')
        .select('amount')
        .eq('institute_id', institute_id)
        .gte('payment_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
    ]);

    // Calculate attendance percentage
    const attendanceRecords = attendanceToday.data || [];
    const totalMarked = attendanceRecords.length;
    const presentCount = attendanceRecords.filter((a: any) => a.status === 'present').length;
    const attendancePercentage = totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 0;

    // Calculate total fees due
    const feesDueRecords = feesDue.data || [];
    const totalFeesDue = feesDueRecords.reduce((sum: number, inv: any) => {
      return sum + (inv.final_amount - (inv.paid_amount || 0));
    }, 0);

    // Calculate weekly collection
    const recentPaymentsRecords = recentPayments.data || [];
    const weeklyCollection = recentPaymentsRecords.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

    return NextResponse.json({
      stats: {
        total_students: studentsCount.count || 0,
        total_teachers: teachersCount.count || 0,
        total_classes: classesCount.count || 0,
        attendance_percentage: attendancePercentage,
        total_fees_due: totalFeesDue,
        weekly_collection: weeklyCollection,
      },
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
