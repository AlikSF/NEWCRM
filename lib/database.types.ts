export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          logo_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          logo_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          logo_url?: string | null
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          organization_id: string
          full_name: string
          avatar_url: string | null
          role: string
          created_at: string
        }
        Insert: {
          id: string
          organization_id: string
          full_name: string
          avatar_url?: string | null
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          full_name?: string
          avatar_url?: string | null
          role?: string
          created_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          organization_id: string
          name: string
          email: string | null
          phone: string | null
          status: string
          channel: string
          last_contact: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          email?: string | null
          phone?: string | null
          status?: string
          channel?: string
          last_contact?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          status?: string
          channel?: string
          last_contact?: string
          created_at?: string
          updated_at?: string
        }
      }
      tours: {
        Row: {
          id: string
          organization_id: string
          name: string
          duration: string
          price: number
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          duration: string
          price?: number
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          duration?: string
          price?: number
          description?: string | null
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          organization_id: string
          tour_id: string | null
          lead_id: string | null
          client_name: string
          booking_date: string
          people_count: number
          status: string
          notes: string | null
          pickup_location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          tour_id?: string | null
          lead_id?: string | null
          client_name: string
          booking_date: string
          people_count?: number
          status?: string
          notes?: string | null
          pickup_location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          tour_id?: string | null
          lead_id?: string | null
          client_name?: string
          booking_date?: string
          people_count?: number
          status?: string
          notes?: string | null
          pickup_location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          organization_id: string
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          organization_id: string
          message: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string
          message?: string
          is_read?: boolean
          created_at?: string
        }
      }
    }
  }
}
