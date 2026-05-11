# 🔐 Rahmah HMS Login Guide

## Current Status: Demo Mode Active ✅

The system is currently running in **Demo Mode**, which means you can login without real authentication credentials.

## 🚀 How to Login as Admin

### Step 1: Access Login Page
Navigate to: **http://localhost:3001/sign-in**

### Step 2: Select Role
Click on the **"Admin"** button in the role selection area

### Step 3: Login Options
You have two options:

**Option A: Auto Demo Login (Recommended)**
- Leave email and password fields empty
- Click "Login" button
- System will automatically use demo credentials

**Option B: Manual Entry**
- Email: `admin@rahmah.demo` (or any email)
- Password: `demo12345` (or any password)
- Click "Login" button

### Step 4: Access Dashboard
After login, you'll be redirected to: **http://localhost:3001/dashboard?role=admin**

## 🎭 Available Demo Roles

| Role | Access URL | Description |
|------|------------|-------------|
| **Admin** | `/dashboard?role=admin` | Full system access |
| **Teacher** | `/dashboard?role=teacher` | Teacher dashboard |
| **Student** | `/dashboard?role=student` | Student dashboard |
| **Parent** | `/dashboard?role=parent` | Parent portal |
| **Super Admin** | `/dashboard?role=super_admin` | System-wide management |

## 🔧 Troubleshooting

### If Login Doesn't Work:
1. Make sure the development server is running on port 3001
2. Clear browser cache and cookies
3. Try accessing the login page directly: http://localhost:3001/sign-in
4. Check browser console for any JavaScript errors

### If Dashboard Doesn't Load:
1. Check the URL includes the role parameter: `?role=admin`
2. Try refreshing the page
3. Check the browser network tab for any failed requests

## 🌟 Features Available in Demo Mode

- ✅ All dashboard views (Admin, Teacher, Student, Parent, Super Admin)
- ✅ Complete UI functionality
- ✅ Navigation between different sections
- ✅ Role-based dashboard switching
- ✅ Responsive design testing
- ✅ Language switching (English/Urdu)

## 🔐 Setting Up Real Authentication (Optional)

To enable real Clerk authentication:

1. Sign up at [Clerk.com](https://clerk.com)
2. Create a new application
3. Get your publishable and secret keys
4. Update `.env.local` file:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   CLERK_SECRET_KEY=sk_test_your_secret_key_here
   ```
5. Restart the development server

---

**Need Help?** The system is designed to work seamlessly in demo mode for testing and development purposes.