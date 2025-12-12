import { supabase } from './supabase';
import type { Lead, Booking, Tour, Notification } from '../types';

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*, organizations(*)')
    .eq('id', user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getLeads(): Promise<Lead[]> {
  const profile = await getUserProfile();
  if (!profile) return [];

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('organization_id', profile.organization_id)
    .order('last_contact', { ascending: false });

  if (error) throw error;

  return (data || []).map(lead => ({
    id: lead.id,
    name: lead.name,
    lastMessageTime: getRelativeTime(lead.last_contact),
    status: lead.status as any,
    channel: lead.channel as any,
  }));
}

export async function createLead(lead: Omit<Lead, 'id'>) {
  const profile = await getUserProfile();
  if (!profile) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('leads')
    .insert({
      organization_id: profile.organization_id,
      name: lead.name,
      status: lead.status,
      channel: lead.channel,
      last_contact: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateLead(id: string, updates: Partial<Lead>) {
  const { error } = await supabase
    .from('leads')
    .update({
      name: updates.name,
      status: updates.status,
      channel: updates.channel,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw error;
}

export async function getTours(): Promise<Tour[]> {
  const profile = await getUserProfile();
  if (!profile) return [];

  const { data, error } = await supabase
    .from('tours')
    .select('*')
    .eq('organization_id', profile.organization_id)
    .order('name');

  if (error) throw error;

  return (data || []).map(tour => ({
    id: tour.id,
    name: tour.name,
    duration: tour.duration,
    price: tour.price,
  }));
}

export async function createTour(tour: Omit<Tour, 'id'>) {
  const profile = await getUserProfile();
  if (!profile) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('tours')
    .insert({
      organization_id: profile.organization_id,
      name: tour.name,
      duration: tour.duration,
      price: tour.price,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getBookings(): Promise<Booking[]> {
  const profile = await getUserProfile();
  if (!profile) return [];

  const { data, error } = await supabase
    .from('bookings')
    .select('*, tours(name)')
    .eq('organization_id', profile.organization_id)
    .order('booking_date', { ascending: true });

  if (error) throw error;

  return (data || []).map(booking => ({
    id: booking.id,
    date: new Date(booking.booking_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    tourName: booking.tours?.name || 'Unknown Tour',
    clientName: booking.client_name,
    people: booking.people_count,
    status: booking.status as any,
    notes: booking.notes || undefined,
    pickupLocation: booking.pickup_location || undefined,
    leadId: booking.lead_id || undefined,
    tourId: booking.tour_id || undefined,
  }));
}

export async function createBooking(booking: Omit<Booking, 'id'>) {
  const profile = await getUserProfile();
  if (!profile) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      organization_id: profile.organization_id,
      tour_id: booking.tourId || null,
      lead_id: booking.leadId || null,
      client_name: booking.clientName,
      booking_date: booking.date,
      people_count: booking.people,
      status: booking.status,
      notes: booking.notes || null,
      pickup_location: booking.pickupLocation || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBooking(id: string, updates: Partial<Booking>) {
  const { error } = await supabase
    .from('bookings')
    .update({
      tour_id: updates.tourId || null,
      client_name: updates.clientName,
      booking_date: updates.date,
      people_count: updates.people,
      status: updates.status,
      notes: updates.notes || null,
      pickup_location: updates.pickupLocation || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw error;
}

export async function getNotifications(): Promise<Notification[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;

  return (data || []).map(notif => ({
    id: notif.id,
    message: notif.message,
    timestamp: getRelativeTime(notif.created_at),
    isRead: notif.is_read,
  }));
}

export async function markNotificationAsRead(id: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id);

  if (error) throw error;
}

export async function markAllNotificationsAsRead() {
  const user = await getCurrentUser();
  if (!user) return;

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .eq('is_read', false);

  if (error) throw error;
}

function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
