-- TourCRM Database Schema
-- Copy and paste this into Bolt's Database settings to create all required tables

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  primary_color text DEFAULT '#4F46E5',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their organizations"
  ON organizations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert organizations"
  ON organizations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their organizations"
  ON organizations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  status text DEFAULT 'new',
  channel text DEFAULT 'website',
  last_message_time timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view leads"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert leads"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete leads"
  ON leads FOR DELETE
  TO authenticated
  USING (true);

-- Create tours table
CREATE TABLE IF NOT EXISTS tours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  location text NOT NULL,
  duration text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  status text DEFAULT 'active',
  description text,
  max_group_size integer,
  level text,
  tags text[],
  images text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tours"
  ON tours FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert tours"
  ON tours FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update tours"
  ON tours FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete tours"
  ON tours FOR DELETE
  TO authenticated
  USING (true);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  tour_id uuid REFERENCES tours(id) ON DELETE SET NULL,
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  client_name text NOT NULL,
  client_email text,
  client_phone text,
  people integer NOT NULL DEFAULT 1,
  date date NOT NULL,
  status text DEFAULT 'pending',
  notes text,
  pickup_location text,
  total_price numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete bookings"
  ON bookings FOR DELETE
  TO authenticated
  USING (true);

-- Create inbox_threads table
CREATE TABLE IF NOT EXISTS inbox_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  sender_name text NOT NULL,
  channel text DEFAULT 'website',
  status text DEFAULT 'active',
  unread boolean DEFAULT true,
  preview text,
  last_time timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE inbox_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view inbox threads"
  ON inbox_threads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert inbox threads"
  ON inbox_threads FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update inbox threads"
  ON inbox_threads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete inbox threads"
  ON inbox_threads FOR DELETE
  TO authenticated
  USING (true);

-- Create inbox_messages table
CREATE TABLE IF NOT EXISTS inbox_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  thread_id uuid NOT NULL REFERENCES inbox_threads(id) ON DELETE CASCADE,
  sender text NOT NULL,
  text text NOT NULL,
  sent_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE inbox_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view inbox messages"
  ON inbox_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert inbox messages"
  ON inbox_messages FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update inbox messages"
  ON inbox_messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete inbox messages"
  ON inbox_messages FOR DELETE
  TO authenticated
  USING (true);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  is_read boolean DEFAULT false,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_organization_id ON leads(organization_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_tours_organization_id ON tours(organization_id);
CREATE INDEX IF NOT EXISTS idx_tours_status ON tours(status);
CREATE INDEX IF NOT EXISTS idx_bookings_organization_id ON bookings(organization_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_inbox_threads_organization_id ON inbox_threads(organization_id);
CREATE INDEX IF NOT EXISTS idx_inbox_messages_thread_id ON inbox_messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_notifications_organization_id ON notifications(organization_id);
