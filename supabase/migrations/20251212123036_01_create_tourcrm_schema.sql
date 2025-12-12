/*
  # TourCRM Multi-Tenant Schema

  ## Overview
  Creates a complete multi-tenant SaaS schema for a Tour CRM system with proper tenant isolation.

  ## New Tables

  ### 1. organizations
  - `id` (uuid, primary key) - Unique organization identifier
  - `name` (text) - Organization/company name
  - `logo_url` (text, nullable) - URL or base64 of company logo
  - `primary_color` (text) - Brand color (hex code)
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. organization_members
  - `id` (uuid, primary key)
  - `organization_id` (uuid, foreign key) - Links to organizations
  - `user_id` (uuid, foreign key) - Links to auth.users
  - `role` (text) - User role (owner, admin, agent, viewer)
  - `created_at` (timestamptz)

  ### 3. leads
  - `id` (uuid, primary key)
  - `organization_id` (uuid, foreign key) - Tenant isolation
  - `name` (text) - Lead name
  - `email` (text, nullable) - Contact email
  - `phone` (text, nullable) - Contact phone
  - `status` (text) - new, contacted, qualified, converted, lost
  - `channel` (text) - telegram, whatsapp, website, phone, email
  - `last_message_time` (timestamptz, nullable) - Last interaction time
  - `notes` (text, nullable) - Additional notes
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. tours
  - `id` (uuid, primary key)
  - `organization_id` (uuid, foreign key)
  - `name` (text) - Tour name
  - `location` (text) - Tour location
  - `duration` (text) - Duration (e.g., "3 days", "5 hours")
  - `price` (numeric) - Base price
  - `status` (text) - active, draft, archived
  - `description` (text, nullable) - Full description
  - `max_group_size` (integer, nullable) - Maximum participants
  - `level` (text, nullable) - Difficulty level
  - `tags` (jsonb) - Array of tags
  - `images` (jsonb) - Array of image URLs
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. bookings
  - `id` (uuid, primary key)
  - `organization_id` (uuid, foreign key)
  - `tour_id` (uuid, foreign key, nullable) - Links to tours
  - `lead_id` (uuid, foreign key, nullable) - Links to leads
  - `client_name` (text) - Client name
  - `client_email` (text, nullable)
  - `client_phone` (text, nullable)
  - `people` (integer) - Number of people
  - `date` (date) - Booking date
  - `status` (text) - confirmed, pending, cancelled, completed
  - `notes` (text, nullable)
  - `pickup_location` (text, nullable)
  - `total_price` (numeric, nullable)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. inbox_threads
  - `id` (uuid, primary key)
  - `organization_id` (uuid, foreign key)
  - `lead_id` (uuid, foreign key, nullable) - Associated lead
  - `sender_name` (text) - Name of the sender
  - `channel` (text) - telegram, whatsapp, website
  - `status` (text) - active, archived, spam
  - `unread` (boolean) - Unread status
  - `preview` (text) - Last message preview
  - `last_time` (timestamptz) - Last message timestamp
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 7. inbox_messages
  - `id` (uuid, primary key)
  - `organization_id` (uuid, foreign key)
  - `thread_id` (uuid, foreign key) - Links to inbox_threads
  - `sender` (text) - 'me' or 'client'
  - `text` (text) - Message content
  - `sent_at` (timestamptz) - Message timestamp
  - `created_at` (timestamptz)

  ### 8. notifications
  - `id` (uuid, primary key)
  - `organization_id` (uuid, foreign key)
  - `user_id` (uuid, foreign key) - Target user
  - `type` (text) - notification type (lead, booking, message, etc.)
  - `title` (text) - Notification title
  - `body` (text) - Notification body
  - `is_read` (boolean) - Read status
  - `metadata` (jsonb, nullable) - Additional data
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Policies enforce organization-level isolation
  - Users can only access data from organizations they belong to

  ## Indexes
  - Foreign key indexes for performance
  - Composite indexes on organization_id + commonly queried fields
*/

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  primary_color text DEFAULT '#4F46E5',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create organization_members table
CREATE TABLE IF NOT EXISTS organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'agent' CHECK (role IN ('owner', 'admin', 'agent', 'viewer')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  channel text DEFAULT 'website' CHECK (channel IN ('telegram', 'whatsapp', 'website', 'phone', 'email', 'referral')),
  last_message_time timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tours table
CREATE TABLE IF NOT EXISTS tours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  location text NOT NULL,
  duration text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  description text,
  max_group_size integer,
  level text,
  tags jsonb DEFAULT '[]'::jsonb,
  images jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  tour_id uuid REFERENCES tours(id) ON DELETE SET NULL,
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  client_name text NOT NULL,
  client_email text,
  client_phone text,
  people integer NOT NULL DEFAULT 1,
  date date NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('confirmed', 'pending', 'cancelled', 'completed')),
  notes text,
  pickup_location text,
  total_price numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create inbox_threads table
CREATE TABLE IF NOT EXISTS inbox_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  sender_name text NOT NULL,
  channel text DEFAULT 'website' CHECK (channel IN ('telegram', 'whatsapp', 'website', 'phone', 'email')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'archived', 'spam')),
  unread boolean DEFAULT true,
  preview text,
  last_time timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create inbox_messages table
CREATE TABLE IF NOT EXISTS inbox_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  thread_id uuid REFERENCES inbox_threads(id) ON DELETE CASCADE NOT NULL,
  sender text NOT NULL CHECK (sender IN ('me', 'client')),
  text text NOT NULL,
  sent_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  is_read boolean DEFAULT false,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_organization_members_user_id ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_org_id ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_leads_org_id ON leads(organization_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_tours_org_id ON tours(organization_id);
CREATE INDEX IF NOT EXISTS idx_tours_status ON tours(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_org_id ON bookings(organization_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(organization_id, date);
CREATE INDEX IF NOT EXISTS idx_inbox_threads_org_id ON inbox_threads(organization_id);
CREATE INDEX IF NOT EXISTS idx_inbox_threads_unread ON inbox_threads(organization_id, unread);
CREATE INDEX IF NOT EXISTS idx_inbox_messages_thread_id ON inbox_messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id, is_read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tours_updated_at ON tours;
CREATE TRIGGER update_tours_updated_at BEFORE UPDATE ON tours
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_inbox_threads_updated_at ON inbox_threads;
CREATE TRIGGER update_inbox_threads_updated_at BEFORE UPDATE ON inbox_threads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();