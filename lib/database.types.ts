export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          primary_color: string;
          settings: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          primary_color?: string;
          settings?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          logo_url?: string | null;
          primary_color?: string;
          settings?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          organization_id: string;
          email: string;
          full_name: string;
          role: 'admin' | 'agent' | 'viewer';
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          email: string;
          full_name: string;
          role?: 'admin' | 'agent' | 'viewer';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          email?: string;
          full_name?: string;
          role?: 'admin' | 'agent' | 'viewer';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          organization_id: string;
          full_name: string;
          email: string | null;
          phone: string | null;
          source: 'website' | 'telegram' | 'whatsapp' | 'referral' | 'direct' | 'other';
          status: 'new' | 'contacted' | 'qualified' | 'lost' | 'converted';
          notes: string | null;
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          full_name: string;
          email?: string | null;
          phone?: string | null;
          source?: 'website' | 'telegram' | 'whatsapp' | 'referral' | 'direct' | 'other';
          status?: 'new' | 'contacted' | 'qualified' | 'lost' | 'converted';
          notes?: string | null;
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          full_name?: string;
          email?: string | null;
          phone?: string | null;
          source?: 'website' | 'telegram' | 'whatsapp' | 'referral' | 'direct' | 'other';
          status?: 'new' | 'contacted' | 'qualified' | 'lost' | 'converted';
          notes?: string | null;
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tours: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          description: string | null;
          duration_days: number;
          price: number;
          currency: string;
          max_participants: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          description?: string | null;
          duration_days?: number;
          price?: number;
          currency?: string;
          max_participants?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          description?: string | null;
          duration_days?: number;
          price?: number;
          currency?: string;
          max_participants?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          organization_id: string;
          lead_id: string | null;
          tour_id: string | null;
          booking_date: string;
          num_participants: number;
          total_amount: number;
          currency: string;
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          payment_status: 'unpaid' | 'partial' | 'paid' | 'refunded';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          lead_id?: string | null;
          tour_id?: string | null;
          booking_date: string;
          num_participants?: number;
          total_amount?: number;
          currency?: string;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          payment_status?: 'unpaid' | 'partial' | 'paid' | 'refunded';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          lead_id?: string | null;
          tour_id?: string | null;
          booking_date?: string;
          num_participants?: number;
          total_amount?: number;
          currency?: string;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          payment_status?: 'unpaid' | 'partial' | 'paid' | 'refunded';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          organization_id: string;
          lead_id: string | null;
          channel: 'telegram' | 'whatsapp' | 'website' | 'email' | 'other';
          direction: 'inbound' | 'outbound';
          content: string;
          sender_name: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          lead_id?: string | null;
          channel?: 'telegram' | 'whatsapp' | 'website' | 'email' | 'other';
          direction?: 'inbound' | 'outbound';
          content: string;
          sender_name?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          lead_id?: string | null;
          channel?: 'telegram' | 'whatsapp' | 'website' | 'email' | 'other';
          direction?: 'inbound' | 'outbound';
          content?: string;
          sender_name?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string | null;
          type: 'new_lead' | 'new_message' | 'booking_confirmed' | 'booking_cancelled' | 'payment_received' | 'system';
          title: string;
          message: string;
          link_to: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id?: string | null;
          type: 'new_lead' | 'new_message' | 'booking_confirmed' | 'booking_cancelled' | 'payment_received' | 'system';
          title: string;
          message: string;
          link_to?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          user_id?: string | null;
          type?: 'new_lead' | 'new_message' | 'booking_confirmed' | 'booking_cancelled' | 'payment_received' | 'system';
          title?: string;
          message?: string;
          link_to?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
    };
  };
}
