/**
 * Supabase Database Types
 * 
 * These types are generated based on the database schema.
 * In production, use `supabase gen types typescript` to generate these.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          role: 'user' | 'influencer' | 'admin' | 'super_admin'
          address_line1: string | null
          address_line2: string | null
          city: string | null
          county: string | null
          postcode: string | null
          country: string
          marketing_email: boolean
          marketing_sms: boolean
          referred_by: string | null
          referral_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          role?: 'user' | 'influencer' | 'admin' | 'super_admin'
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          county?: string | null
          postcode?: string | null
          country?: string
          marketing_email?: boolean
          marketing_sms?: boolean
          referred_by?: string | null
          referral_code?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          role?: 'user' | 'influencer' | 'admin' | 'super_admin'
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          county?: string | null
          postcode?: string | null
          country?: string
          marketing_email?: boolean
          marketing_sms?: boolean
          referred_by?: string | null
          referral_code?: string | null
          updated_at?: string
        }
      }
      competitions: {
        Row: {
          id: string
          slug: string
          title: string
          description: string
          image_url: string
          category: 'Toys' | 'Nursery' | 'Prams' | 'Holidays' | 'Cash' | 'Essentials'
          status: 'draft' | 'scheduled' | 'active' | 'ending_soon' | 'sold_out' | 'closed' | 'drawing' | 'drawn' | 'completed' | 'cancelled'
          competition_type: 'standard' | 'instant_win' | 'instant_win_with_end_prize'
          start_datetime: string
          end_datetime: string
          draw_datetime: string | null
          max_tickets: number
          tickets_sold: number
          max_tickets_per_user: number
          base_ticket_price_pence: number
          tiered_pricing: Json
          bundles: Json
          total_value_gbp: number
          retail_value_gbp: number | null
          end_prize: Json | null
          ticket_pool_locked: boolean
          ticket_pool_generated_at: string | null
          is_featured: boolean
          show_on_homepage: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description: string
          image_url: string
          category: 'Toys' | 'Nursery' | 'Prams' | 'Holidays' | 'Cash' | 'Essentials'
          status?: 'draft' | 'scheduled' | 'active' | 'ending_soon' | 'sold_out' | 'closed' | 'drawing' | 'drawn' | 'completed' | 'cancelled'
          competition_type: 'standard' | 'instant_win' | 'instant_win_with_end_prize'
          start_datetime: string
          end_datetime: string
          draw_datetime?: string | null
          max_tickets: number
          tickets_sold?: number
          max_tickets_per_user?: number
          base_ticket_price_pence: number
          tiered_pricing?: Json
          bundles?: Json
          total_value_gbp: number
          retail_value_gbp?: number | null
          end_prize?: Json | null
          ticket_pool_locked?: boolean
          ticket_pool_generated_at?: string | null
          is_featured?: boolean
          show_on_homepage?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          slug?: string
          title?: string
          description?: string
          image_url?: string
          category?: 'Toys' | 'Nursery' | 'Prams' | 'Holidays' | 'Cash' | 'Essentials'
          status?: 'draft' | 'scheduled' | 'active' | 'ending_soon' | 'sold_out' | 'closed' | 'drawing' | 'drawn' | 'completed' | 'cancelled'
          competition_type?: 'standard' | 'instant_win' | 'instant_win_with_end_prize'
          start_datetime?: string
          end_datetime?: string
          draw_datetime?: string | null
          max_tickets?: number
          tickets_sold?: number
          max_tickets_per_user?: number
          base_ticket_price_pence?: number
          tiered_pricing?: Json
          bundles?: Json
          total_value_gbp?: number
          retail_value_gbp?: number | null
          end_prize?: Json | null
          ticket_pool_locked?: boolean
          ticket_pool_generated_at?: string | null
          is_featured?: boolean
          show_on_homepage?: boolean
          updated_at?: string
        }
      }
      instant_win_prizes: {
        Row: {
          id: string
          competition_id: string
          prize_code: string
          name: string
          short_name: string | null
          type: 'Physical' | 'Voucher' | 'Cash' | 'SiteCredit'
          value_gbp: number
          cash_alternative_gbp: number | null
          total_quantity: number
          remaining_quantity: number
          description: string | null
          image_url: string | null
          notes: string | null
          tier: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          competition_id: string
          prize_code: string
          name: string
          short_name?: string | null
          type: 'Physical' | 'Voucher' | 'Cash' | 'SiteCredit'
          value_gbp: number
          cash_alternative_gbp?: number | null
          total_quantity: number
          remaining_quantity: number
          description?: string | null
          image_url?: string | null
          notes?: string | null
          tier?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          competition_id?: string
          prize_code?: string
          name?: string
          short_name?: string | null
          type?: 'Physical' | 'Voucher' | 'Cash' | 'SiteCredit'
          value_gbp?: number
          cash_alternative_gbp?: number | null
          total_quantity?: number
          remaining_quantity?: number
          description?: string | null
          image_url?: string | null
          notes?: string | null
          tier?: number
          updated_at?: string
        }
      }
      ticket_allocations: {
        Row: {
          id: string
          competition_id: string
          ticket_number: string
          prize_id: string | null
          is_sold: boolean
          sold_at: string | null
          sold_to_user_id: string | null
          order_id: string | null
          is_revealed: boolean
          revealed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          competition_id: string
          ticket_number: string
          prize_id?: string | null
          is_sold?: boolean
          sold_at?: string | null
          sold_to_user_id?: string | null
          order_id?: string | null
          is_revealed?: boolean
          revealed_at?: string | null
          created_at?: string
        }
        Update: {
          competition_id?: string
          ticket_number?: string
          prize_id?: string | null
          is_sold?: boolean
          sold_at?: string | null
          sold_to_user_id?: string | null
          order_id?: string | null
          is_revealed?: boolean
          revealed_at?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled'
          subtotal_pence: number
          discount_pence: number
          credit_applied_pence: number
          total_pence: number
          promo_code_id: string | null
          promo_code_value: string | null
          influencer_id: string | null
          influencer_code: string | null
          stripe_payment_intent_id: string | null
          stripe_checkout_session_id: string | null
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled'
          subtotal_pence: number
          discount_pence?: number
          credit_applied_pence?: number
          total_pence: number
          promo_code_id?: string | null
          promo_code_value?: string | null
          influencer_id?: string | null
          influencer_code?: string | null
          stripe_payment_intent_id?: string | null
          stripe_checkout_session_id?: string | null
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          status?: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled'
          subtotal_pence?: number
          discount_pence?: number
          credit_applied_pence?: number
          total_pence?: number
          promo_code_id?: string | null
          promo_code_value?: string | null
          influencer_id?: string | null
          influencer_code?: string | null
          stripe_payment_intent_id?: string | null
          stripe_checkout_session_id?: string | null
          paid_at?: string | null
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          competition_id: string
          ticket_count: number
          price_per_ticket_pence: number
          total_pence: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          competition_id: string
          ticket_count: number
          price_per_ticket_pence: number
          total_pence: number
          created_at?: string
        }
        Update: {
          order_id?: string
          competition_id?: string
          ticket_count?: number
          price_per_ticket_pence?: number
          total_pence?: number
        }
      }
      wallet_credits: {
        Row: {
          id: string
          user_id: string
          amount_pence: number
          remaining_pence: number
          status: 'active' | 'spent' | 'expired' | 'revoked' | 'withdrawn'
          source_type: string
          source_competition_id: string | null
          source_ticket_id: string | null
          source_order_id: string | null
          source_prize_id: string | null
          description: string
          expires_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount_pence: number
          remaining_pence: number
          status?: 'active' | 'spent' | 'expired' | 'revoked' | 'withdrawn'
          source_type: string
          source_competition_id?: string | null
          source_ticket_id?: string | null
          source_order_id?: string | null
          source_prize_id?: string | null
          description: string
          expires_at: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          amount_pence?: number
          remaining_pence?: number
          status?: 'active' | 'spent' | 'expired' | 'revoked' | 'withdrawn'
          source_type?: string
          source_competition_id?: string | null
          source_ticket_id?: string | null
          source_order_id?: string | null
          source_prize_id?: string | null
          description?: string
          expires_at?: string
          updated_at?: string
        }
      }
      wallet_transactions: {
        Row: {
          id: string
          user_id: string
          credit_id: string | null
          type: 'credit' | 'debit' | 'expiry' | 'revocation' | 'withdrawal'
          amount_pence: number
          balance_after_pence: number
          order_id: string | null
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          credit_id?: string | null
          type: 'credit' | 'debit' | 'expiry' | 'revocation' | 'withdrawal'
          amount_pence: number
          balance_after_pence: number
          order_id?: string | null
          description: string
          created_at?: string
        }
        Update: {
          user_id?: string
          credit_id?: string | null
          type?: 'credit' | 'debit' | 'expiry' | 'revocation' | 'withdrawal'
          amount_pence?: number
          balance_after_pence?: number
          order_id?: string | null
          description?: string
        }
      }
      promo_codes: {
        Row: {
          id: string
          code: string
          type: 'percentage' | 'fixed_value' | 'free_tickets'
          value: number
          max_uses: number | null
          current_uses: number
          max_uses_per_user: number
          min_order_pence: number
          valid_from: string
          valid_until: string | null
          is_active: boolean
          competition_ids: string[]
          new_customers_only: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          type: 'percentage' | 'fixed_value' | 'free_tickets'
          value: number
          max_uses?: number | null
          current_uses?: number
          max_uses_per_user?: number
          min_order_pence?: number
          valid_from?: string
          valid_until?: string | null
          is_active?: boolean
          competition_ids?: string[]
          new_customers_only?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          code?: string
          type?: 'percentage' | 'fixed_value' | 'free_tickets'
          value?: number
          max_uses?: number | null
          current_uses?: number
          max_uses_per_user?: number
          min_order_pence?: number
          valid_from?: string
          valid_until?: string | null
          is_active?: boolean
          competition_ids?: string[]
          new_customers_only?: boolean
          updated_at?: string
        }
      }
      winners: {
        Row: {
          id: string
          user_id: string | null
          display_name: string
          location: string | null
          prize_name: string
          prize_value_gbp: number | null
          prize_image_url: string | null
          competition_id: string | null
          ticket_id: string | null
          win_type: string
          is_public: boolean
          show_in_ticker: boolean
          featured: boolean
          winner_photo_url: string | null
          testimonial: string | null
          won_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          display_name: string
          location?: string | null
          prize_name: string
          prize_value_gbp?: number | null
          prize_image_url?: string | null
          competition_id?: string | null
          ticket_id?: string | null
          win_type?: string
          is_public?: boolean
          show_in_ticker?: boolean
          featured?: boolean
          winner_photo_url?: string | null
          testimonial?: string | null
          won_at?: string
          created_at?: string
        }
        Update: {
          user_id?: string | null
          display_name?: string
          location?: string | null
          prize_name?: string
          prize_value_gbp?: number | null
          prize_image_url?: string | null
          competition_id?: string | null
          ticket_id?: string | null
          win_type?: string
          is_public?: boolean
          show_in_ticker?: boolean
          featured?: boolean
          winner_photo_url?: string | null
          testimonial?: string | null
          won_at?: string
        }
      }
      prize_fulfillments: {
        Row: {
          id: string
          user_id: string
          ticket_id: string
          prize_id: string
          competition_id: string
          status: 'pending' | 'prize_selected' | 'cash_selected' | 'processing' | 'dispatched' | 'delivered' | 'completed' | 'expired'
          choice: string | null
          value_pence: number
          claim_deadline: string
          notified_at: string | null
          responded_at: string | null
          dispatched_at: string | null
          delivered_at: string | null
          tracking_number: string | null
          delivery_address: Json | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          ticket_id: string
          prize_id: string
          competition_id: string
          status?: 'pending' | 'prize_selected' | 'cash_selected' | 'processing' | 'dispatched' | 'delivered' | 'completed' | 'expired'
          choice?: string | null
          value_pence: number
          claim_deadline: string
          notified_at?: string | null
          responded_at?: string | null
          dispatched_at?: string | null
          delivered_at?: string | null
          tracking_number?: string | null
          delivery_address?: Json | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          ticket_id?: string
          prize_id?: string
          competition_id?: string
          status?: 'pending' | 'prize_selected' | 'cash_selected' | 'processing' | 'dispatched' | 'delivered' | 'completed' | 'expired'
          choice?: string | null
          value_pence?: number
          claim_deadline?: string
          notified_at?: string | null
          responded_at?: string | null
          dispatched_at?: string | null
          delivered_at?: string | null
          tracking_number?: string | null
          delivery_address?: Json | null
          notes?: string | null
          updated_at?: string
        }
      }
      influencers: {
        Row: {
          id: string
          user_id: string
          slug: string
          display_name: string
          bio: string | null
          profile_image_url: string | null
          featured_competition_id: string | null
          commission_tier: number
          social_links: Json
          is_active: boolean
          is_ambassador: boolean
          total_sales_pence: number
          total_commission_pence: number
          monthly_sales_pence: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          slug: string
          display_name: string
          bio?: string | null
          profile_image_url?: string | null
          featured_competition_id?: string | null
          commission_tier?: number
          social_links?: Json
          is_active?: boolean
          is_ambassador?: boolean
          total_sales_pence?: number
          total_commission_pence?: number
          monthly_sales_pence?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          slug?: string
          display_name?: string
          bio?: string | null
          profile_image_url?: string | null
          featured_competition_id?: string | null
          commission_tier?: number
          social_links?: Json
          is_active?: boolean
          is_ambassador?: boolean
          total_sales_pence?: number
          total_commission_pence?: number
          monthly_sales_pence?: number
          updated_at?: string
        }
      }
      influencer_sales: {
        Row: {
          id: string
          influencer_id: string
          order_id: string
          order_value_pence: number
          commission_rate: number
          commission_pence: number
          status: string
          created_at: string
          paid_at: string | null
        }
        Insert: {
          id?: string
          influencer_id: string
          order_id: string
          order_value_pence: number
          commission_rate: number
          commission_pence: number
          status?: string
          created_at?: string
          paid_at?: string | null
        }
        Update: {
          influencer_id?: string
          order_id?: string
          order_value_pence?: number
          commission_rate?: number
          commission_pence?: number
          status?: string
          paid_at?: string | null
        }
      }
      withdrawal_requests: {
        Row: {
          id: string
          user_id: string
          amount_pence: number
          status: string
          bank_details: Json | null
          reviewed_by: string | null
          reviewed_at: string | null
          rejection_reason: string | null
          created_at: string
          paid_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          amount_pence: number
          status?: string
          bank_details?: Json | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          rejection_reason?: string | null
          created_at?: string
          paid_at?: string | null
        }
        Update: {
          user_id?: string
          amount_pence?: number
          status?: string
          bank_details?: Json | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          rejection_reason?: string | null
          paid_at?: string | null
        }
      }
    }
    Views: {
      active_competitions_view: {
        Row: {
          id: string
          slug: string
          title: string
          description: string
          image_url: string
          category: string
          status: string
          competition_type: string
          start_datetime: string
          end_datetime: string
          max_tickets: number
          tickets_sold: number
          base_ticket_price_pence: number
          tiered_pricing: Json
          total_value_gbp: number
          end_prize: Json | null
          is_featured: boolean
          total_instant_win_prizes: number
          remaining_instant_win_prizes: number
        }
      }
      wallet_balance_view: {
        Row: {
          user_id: string
          available_balance_pence: number
          expiring_soon_pence: number
          next_expiry_date: string | null
        }
      }
      recent_winners_view: {
        Row: {
          id: string
          display_name: string
          location: string | null
          prize_name: string
          prize_value_gbp: number | null
          prize_image_url: string | null
          won_at: string
        }
      }
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_influencer: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      competition_category: 'Toys' | 'Nursery' | 'Prams' | 'Holidays' | 'Cash' | 'Essentials'
      competition_status: 'draft' | 'scheduled' | 'active' | 'ending_soon' | 'sold_out' | 'closed' | 'drawing' | 'drawn' | 'completed' | 'cancelled'
      competition_type: 'standard' | 'instant_win' | 'instant_win_with_end_prize'
      credit_status: 'active' | 'spent' | 'expired' | 'revoked' | 'withdrawn'
      fulfillment_status: 'pending' | 'prize_selected' | 'cash_selected' | 'processing' | 'dispatched' | 'delivered' | 'completed' | 'expired'
      order_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled'
      prize_type: 'Physical' | 'Voucher' | 'Cash' | 'SiteCredit'
      promo_code_type: 'percentage' | 'fixed_value' | 'free_tickets'
      user_role: 'user' | 'influencer' | 'admin' | 'super_admin'
      wallet_transaction_type: 'credit' | 'debit' | 'expiry' | 'revocation' | 'withdrawal'
    }
  }
}

// Helper types for easier use
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updateable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Views<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
