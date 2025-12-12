import { supabase } from './supabase';

const DEFAULT_ORG_ID = '00000000-0000-0000-0000-000000000001';

export async function initializeDatabase() {
  try {
    const { data: existingOrgs } = await supabase
      .from('organizations')
      .select('id')
      .maybeSingle();

    if (!existingOrgs) {
      const { error: orgError } = await supabase
        .from('organizations')
        .insert({
          id: DEFAULT_ORG_ID,
          name: 'Demo Tour Company',
          primary_color: '#4F46E5'
        });

      if (orgError) {
        console.error('Error creating organization:', orgError);
        return;
      }

      const tourData = [
        { id: '00000000-0000-0000-0000-000000000101', organization_id: DEFAULT_ORG_ID, name: 'Sunset City Bike Tour', location: 'City Center', duration: '3 hours', price: 89, status: 'active' },
        { id: '00000000-0000-0000-0000-000000000102', organization_id: DEFAULT_ORG_ID, name: 'Historical Walk', location: 'Old Town', duration: '2 hours', price: 45, status: 'active' },
        { id: '00000000-0000-0000-0000-000000000103', organization_id: DEFAULT_ORG_ID, name: 'Food & Wine Tasting', location: 'Wine District', duration: '4 hours', price: 125, status: 'active' },
        { id: '00000000-0000-0000-0000-000000000104', organization_id: DEFAULT_ORG_ID, name: 'Mountain Hike Level 2', location: 'Mountain Range', duration: '6 hours', price: 95, status: 'active' },
        { id: '00000000-0000-0000-0000-000000000105', organization_id: DEFAULT_ORG_ID, name: 'Private Boat Charter', location: 'Marina', duration: '4 hours', price: 350, status: 'active' },
        { id: '00000000-0000-0000-0000-000000000106', organization_id: DEFAULT_ORG_ID, name: 'Photography Walking Tour', location: 'Historic District', duration: '3 hours', price: 75, status: 'active' },
        { id: '00000000-0000-0000-0000-000000000107', organization_id: DEFAULT_ORG_ID, name: 'Culinary Market Experience', location: 'Central Market', duration: '2.5 hours', price: 65, status: 'active' },
        { id: '00000000-0000-0000-0000-000000000108', organization_id: DEFAULT_ORG_ID, name: 'Coastal Kayaking Adventure', location: 'Coastline', duration: '5 hours', price: 110, status: 'active' }
      ];

      const { error: tourError } = await supabase
        .from('tours')
        .insert(tourData);

      if (tourError) {
        console.error('Error creating tours:', tourError);
      }

      const leadData = [
        { id: '00000000-0000-0000-0000-000000000201', organization_id: DEFAULT_ORG_ID, name: 'Sarah Jenkins', status: 'new', channel: 'website', email: 'sarah@example.com', phone: '+1234567890' },
        { id: '00000000-0000-0000-0000-000000000202', organization_id: DEFAULT_ORG_ID, name: 'Marco Rossi', status: 'contacted', channel: 'whatsapp', email: 'marco@example.com', phone: '+1234567891' },
        { id: '00000000-0000-0000-0000-000000000203', organization_id: DEFAULT_ORG_ID, name: 'Emily Chen', status: 'new', channel: 'email', email: 'emily@example.com', phone: '+1234567892' },
        { id: '00000000-0000-0000-0000-000000000204', organization_id: DEFAULT_ORG_ID, name: 'David Smith', status: 'qualified', channel: 'website', email: 'david@example.com', phone: '+1234567893' },
        { id: '00000000-0000-0000-0000-000000000205', organization_id: DEFAULT_ORG_ID, name: 'Anita Patel', status: 'contacted', channel: 'website', email: 'anita@example.com', phone: '+1234567894' }
      ];

      const { error: leadError } = await supabase
        .from('leads')
        .insert(leadData);

      if (leadError) {
        console.error('Error creating leads:', leadError);
      }

      const bookingData = [
        { id: '00000000-0000-0000-0000-000000000301', organization_id: DEFAULT_ORG_ID, tour_id: '00000000-0000-0000-0000-000000000101', client_name: 'John Doe', date: '2024-01-24', people: 2, status: 'confirmed' },
        { id: '00000000-0000-0000-0000-000000000302', organization_id: DEFAULT_ORG_ID, tour_id: '00000000-0000-0000-0000-000000000102', client_name: 'Alice Cooper', date: '2024-01-25', people: 4, status: 'pending' },
        { id: '00000000-0000-0000-0000-000000000303', organization_id: DEFAULT_ORG_ID, tour_id: '00000000-0000-0000-0000-000000000103', client_name: 'Robert Langdon', date: '2024-01-25', people: 1, status: 'confirmed' },
        { id: '00000000-0000-0000-0000-000000000304', organization_id: DEFAULT_ORG_ID, tour_id: '00000000-0000-0000-0000-000000000104', client_name: 'Team Alpha', date: '2024-01-26', people: 8, status: 'confirmed' },
        { id: '00000000-0000-0000-0000-000000000305', organization_id: DEFAULT_ORG_ID, tour_id: '00000000-0000-0000-0000-000000000105', client_name: 'The Kardashians', date: '2024-01-27', people: 6, status: 'cancelled' }
      ];

      const { error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingData);

      if (bookingError) {
        console.error('Error creating bookings:', bookingError);
      }

      console.log('Database initialized with seed data');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

export { DEFAULT_ORG_ID };
