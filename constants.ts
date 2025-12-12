import { Booking, KPIMetric, Lead, Tour } from './types';

// Mock KPI Data
export const KPI_DATA: KPIMetric[] = [
  {
    id: 'kpi-1',
    label: 'New leads today',
    value: 12,
    trend: '+20%',
    trendUp: true,
  },
  {
    id: 'kpi-2',
    label: 'Unread conversations',
    value: 5,
    trend: '-2',
    trendUp: false, // In this context, down might be good, but for visual simplicity we'll handle trends generically
  },
  {
    id: 'kpi-3',
    label: 'Follow-ups today',
    value: 8,
  },
  {
    id: 'kpi-4',
    label: 'Upcoming tours (7 days)',
    value: 24,
    trend: '+4',
    trendUp: true,
  },
];

// Mock Leads Data
export const RECENT_LEADS: Lead[] = [
  {
    id: 'L001',
    name: 'Sarah Jenkins',
    lastMessageTime: '10 mins ago',
    status: 'New',
    channel: 'Website',
  },
  {
    id: 'L002',
    name: 'Marco Rossi',
    lastMessageTime: '45 mins ago',
    status: 'Contacted',
    channel: 'WhatsApp',
  },
  {
    id: 'L003',
    name: 'Emily Chen',
    lastMessageTime: '2 hours ago',
    status: 'New',
    channel: 'Email',
  },
  {
    id: 'L004',
    name: 'David Smith',
    lastMessageTime: '5 hours ago',
    status: 'Qualified',
    channel: 'Referral',
  },
  {
    id: 'L005',
    name: 'Anita Patel',
    lastMessageTime: '1 day ago',
    status: 'Contacted',
    channel: 'Website',
  },
];

// Mock Tours Data
export const AVAILABLE_TOURS: Tour[] = [
  {
    id: 'T001',
    name: 'Sunset City Bike Tour',
    duration: '3 hours',
    price: 89,
  },
  {
    id: 'T002',
    name: 'Historical Walk',
    duration: '2 hours',
    price: 45,
  },
  {
    id: 'T003',
    name: 'Food & Wine Tasting',
    duration: '4 hours',
    price: 125,
  },
  {
    id: 'T004',
    name: 'Mountain Hike Level 2',
    duration: '6 hours',
    price: 95,
  },
  {
    id: 'T005',
    name: 'Private Boat Charter',
    duration: '4 hours',
    price: 350,
  },
  {
    id: 'T006',
    name: 'Photography Walking Tour',
    duration: '3 hours',
    price: 75,
  },
  {
    id: 'T007',
    name: 'Culinary Market Experience',
    duration: '2.5 hours',
    price: 65,
  },
  {
    id: 'T008',
    name: 'Coastal Kayaking Adventure',
    duration: '5 hours',
    price: 110,
  },
];

// Mock Bookings Data
export const UPCOMING_BOOKINGS: Booking[] = [
  {
    id: 'B001',
    date: 'Oct 24, 2023',
    tourName: 'Sunset City Bike Tour',
    clientName: 'John Doe',
    people: 2,
    status: 'Confirmed',
  },
  {
    id: 'B002',
    date: 'Oct 25, 2023',
    tourName: 'Historical Walk',
    clientName: 'Alice Cooper',
    people: 4,
    status: 'Pending',
  },
  {
    id: 'B003',
    date: 'Oct 25, 2023',
    tourName: 'Food & Wine Tasting',
    clientName: 'Robert Langdon',
    people: 1,
    status: 'Confirmed',
  },
  {
    id: 'B004',
    date: 'Oct 26, 2023',
    tourName: 'Mountain Hike Level 2',
    clientName: 'Team Alpha',
    people: 8,
    status: 'Confirmed',
  },
  {
    id: 'B005',
    date: 'Oct 27, 2023',
    tourName: 'Private Boat Charter',
    clientName: 'The Kardashians',
    people: 6,
    status: 'Cancelled',
  },
];
