$dbUrl = "postgresql://postgres.pshmvaeogdhehpiydtrt:Swwsskarg4%40@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres"
$dbUrl | npx vercel env add DATABASE_URL production
$dbUrl | npx vercel env add DATABASE_URL preview
$dbUrl | npx vercel env add DATABASE_URL development
