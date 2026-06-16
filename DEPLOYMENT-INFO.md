# Rahmah HMS - Deployment Information

## Finding Your Vercel URL

### Method 1: Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click on your **Rahmah-hms** project
3. You'll see the deployment URL at the top (e.g., `rahmah-hms.vercel.app`)

### Method 2: From Git Commit
1. Go to GitHub: https://github.com/hassankhalid7/Rahmah-hms
2. Click on the latest commit (93a5090)
3. Look for the **Vercel bot comment** with the deployment URL

### Method 3: Check Vercel CLI
```bash
vercel ls
```

## Your Deployment URLs Should Be:

- **Production:** https://rahmah-hms.vercel.app (or your custom domain)
- **Latest Preview:** https://rahmah-hms-[branch-hash].vercel.app

## Testing Endpoints

Once you have your URL, test these:

1. **Health Check:**
   ```
   https://YOUR-URL.vercel.app/api/health
   ```

2. **Student Registration:**
   ```
   https://YOUR-URL.vercel.app/register/student
   ```

3. **Organization Registration:**
   ```
   https://YOUR-URL.vercel.app/organizations/register
   ```

4. **Admin Dashboard:**
   ```
   https://YOUR-URL.vercel.app/dashboard?role=admin
   ```

## Common Issues

### Issue: 404 NOT_FOUND
- **Cause:** Deployment still in progress or failed
- **Solution:** Wait 2-3 minutes and refresh

### Issue: Database connection failed
- **Cause:** Environment variable not set
- **Solution:** 
  1. Vercel Dashboard → Settings → Environment Variables
  2. Add `DATABASE_URL` with your Supabase URL
  3. Redeploy

### Issue: Organizations not showing
- **Cause:** Database tables not created or empty
- **Solution:** 
  1. Run `database-setup.sql` in Supabase SQL Editor
  2. Create test organizations manually or through the registration form

## Need Help?

Share your actual Vercel URL and I can help debug specific issues!