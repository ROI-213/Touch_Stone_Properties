export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity: string | null
          entity_id: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity?: string | null
          entity_id?: string | null
          id?: string
          metadata?: Json | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity?: string | null
          entity_id?: string | null
          id?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      amenities: {
        Row: {
          category: string | null
          created_at: string
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      banners: {
        Row: {
          created_at: string
          cta_link: string | null
          cta_text: string | null
          display_order: number
          id: string
          image_url: string | null
          is_active: boolean
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      builders: {
        Row: {
          active: boolean
          alternative_email: string | null
          alternative_phone: string | null
          city: string | null
          contact_person_name: string | null
          contact_type: string
          created_at: string
          created_by: string | null
          description: string | null
          designation: string | null
          display_name: string | null
          display_order: number
          email: string | null
          id: string
          locality: string | null
          logo_url: string | null
          name: string
          office_address: string | null
          preferred_contact_method: string | null
          primary_phone: string | null
          rera_prefix: string | null
          show_on_website: boolean
          slug: string
          updated_at: string
          updated_by: string | null
          website: string | null
          whatsapp_number: string | null
        }
        Insert: {
          active?: boolean
          alternative_email?: string | null
          alternative_phone?: string | null
          city?: string | null
          contact_person_name?: string | null
          contact_type?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          designation?: string | null
          display_name?: string | null
          display_order?: number
          email?: string | null
          id?: string
          locality?: string | null
          logo_url?: string | null
          name: string
          office_address?: string | null
          preferred_contact_method?: string | null
          primary_phone?: string | null
          rera_prefix?: string | null
          show_on_website?: boolean
          slug: string
          updated_at?: string
          updated_by?: string | null
          website?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          active?: boolean
          alternative_email?: string | null
          alternative_phone?: string | null
          city?: string | null
          contact_person_name?: string | null
          contact_type?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          designation?: string | null
          display_name?: string | null
          display_order?: number
          email?: string | null
          id?: string
          locality?: string | null
          logo_url?: string | null
          name?: string
          office_address?: string | null
          preferred_contact_method?: string | null
          primary_phone?: string | null
          rera_prefix?: string | null
          show_on_website?: boolean
          slug?: string
          updated_at?: string
          updated_by?: string | null
          website?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      contact_info: {
        Row: {
          address: string | null
          business_hours: string | null
          copyright: string | null
          created_at: string
          email: string | null
          facebook: string | null
          id: string
          instagram: string | null
          linkedin: string | null
          map_url: string | null
          phone: string | null
          twitter: string | null
          updated_at: string
          whatsapp: string | null
          youtube: string | null
        }
        Insert: {
          address?: string | null
          business_hours?: string | null
          copyright?: string | null
          created_at?: string
          email?: string | null
          facebook?: string | null
          id?: string
          instagram?: string | null
          linkedin?: string | null
          map_url?: string | null
          phone?: string | null
          twitter?: string | null
          updated_at?: string
          whatsapp?: string | null
          youtube?: string | null
        }
        Update: {
          address?: string | null
          business_hours?: string | null
          copyright?: string | null
          created_at?: string
          email?: string | null
          facebook?: string | null
          id?: string
          instagram?: string | null
          linkedin?: string | null
          map_url?: string | null
          phone?: string | null
          twitter?: string | null
          updated_at?: string
          whatsapp?: string | null
          youtube?: string | null
        }
        Relationships: []
      }
      contact_notes: {
        Row: {
          contact_id: string
          created_at: string
          created_by: string | null
          follow_up_date: string | null
          follow_up_time: string | null
          id: string
          note_description: string
          note_title: string | null
          note_type: string | null
          priority: string
          property_id: string | null
          status: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          contact_id: string
          created_at?: string
          created_by?: string | null
          follow_up_date?: string | null
          follow_up_time?: string | null
          id?: string
          note_description: string
          note_title?: string | null
          note_type?: string | null
          priority?: string
          property_id?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          contact_id?: string
          created_at?: string
          created_by?: string | null
          follow_up_date?: string | null
          follow_up_time?: string | null
          id?: string
          note_description?: string
          note_title?: string | null
          note_type?: string | null
          priority?: string
          property_id?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_notes_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "builders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_notes_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      content_sections: {
        Row: {
          body: string | null
          created_at: string
          cta_link: string | null
          cta_text: string | null
          display_order: number
          extra: Json
          id: string
          image_url: string | null
          is_active: boolean
          key: string
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          display_order?: number
          extra?: Json
          id?: string
          image_url?: string | null
          is_active?: boolean
          key: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          display_order?: number
          extra?: Json
          id?: string
          image_url?: string | null
          is_active?: boolean
          key?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          assigned_staff_id: string | null
          assigned_staff_name: string | null
          budget: string | null
          created_at: string
          email: string
          id: string
          images: Json
          location: string | null
          message: string | null
          name: string
          notes: string | null
          page_url: string | null
          phone: string
          property_id: string | null
          property_title: string | null
          requirement_type: string
          source: string | null
          status: string
          updated_at: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          assigned_staff_id?: string | null
          assigned_staff_name?: string | null
          budget?: string | null
          created_at?: string
          email: string
          id?: string
          images?: Json
          location?: string | null
          message?: string | null
          name: string
          notes?: string | null
          page_url?: string | null
          phone: string
          property_id?: string | null
          property_title?: string | null
          requirement_type?: string
          source?: string | null
          status?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_staff_id?: string | null
          assigned_staff_name?: string | null
          budget?: string | null
          created_at?: string
          email?: string
          id?: string
          images?: Json
          location?: string | null
          message?: string | null
          name?: string
          notes?: string | null
          page_url?: string | null
          phone?: string
          property_id?: string | null
          property_title?: string | null
          requirement_type?: string
          source?: string | null
          status?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enquiries_assigned_staff_id_fkey"
            columns: ["assigned_staff_id"]
            isOneToOne: false
            referencedRelation: "property_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enquiries_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      form_options: {
        Row: {
          created_at: string
          display_order: number
          field_key: string
          form_key: string
          id: string
          is_active: boolean
          label: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          field_key: string
          form_key: string
          id?: string
          is_active?: boolean
          label: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          display_order?: number
          field_key?: string
          form_key?: string
          id?: string
          is_active?: boolean
          label?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      hot_property_settings: {
        Row: {
          badge_text: string
          created_at: string
          cta_contact_url: string | null
          cta_view_url: string | null
          enabled: boolean
          highlights: Json
          id: string
          override_area: string | null
          override_bathrooms: number | null
          override_bedrooms: number | null
          override_description: string | null
          override_image: string | null
          override_location: string | null
          override_price: string | null
          override_property_type: string | null
          override_title: string | null
          property_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          badge_text?: string
          created_at?: string
          cta_contact_url?: string | null
          cta_view_url?: string | null
          enabled?: boolean
          highlights?: Json
          id?: string
          override_area?: string | null
          override_bathrooms?: number | null
          override_bedrooms?: number | null
          override_description?: string | null
          override_image?: string | null
          override_location?: string | null
          override_price?: string | null
          override_property_type?: string | null
          override_title?: string | null
          property_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          badge_text?: string
          created_at?: string
          cta_contact_url?: string | null
          cta_view_url?: string | null
          enabled?: boolean
          highlights?: Json
          id?: string
          override_area?: string | null
          override_bathrooms?: number | null
          override_bedrooms?: number | null
          override_description?: string | null
          override_image?: string | null
          override_location?: string | null
          override_price?: string | null
          override_property_type?: string | null
          override_title?: string | null
          property_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hot_property_settings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          active: boolean
          city: string
          created_at: string
          display_order: number
          id: string
          locality: string
          slug: string
          updated_at: string
          zone: string
        }
        Insert: {
          active?: boolean
          city?: string
          created_at?: string
          display_order?: number
          id?: string
          locality: string
          slug: string
          updated_at?: string
          zone: string
        }
        Update: {
          active?: boolean
          city?: string
          created_at?: string
          display_order?: number
          id?: string
          locality?: string
          slug?: string
          updated_at?: string
          zone?: string
        }
        Relationships: []
      }
      navigation_items: {
        Row: {
          created_at: string
          display_order: number
          href: string
          id: string
          is_active: boolean
          label: string
          location: string
          parent_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          href: string
          id?: string
          is_active?: boolean
          label: string
          location?: string
          parent_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          href?: string
          id?: string
          is_active?: boolean
          label?: string
          location?: string
          parent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "navigation_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "navigation_items"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string | null
          agent_id: string | null
          amenities_count: number | null
          assigned_staff_id: string | null
          bhk_options: string[] | null
          brochure_url: string | null
          builder_id: string | null
          carpet_area: string | null
          channel_partner_id: string | null
          clubhouse_size: string | null
          contact_phone: string | null
          created_at: string
          details: Json
          directions_link: string | null
          display_order: number
          floors: number | null
          hero_image: string | null
          highlights: string | null
          id: string
          is_active: boolean
          is_featured: boolean
          is_hot: boolean
          is_new_launch: boolean
          is_pre_launch: boolean
          is_ready_to_move: boolean
          is_top_featured: boolean
          is_trending: boolean
          land_parcel: string | null
          listing_type: string
          location_advantages: string | null
          location_id: string | null
          map_link: string | null
          open_space_pct: number | null
          overview: string | null
          owner_id: string | null
          possession_date: string | null
          price_max: number | null
          price_min: number | null
          price_per_sqft: number | null
          project_name: string
          project_status: string | null
          property_category: string | null
          property_type: string
          rera_number: string | null
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          slug: string
          starting_price: number | null
          top_featured_rank: number | null
          total_units: number | null
          towers: number | null
          unit_sizes: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          agent_id?: string | null
          amenities_count?: number | null
          assigned_staff_id?: string | null
          bhk_options?: string[] | null
          brochure_url?: string | null
          builder_id?: string | null
          carpet_area?: string | null
          channel_partner_id?: string | null
          clubhouse_size?: string | null
          contact_phone?: string | null
          created_at?: string
          details?: Json
          directions_link?: string | null
          display_order?: number
          floors?: number | null
          hero_image?: string | null
          highlights?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          is_hot?: boolean
          is_new_launch?: boolean
          is_pre_launch?: boolean
          is_ready_to_move?: boolean
          is_top_featured?: boolean
          is_trending?: boolean
          land_parcel?: string | null
          listing_type?: string
          location_advantages?: string | null
          location_id?: string | null
          map_link?: string | null
          open_space_pct?: number | null
          overview?: string | null
          owner_id?: string | null
          possession_date?: string | null
          price_max?: number | null
          price_min?: number | null
          price_per_sqft?: number | null
          project_name: string
          project_status?: string | null
          property_category?: string | null
          property_type: string
          rera_number?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug: string
          starting_price?: number | null
          top_featured_rank?: number | null
          total_units?: number | null
          towers?: number | null
          unit_sizes?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          agent_id?: string | null
          amenities_count?: number | null
          assigned_staff_id?: string | null
          bhk_options?: string[] | null
          brochure_url?: string | null
          builder_id?: string | null
          carpet_area?: string | null
          channel_partner_id?: string | null
          clubhouse_size?: string | null
          contact_phone?: string | null
          created_at?: string
          details?: Json
          directions_link?: string | null
          display_order?: number
          floors?: number | null
          hero_image?: string | null
          highlights?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          is_hot?: boolean
          is_new_launch?: boolean
          is_pre_launch?: boolean
          is_ready_to_move?: boolean
          is_top_featured?: boolean
          is_trending?: boolean
          land_parcel?: string | null
          listing_type?: string
          location_advantages?: string | null
          location_id?: string | null
          map_link?: string | null
          open_space_pct?: number | null
          overview?: string | null
          owner_id?: string | null
          possession_date?: string | null
          price_max?: number | null
          price_min?: number | null
          price_per_sqft?: number | null
          project_name?: string
          project_status?: string | null
          property_category?: string | null
          property_type?: string
          rera_number?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug?: string
          starting_price?: number | null
          top_featured_rank?: number | null
          total_units?: number | null
          towers?: number | null
          unit_sizes?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "builders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_assigned_staff_id_fkey"
            columns: ["assigned_staff_id"]
            isOneToOne: false
            referencedRelation: "staff_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_builder_id_fkey"
            columns: ["builder_id"]
            isOneToOne: false
            referencedRelation: "builders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_channel_partner_id_fkey"
            columns: ["channel_partner_id"]
            isOneToOne: false
            referencedRelation: "builders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "builders"
            referencedColumns: ["id"]
          },
        ]
      }
      property_amenities: {
        Row: {
          amenity_id: string
          property_id: string
        }
        Insert: {
          amenity_id: string
          property_id: string
        }
        Update: {
          amenity_id?: string
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_amenities_amenity_id_fkey"
            columns: ["amenity_id"]
            isOneToOne: false
            referencedRelation: "amenities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_amenities_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_assignments: {
        Row: {
          assigned_area: string | null
          created_at: string
          display_order: number
          email: string | null
          experience_years: number | null
          id: string
          id_url: string | null
          is_active: boolean
          is_primary: boolean
          languages: string[]
          notes: string | null
          phone: string
          photo_url: string | null
          property_id: string
          qr_code_url: string | null
          role: string | null
          show_publicly: boolean
          signature_url: string | null
          staff_name: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          assigned_area?: string | null
          created_at?: string
          display_order?: number
          email?: string | null
          experience_years?: number | null
          id?: string
          id_url?: string | null
          is_active?: boolean
          is_primary?: boolean
          languages?: string[]
          notes?: string | null
          phone: string
          photo_url?: string | null
          property_id: string
          qr_code_url?: string | null
          role?: string | null
          show_publicly?: boolean
          signature_url?: string | null
          staff_name: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          assigned_area?: string | null
          created_at?: string
          display_order?: number
          email?: string | null
          experience_years?: number | null
          id?: string
          id_url?: string | null
          is_active?: boolean
          is_primary?: boolean
          languages?: string[]
          notes?: string | null
          phone?: string
          photo_url?: string | null
          property_id?: string
          qr_code_url?: string | null
          role?: string | null
          show_publicly?: boolean
          signature_url?: string | null
          staff_name?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_assignments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_configurations: {
        Row: {
          bhk: string | null
          carpet_area: string | null
          display_order: number
          id: string
          price: number | null
          property_id: string
          super_area: string | null
        }
        Insert: {
          bhk?: string | null
          carpet_area?: string | null
          display_order?: number
          id?: string
          price?: number | null
          property_id: string
          super_area?: string | null
        }
        Update: {
          bhk?: string | null
          carpet_area?: string | null
          display_order?: number
          id?: string
          price?: number | null
          property_id?: string
          super_area?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_configurations_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_images: {
        Row: {
          caption: string | null
          created_at: string
          display_order: number
          id: string
          image_type: string
          property_id: string
          url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_type?: string
          property_id: string
          url: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_type?: string
          property_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_nearby: {
        Row: {
          category: string | null
          display_order: number
          distance: string | null
          id: string
          name: string
          property_id: string
        }
        Insert: {
          category?: string | null
          display_order?: number
          distance?: string | null
          id?: string
          name: string
          property_id: string
        }
        Update: {
          category?: string | null
          display_order?: number
          distance?: string | null
          id?: string
          name?: string
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_nearby_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_prices: {
        Row: {
          display_order: number
          id: string
          price_from: number | null
          price_to: number | null
          property_id: string
          unit_type: string | null
        }
        Insert: {
          display_order?: number
          id?: string
          price_from?: number | null
          price_to?: number | null
          property_id: string
          unit_type?: string | null
        }
        Update: {
          display_order?: number
          id?: string
          price_from?: number | null
          price_to?: number | null
          property_id?: string
          unit_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_prices_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      sell_property_enquiries: {
        Row: {
          amenities: string[] | null
          asking_price: number | null
          built_up_area: number | null
          city: string | null
          configuration: string | null
          coordinates: Json | null
          created_at: string
          description: string | null
          full_address: string | null
          furnishing: string | null
          google_map_link: string | null
          id: string
          locality: string | null
          notes: string | null
          photos: string[] | null
          possession: string | null
          property_type: string | null
          seller_email: string | null
          seller_name: string
          seller_phone: string
          status: string
          updated_at: string
          zone: string | null
        }
        Insert: {
          amenities?: string[] | null
          asking_price?: number | null
          built_up_area?: number | null
          city?: string | null
          configuration?: string | null
          coordinates?: Json | null
          created_at?: string
          description?: string | null
          full_address?: string | null
          furnishing?: string | null
          google_map_link?: string | null
          id?: string
          locality?: string | null
          notes?: string | null
          photos?: string[] | null
          possession?: string | null
          property_type?: string | null
          seller_email?: string | null
          seller_name: string
          seller_phone: string
          status?: string
          updated_at?: string
          zone?: string | null
        }
        Update: {
          amenities?: string[] | null
          asking_price?: number | null
          built_up_area?: number | null
          city?: string | null
          configuration?: string | null
          coordinates?: Json | null
          created_at?: string
          description?: string | null
          full_address?: string | null
          furnishing?: string | null
          google_map_link?: string | null
          id?: string
          locality?: string | null
          notes?: string | null
          photos?: string[] | null
          possession?: string | null
          property_type?: string | null
          seller_email?: string | null
          seller_name?: string
          seller_phone?: string
          status?: string
          updated_at?: string
          zone?: string | null
        }
        Relationships: []
      }
      seo_metadata: {
        Row: {
          canonical: string | null
          created_at: string
          description: string | null
          id: string
          keywords: string | null
          og_image: string | null
          route: string
          title: string | null
          updated_at: string
        }
        Insert: {
          canonical?: string | null
          created_at?: string
          description?: string | null
          id?: string
          keywords?: string | null
          og_image?: string | null
          route: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          canonical?: string | null
          created_at?: string
          description?: string | null
          id?: string
          keywords?: string | null
          og_image?: string | null
          route?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      staff_permissions: {
        Row: {
          can_add: boolean
          can_delete: boolean
          can_edit: boolean
          can_export: boolean
          can_publish: boolean
          can_view: boolean
          created_at: string
          id: string
          module_name: string
          staff_user_id: string
          updated_at: string
        }
        Insert: {
          can_add?: boolean
          can_delete?: boolean
          can_edit?: boolean
          can_export?: boolean
          can_publish?: boolean
          can_view?: boolean
          created_at?: string
          id?: string
          module_name: string
          staff_user_id: string
          updated_at?: string
        }
        Update: {
          can_add?: boolean
          can_delete?: boolean
          can_edit?: boolean
          can_export?: boolean
          can_publish?: boolean
          can_view?: boolean
          created_at?: string
          id?: string
          module_name?: string
          staff_user_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_permissions_staff_user_id_fkey"
            columns: ["staff_user_id"]
            isOneToOne: false
            referencedRelation: "staff_users"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_tasks: {
        Row: {
          admin_remarks: string | null
          assigned_to: string | null
          attachment_url: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string
          related_module: string | null
          staff_notes: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          admin_remarks?: string | null
          assigned_to?: string | null
          attachment_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          related_module?: string | null
          staff_notes?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          admin_remarks?: string | null
          assigned_to?: string | null
          attachment_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          related_module?: string | null
          staff_notes?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "staff_users"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_users: {
        Row: {
          auth_user_id: string
          created_at: string
          created_by: string | null
          designation: string | null
          email: string
          id: string
          mobile: string | null
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          auth_user_id: string
          created_at?: string
          created_by?: string | null
          designation?: string | null
          email: string
          id?: string
          mobile?: string | null
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          auth_user_id?: string
          created_at?: string
          created_by?: string | null
          designation?: string | null
          email?: string
          id?: string
          mobile?: string | null
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      success_stories: {
        Row: {
          badge_text: string | null
          body: string | null
          button_text: string | null
          category: string | null
          client: string | null
          client_label: string | null
          contact_button_link: string | null
          created_at: string
          cta_text: string | null
          display_order: number
          id: string
          image_url: string | null
          images: Json
          is_active: boolean
          location: string | null
          services_provided: Json
          slug: string | null
          story_type: string
          summary: string | null
          title: string
          updated_at: string
          whatsapp_link: string | null
          whatsapp_number: string | null
        }
        Insert: {
          badge_text?: string | null
          body?: string | null
          button_text?: string | null
          category?: string | null
          client?: string | null
          client_label?: string | null
          contact_button_link?: string | null
          created_at?: string
          cta_text?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          images?: Json
          is_active?: boolean
          location?: string | null
          services_provided?: Json
          slug?: string | null
          story_type?: string
          summary?: string | null
          title: string
          updated_at?: string
          whatsapp_link?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          badge_text?: string | null
          body?: string | null
          button_text?: string | null
          category?: string | null
          client?: string | null
          client_label?: string | null
          contact_button_link?: string | null
          created_at?: string
          cta_text?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          images?: Json
          is_active?: boolean
          location?: string | null
          services_provided?: Json
          slug?: string | null
          story_type?: string
          summary?: string | null
          title?: string
          updated_at?: string
          whatsapp_link?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          category: string
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          location: string | null
          name: string
          quote: string
          rating: number | null
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          location?: string | null
          name: string
          quote: string
          rating?: number | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          location?: string | null
          name?: string
          quote?: string
          rating?: number | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          property_id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_staff_user_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_staff_permission: {
        Args: { _action: string; _module: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "customer" | "staff"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "customer", "staff"],
    },
  },
} as const
