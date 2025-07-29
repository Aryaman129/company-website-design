#!/usr/bin/env node

/**
 * Database Setup Script for Shyam Trading Company Website
 * 
 * This script helps set up the Supabase database and storage bucket
 * Run with: node scripts/setup-database.js
 */

const fs = require('fs')
const path = require('path')

console.log('🚀 Shyam Trading Company - Database Setup')
console.log('=========================================\n')

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local')
const envExamplePath = path.join(process.cwd(), '.env.local.example')

if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!')
  console.log('📋 Please follow these steps:\n')
  
  console.log('1. Copy the example environment file:')
  console.log('   cp .env.local.example .env.local\n')
  
  console.log('2. Update .env.local with your Supabase credentials:')
  console.log('   - Go to https://supabase.com')
  console.log('   - Create a new project')
  console.log('   - Go to Settings > API')
  console.log('   - Copy your Project URL and anon key')
  console.log('   - Update the values in .env.local\n')
  
  console.log('3. Run the database schema:')
  console.log('   - Go to your Supabase dashboard')
  console.log('   - Navigate to SQL Editor')
  console.log('   - Copy and paste the contents of database/schema.sql')
  console.log('   - Click "Run" to execute\n')
  
  console.log('4. Create storage bucket:')
  console.log('   - Go to Storage in your Supabase dashboard')
  console.log('   - Click "Create Bucket"')
  console.log('   - Name: "website-images"')
  console.log('   - Make it public')
  console.log('   - Set allowed MIME types: image/jpeg, image/png, image/gif, image/webp')
  console.log('   - Set file size limit: 5MB\n')
  
  console.log('5. Restart your development server:')
  console.log('   npm run dev\n')
  
  process.exit(1)
}

// Read environment variables
require('dotenv').config({ path: envPath })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Supabase environment variables not found!')
  console.log('📋 Please update your .env.local file with:')
  console.log('   NEXT_PUBLIC_SUPABASE_URL=your_project_url')
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key\n')
  process.exit(1)
}

console.log('✅ Environment variables found')
console.log(`📍 Supabase URL: ${supabaseUrl}`)
console.log(`🔑 Anon Key: ${supabaseKey.substring(0, 20)}...\n`)

// Test connection (basic check)
console.log('🔍 Testing database connection...')

const testConnection = async () => {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/products?select=count`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    })
    
    if (response.ok) {
      console.log('✅ Database connection successful!')
      console.log('📊 Tables are accessible\n')
      
      console.log('🎉 Setup appears to be complete!')
      console.log('📋 Next steps:')
      console.log('   1. Start your development server: npm run dev')
      console.log('   2. Go to http://localhost:3000/admin/settings')
      console.log('   3. Check the Database tab for full status')
      console.log('   4. If you have existing data, use the migration tool\n')
      
    } else {
      console.log('❌ Database connection failed')
      console.log(`📋 Response: ${response.status} ${response.statusText}`)
      console.log('🔧 Please check:')
      console.log('   1. Your Supabase project is active')
      console.log('   2. The database schema has been applied')
      console.log('   3. Your environment variables are correct\n')
    }
  } catch (error) {
    console.log('❌ Connection test failed')
    console.log(`📋 Error: ${error.message}`)
    console.log('🔧 Please check your internet connection and Supabase setup\n')
  }
}

// Read and display schema file info
const schemaPath = path.join(process.cwd(), 'database', 'schema.sql')
if (fs.existsSync(schemaPath)) {
  const schemaContent = fs.readFileSync(schemaPath, 'utf8')
  const tableCount = (schemaContent.match(/CREATE TABLE/g) || []).length
  console.log(`📄 Database schema found (${tableCount} tables)`)
} else {
  console.log('⚠️  Database schema file not found at database/schema.sql')
}

// Run the connection test
testConnection()

console.log('📚 For detailed setup instructions, see:')
console.log('   - DATABASE_SETUP.md')
console.log('   - Admin Portal > Settings > Database > Setup Guide')
console.log('\n💡 Need help? Check the troubleshooting section in DATABASE_SETUP.md')
