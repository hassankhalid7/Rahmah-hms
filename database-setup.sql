-- ============================================
-- RAHMAH HMS - COMPLETE DATABASE SETUP
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- Create ENUMS first
DO $$ BEGIN
    CREATE TYPE "public"."user_role" AS ENUM('super_admin', 'institute_admin', 'teacher', 'student', 'parent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "public"."user_status" AS ENUM('active', 'inactive', 'pending');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "public"."marked_attendance_status" AS ENUM('present', 'absent', 'late', 'excused');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "public"."learning_type" AS ENUM('qaida', 'nazra', 'hifz');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "public"."progress_attendance_status" AS ENUM('present', 'absent', 'late', 'excused');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "public"."join_request_status" AS ENUM('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- CREATE TABLES
-- ============================================

-- Organizations table
CREATE TABLE IF NOT EXISTS "organizations" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "name" varchar(255) NOT NULL,
    "slug" varchar(255) NOT NULL UNIQUE,
    "logo_url" text,
    "address" text,
    "phone" varchar(50),
    "email" varchar(255),
    "metadata" jsonb,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Users table
CREATE TABLE IF NOT EXISTS "users" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "clerk_user_id" varchar(255) UNIQUE,
    "organization_id" uuid,
    "role" "user_role" DEFAULT 'student' NOT NULL,
    "status" "user_status" DEFAULT 'pending' NOT NULL,
    "first_name" varchar(100),
    "last_name" varchar(100),
    "email" varchar(255),
    "phone" varchar(50),
    "avatar_url" text,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Students table
CREATE TABLE IF NOT EXISTS "students" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid NOT NULL,
    "organization_id" uuid NOT NULL,
    "student_number" varchar(50),
    "admission_date" date,
    "date_of_birth" date,
    "guardian_id" uuid,
    "metadata" jsonb
);

-- Teachers table
CREATE TABLE IF NOT EXISTS "teachers" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid NOT NULL,
    "organization_id" uuid NOT NULL,
    "employee_number" varchar(50),
    "specialization" text,
    "join_date" date,
    "metadata" jsonb
);

-- Classes table
CREATE TABLE IF NOT EXISTS "classes" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "organization_id" uuid NOT NULL,
    "name" varchar(255) NOT NULL,
    "description" text,
    "teacher_id" uuid,
    "schedule" jsonb,
    "start_date" date,
    "end_date" date,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Class enrollments table
CREATE TABLE IF NOT EXISTS "class_enrollments" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "class_id" uuid NOT NULL,
    "student_id" uuid NOT NULL,
    "enrollment_date" timestamp DEFAULT now() NOT NULL,
    "status" varchar(50) DEFAULT 'active'
);

-- Attendance table
CREATE TABLE IF NOT EXISTS "attendance" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "organization_id" uuid NOT NULL,
    "user_id" uuid NOT NULL,
    "date" date NOT NULL,
    "status" "marked_attendance_status" NOT NULL,
    "marked_by" uuid,
    "remarks" text,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Daily progress table
CREATE TABLE IF NOT EXISTS "daily_progress" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "student_id" uuid NOT NULL,
    "teacher_id" uuid NOT NULL,
    "date" date NOT NULL,
    "learning_type" "learning_type" NOT NULL,
    "attendance_status" "progress_attendance_status" NOT NULL,
    "teacher_remarks" text,
    "qaida_lesson_number" integer,
    "qaida_page_number" integer,
    "qaida_topic" varchar(100),
    "qaida_mistakes_count" integer,
    "nazra_para_number" integer,
    "nazra_from_ayah" varchar(20),
    "nazra_to_ayah" varchar(20),
    "nazra_mistakes_count" integer,
    "hifz_sabaq" varchar(100),
    "hifz_sabqi" varchar(100),
    "hifz_manzil" varchar(100),
    "hifz_ayat_mistakes" jsonb,
    "tenant_id" uuid NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Progress edit history table
CREATE TABLE IF NOT EXISTS "progress_edit_history" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "progress_id" uuid NOT NULL,
    "edited_by" uuid NOT NULL,
    "edited_at" timestamp DEFAULT now() NOT NULL,
    "previous_state" jsonb NOT NULL,
    "changes_summary" text
);

-- Exams table
CREATE TABLE IF NOT EXISTS "exams" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "organization_id" uuid NOT NULL,
    "name" varchar(255) NOT NULL,
    "exam_type" varchar(100),
    "syllabus" text,
    "date" date,
    "metadata" jsonb,
    "created_at" timestamp DEFAULT now() NOT NULL
);

-- Exam results table
CREATE TABLE IF NOT EXISTS "exam_results" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "exam_id" uuid NOT NULL,
    "student_id" uuid NOT NULL,
    "examiner_id" uuid,
    "marks" numeric(5, 2),
    "rating" varchar(50),
    "mistakes_count" integer,
    "pauses_count" integer,
    "remarks" text,
    "created_at" timestamp DEFAULT now() NOT NULL
);

-- Leave requests table
CREATE TABLE IF NOT EXISTS "leave_requests" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "organization_id" uuid NOT NULL,
    "user_id" uuid NOT NULL,
    "start_date" date NOT NULL,
    "end_date" date NOT NULL,
    "reason" text,
    "status" varchar(50) DEFAULT 'pending' NOT NULL,
    "approved_by" uuid,
    "created_at" timestamp DEFAULT now() NOT NULL
);

-- Notifications table
CREATE TABLE IF NOT EXISTS "notifications" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid NOT NULL,
    "type" varchar(50),
    "title" varchar(255) NOT NULL,
    "message" text NOT NULL,
    "data" jsonb,
    "is_read" boolean DEFAULT false NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);

-- Join requests table (NEW)
CREATE TABLE IF NOT EXISTS "join_requests" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "student_user_id" uuid NOT NULL,
    "organization_id" uuid NOT NULL,
    "message" text,
    "status" "join_request_status" DEFAULT 'pending' NOT NULL,
    "reviewed_by" uuid,
    "reviewed_at" timestamp,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

-- ============================================
-- ADD FOREIGN KEY CONSTRAINTS
-- ============================================

-- Users foreign keys
DO $$ BEGIN
    ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_organizations_id_fk" 
        FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Students foreign keys
DO $$ BEGIN
    ALTER TABLE "students" ADD CONSTRAINT "students_user_id_users_id_fk" 
        FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "students" ADD CONSTRAINT "students_organization_id_organizations_id_fk" 
        FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "students" ADD CONSTRAINT "students_guardian_id_users_id_fk" 
        FOREIGN KEY ("guardian_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Teachers foreign keys
DO $$ BEGIN
    ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_users_id_fk" 
        FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "teachers" ADD CONSTRAINT "teachers_organization_id_organizations_id_fk" 
        FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Classes foreign keys
DO $$ BEGIN
    ALTER TABLE "classes" ADD CONSTRAINT "classes_organization_id_organizations_id_fk" 
        FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "classes" ADD CONSTRAINT "classes_teacher_id_teachers_id_fk" 
        FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Class enrollments foreign keys
DO $$ BEGIN
    ALTER TABLE "class_enrollments" ADD CONSTRAINT "class_enrollments_class_id_classes_id_fk" 
        FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "class_enrollments" ADD CONSTRAINT "class_enrollments_student_id_students_id_fk" 
        FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Attendance foreign keys
DO $$ BEGIN
    ALTER TABLE "attendance" ADD CONSTRAINT "attendance_organization_id_organizations_id_fk" 
        FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "attendance" ADD CONSTRAINT "attendance_user_id_users_id_fk" 
        FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "attendance" ADD CONSTRAINT "attendance_marked_by_users_id_fk" 
        FOREIGN KEY ("marked_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Daily progress foreign keys
DO $$ BEGIN
    ALTER TABLE "daily_progress" ADD CONSTRAINT "daily_progress_student_id_students_id_fk" 
        FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "daily_progress" ADD CONSTRAINT "daily_progress_teacher_id_teachers_id_fk" 
        FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "daily_progress" ADD CONSTRAINT "daily_progress_tenant_id_organizations_id_fk" 
        FOREIGN KEY ("tenant_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Progress edit history foreign keys
DO $$ BEGIN
    ALTER TABLE "progress_edit_history" ADD CONSTRAINT "progress_edit_history_progress_id_daily_progress_id_fk" 
        FOREIGN KEY ("progress_id") REFERENCES "public"."daily_progress"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "progress_edit_history" ADD CONSTRAINT "progress_edit_history_edited_by_users_id_fk" 
        FOREIGN KEY ("edited_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Exams foreign keys
DO $$ BEGIN
    ALTER TABLE "exams" ADD CONSTRAINT "exams_organization_id_organizations_id_fk" 
        FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Exam results foreign keys
DO $$ BEGIN
    ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_exam_id_exams_id_fk" 
        FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_student_id_students_id_fk" 
        FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_examiner_id_teachers_id_fk" 
        FOREIGN KEY ("examiner_id") REFERENCES "public"."teachers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Leave requests foreign keys
DO $$ BEGIN
    ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_organization_id_organizations_id_fk" 
        FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_user_id_users_id_fk" 
        FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_approved_by_users_id_fk" 
        FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Notifications foreign keys
DO $$ BEGIN
    ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" 
        FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Join requests foreign keys (NEW)
DO $$ BEGIN
    ALTER TABLE "join_requests" ADD CONSTRAINT "join_requests_student_user_id_users_id_fk" 
        FOREIGN KEY ("student_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "join_requests" ADD CONSTRAINT "join_requests_organization_id_organizations_id_fk" 
        FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "join_requests" ADD CONSTRAINT "join_requests_reviewed_by_users_id_fk" 
        FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add unique constraint for join requests
DO $$ BEGIN
    ALTER TABLE "join_requests" ADD CONSTRAINT "join_requests_student_organization_unique" 
        UNIQUE("student_user_id", "organization_id");
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- COMPLETE! All tables created successfully
-- ============================================

SELECT 'Database setup completed successfully!' as message;