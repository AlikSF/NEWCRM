# Database Setup Guide

Your Tour CRM app is now integrated with Supabase! Follow these steps to complete the setup.

## Step 1: Set Up Database Schema

1. Open your Supabase dashboard at: https://0ec90b57d6e95fcbda19832f.supabase.co
2. Navigate to the **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase-schema.sql` file
5. Paste it into the SQL Editor
6. Click **Run** to execute the schema

This will create all necessary tables with proper security policies:
- `organizations` - Store company information
- `profiles` - User profiles linked to organizations
- `leads` - Customer leads and contacts
- `tours` - Tour packages
- `bookings` - Tour bookings
- `notifications` - User notifications

## Step 2: Configure Authentication

1. In your Supabase dashboard, go to **Authentication** > **Settings**
2. Ensure **Enable Email Signup** is turned ON
3. Under **Auth Providers**, make sure **Email** is enabled
4. Turn OFF **Email Confirmations** for easier testing (or configure email settings if you want confirmations)

## Step 3: Test Your App

1. Open your app
2. You'll see the Sign Up page
3. Create a new account:
   - Enter your full name
   - Enter your organization name
   - Enter email and password
   - Click "Create Account"
4. You'll be automatically logged in and can start using the app!

## What's New

Your app now has:
- **Real Authentication**: Secure login and signup
- **Multi-tenancy**: Each organization has isolated data
- **Real Database**: All data persists in PostgreSQL
- **Row Level Security**: Data is automatically protected
- **Working Logout**: Sign out button now functions properly

## Troubleshooting

If you see "Failed to load data. Using mock data." toast message:
1. Make sure you ran the SQL schema from Step 1
2. Check that authentication is properly configured
3. Verify you're logged in

## Next Steps

Once the database is set up, all CRUD operations will work:
- Create and manage leads
- Add and update bookings
- Create tour packages
- Receive notifications

The app automatically falls back to mock data if the database isn't set up yet, so you can still see the UI in action.
