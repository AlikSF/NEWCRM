import { localDB } from './localDatabase';

const DEFAULT_ORG_ID = 'org-default';

export async function initializeDatabase() {
  try {
    const existingOrgs = await localDB.getAll('organizations');

    if (existingOrgs.length === 0) {
      await localDB.insert('organizations', {
        id: DEFAULT_ORG_ID,
        name: 'Demo Tour Company',
        primary_color: '#4F46E5'
      });

      const tourData = [
        { id: 'T001', name: 'Sunset City Bike Tour', location: 'City Center', duration: '3 hours', price: 89, status: 'active' },
        { id: 'T002', name: 'Historical Walk', location: 'Old Town', duration: '2 hours', price: 45, status: 'active' },
        { id: 'T003', name: 'Food & Wine Tasting', location: 'Wine District', duration: '4 hours', price: 125, status: 'active' },
        { id: 'T004', name: 'Mountain Hike Level 2', location: 'Mountain Range', duration: '6 hours', price: 95, status: 'active' },
        { id: 'T005', name: 'Private Boat Charter', location: 'Marina', duration: '4 hours', price: 350, status: 'active' },
        { id: 'T006', name: 'Photography Walking Tour', location: 'Historic District', duration: '3 hours', price: 75, status: 'active' },
        { id: 'T007', name: 'Culinary Market Experience', location: 'Central Market', duration: '2.5 hours', price: 65, status: 'active' },
        { id: 'T008', name: 'Coastal Kayaking Adventure', location: 'Coastline', duration: '5 hours', price: 110, status: 'active' }
      ];

      for (const tour of tourData) {
        await localDB.execute(
          `INSERT INTO tours (id, organization_id, name, location, duration, price, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [tour.id, DEFAULT_ORG_ID, tour.name, tour.location, tour.duration, tour.price, tour.status]
        );
      }

      const leadData = [
        { id: 'L001', name: 'Sarah Jenkins', status: 'new', channel: 'website', email: 'sarah@example.com', phone: '+1234567890' },
        { id: 'L002', name: 'Marco Rossi', status: 'contacted', channel: 'whatsapp', email: 'marco@example.com', phone: '+1234567891' },
        { id: 'L003', name: 'Emily Chen', status: 'new', channel: 'email', email: 'emily@example.com', phone: '+1234567892' },
        { id: 'L004', name: 'David Smith', status: 'qualified', channel: 'website', email: 'david@example.com', phone: '+1234567893' },
        { id: 'L005', name: 'Anita Patel', status: 'contacted', channel: 'website', email: 'anita@example.com', phone: '+1234567894' }
      ];

      for (const lead of leadData) {
        await localDB.execute(
          `INSERT INTO leads (id, organization_id, name, email, phone, status, channel) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [lead.id, DEFAULT_ORG_ID, lead.name, lead.email, lead.phone, lead.status, lead.channel]
        );
      }

      const bookingData = [
        { id: 'B001', tour_id: 'T001', client_name: 'John Doe', date: '2024-01-24', people: 2, status: 'confirmed' },
        { id: 'B002', tour_id: 'T002', client_name: 'Alice Cooper', date: '2024-01-25', people: 4, status: 'pending' },
        { id: 'B003', tour_id: 'T003', client_name: 'Robert Langdon', date: '2024-01-25', people: 1, status: 'confirmed' },
        { id: 'B004', tour_id: 'T004', client_name: 'Team Alpha', date: '2024-01-26', people: 8, status: 'confirmed' },
        { id: 'B005', tour_id: 'T005', client_name: 'The Kardashians', date: '2024-01-27', people: 6, status: 'cancelled' }
      ];

      for (const booking of bookingData) {
        await localDB.execute(
          `INSERT INTO bookings (id, organization_id, tour_id, client_name, date, people, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [booking.id, DEFAULT_ORG_ID, booking.tour_id, booking.client_name, booking.date, booking.people, booking.status]
        );
      }

      console.log('Database initialized with seed data');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

export { DEFAULT_ORG_ID };
