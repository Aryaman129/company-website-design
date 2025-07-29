# Database Setup Guide - Shyam Trading Company Website

This guide will help you set up a Supabase database for global data synchronization, transforming your website from a local-only demo into a production-ready system where content changes are immediately visible to all users worldwide.

## 🎯 What This Achieves

- **Global Data Synchronization**: Changes made in the admin portal are immediately visible to all website visitors
- **Real-time Updates**: The Visual Builder shows actual live data and updates in real-time
- **Production Ready**: Replaces localStorage with a proper database backend
- **Multi-user Support**: Multiple administrators can make changes simultaneously
- **Data Persistence**: All content survives browser refreshes and device changes

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/login and click "New Project"
3. Choose organization and enter project details:
   - **Name**: `shyam-trading-website`
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
4. Click "Create new project" and wait for setup to complete

### Step 2: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy and paste the entire contents of `database/schema.sql`
4. Click **"Run"** to execute the script
5. Verify tables were created in the **Table Editor**

### Step 2.5: Set Up Storage Bucket (For Image Uploads)

**Important**: This step is optional for development but required for production.

#### Option A: Skip Storage Setup (Development Mode)
- The system will automatically use local browser storage for images
- Images work immediately but are lost when you refresh the page
- Perfect for testing and development

#### Option B: Set Up Supabase Storage (Production Mode)
1. In your Supabase dashboard, go to **Storage**
2. Click **"Create Bucket"**
3. Enter bucket name: `website-images`
4. Make it **Public** (check the public checkbox)
5. Set **Allowed MIME types**: `image/jpeg, image/png, image/gif, image/webp`
6. Set **File size limit**: `5242880` (5MB)
7. Click **"Create Bucket"**

#### Step 2.6: Set Up Storage Policies (Required for Option B)
**Important**: Storage policies MUST be created via the Supabase Dashboard, not SQL.

1. Go to **Storage** → **Policies** in your Supabase dashboard
2. Click **"New Policy"** for the `website-images` bucket
3. Create these 4 policies one by one:

**Policy 1 - INSERT (Upload)**:
- Policy Name: `Allow public uploads`
- Allowed Operation: `INSERT`
- Target Roles: `public`
- Policy Definition: `true`

**Policy 2 - SELECT (Download)**:
- Policy Name: `Allow public downloads`
- Allowed Operation: `SELECT`
- Target Roles: `public`
- Policy Definition: `true`

**Policy 3 - UPDATE**:
- Policy Name: `Allow public updates`
- Allowed Operation: `UPDATE`
- Target Roles: `public`
- Policy Definition: `true`

**Policy 4 - DELETE**:
- Policy Name: `Allow public deletes`
- Allowed Operation: `DELETE`
- Target Roles: `public`
- Policy Definition: `true`

**Note**: If you get "must be owner of table objects" error, you're trying to use SQL instead of the dashboard. Use the dashboard method above.

### Step 3: Configure Environment Variables

1. In your Supabase dashboard, go to **Settings → API**
2. Copy your **Project URL** and **anon public key**
3. Create `.env.local` in your project root:

```bash
# Copy .env.local.example to .env.local and update these values
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 4: Restart and Test

1. Restart your development server: `npm run dev`
2. Go to **Admin → Settings → Database** tab
3. Verify status shows "Connected to Supabase"
4. Test by adding a product and checking it appears on the main website

## 🔄 Migration from localStorage

If you have existing data in localStorage, the system will automatically detect it and offer migration:

1. Go to **Admin → Settings → Database** tab
2. If local data is detected, you'll see a "Migration Available" panel
3. Click **"Migrate to Database"** to transfer your data
4. Verify the migration was successful

## 🛠️ Advanced Configuration

### Row Level Security (RLS)

The database schema includes RLS policies for security:
- **Public read access**: Website visitors can read all content
- **Admin write access**: Only authenticated users can modify data

### Real-time Subscriptions

The system automatically sets up real-time subscriptions for:
- Product changes
- Content updates
- Settings modifications
- Media uploads
- Testimonial changes

### Fallback System

The application includes a hybrid system that:
- **Automatically detects** database availability
- **Falls back to localStorage** if database is unavailable
- **Shows clear status** in the admin portal
- **Allows reconnection** without restarting

## 🔧 Troubleshooting

### Connection Issues

**Problem**: "Database connection failed"
**Solutions**:
1. Check environment variables are correctly set
2. Verify Supabase project is active (not paused)
3. Ensure database schema has been applied
4. Check browser console for detailed errors

**Problem**: "Missing environment variables"
**Solutions**:
1. Ensure `.env.local` file exists in project root
2. Verify variable names match exactly (including `NEXT_PUBLIC_` prefix)
3. Restart development server after adding variables

### Migration Issues

**Problem**: "Migration failed"
**Solutions**:
1. Ensure database connection is working
2. Check that tables exist in Supabase
3. Verify you have write permissions
4. Check browser console for specific errors

### Performance Issues

**Problem**: Slow loading or updates
**Solutions**:
1. Choose a Supabase region closer to your users
2. Optimize your database queries
3. Consider upgrading your Supabase plan for better performance

## 📊 Database Schema Overview

The system creates these tables:

- **`products`**: Product catalog with features, specifications, pricing
- **`content`**: Website content sections (hero, about, CTA)
- **`settings`**: Company information, theme, configuration
- **`media`**: Uploaded images and videos with metadata
- **`testimonials`**: Customer testimonials and reviews

## 🔐 Security Features

- **Row Level Security**: Prevents unauthorized data access
- **Public read policies**: Website visitors can view content
- **Admin authentication**: Only authenticated users can modify data
- **Environment variables**: Sensitive credentials stored securely
- **HTTPS encryption**: All data transmitted securely

## 🚀 Production Deployment

For production deployment:

1. **Upgrade Supabase plan** for better performance and support
2. **Set up proper authentication** for admin users
3. **Configure custom domain** for your Supabase project
4. **Set up monitoring** and alerts for database health
5. **Regular backups** of your database

## 📞 Support

If you encounter issues:

1. Check the **Database** tab in Admin Settings for status
2. Review browser console for error messages
3. Verify your Supabase project is active
4. Check the troubleshooting section above

## 🎉 Success!

Once set up, you'll have:

- ✅ **Global data synchronization** across all users
- ✅ **Real-time Visual Builder** with live data
- ✅ **Production-ready database** backend
- ✅ **Automatic fallback** to localStorage if needed
- ✅ **Migration tools** for existing data
- ✅ **Admin portal** with database status monitoring

Your website is now ready for production use with proper data persistence and global synchronization!
