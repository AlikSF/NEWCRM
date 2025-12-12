export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Booked' | 'Lost';
export type BookingStatus = 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
export type Channel = 'Website' | 'WhatsApp' | 'Email' | 'Referral';

export interface Lead {
  id: string;
  name: string;
  lastMessageTime: string; // ISO string or relative time string
  status: LeadStatus;
  channel: Channel;
}

export interface Tour {
  id: string;
  name: string;
  duration: string;
  price: number;
}

export interface Booking {
  id: string;
  date: string;
  tourName: string;
  clientName: string;
  people: number;
  status: BookingStatus;
  notes?: string;
  pickupLocation?: string;
  leadId?: string;
  tourId?: string;
}

export interface KPIMetric {
  id: string;
  label: string;
  value: string | number;
  trend?: string; // e.g., "+12%"
  trendUp?: boolean;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}