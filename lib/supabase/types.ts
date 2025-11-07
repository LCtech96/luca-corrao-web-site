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
      accommodations: {
        Row: {
          id: string
          name: string
          subtitle: string | null
          description: string
          address: string | null
          distance: string | null
          capacity: string
          features: string[]
          highlight: string | null
          main_image: string
          images: string[]
          image_descriptions: string[] | null
          main_image_file_id: string | null
          image_file_ids: string[] | null
          price: string | null
          cleaning_fee: number | null
          rating: number | null
          owner: string
          is_active: boolean
          created_at: string
          updated_at: string
          slug?: string
        }
        Insert: {
          id?: string
          name: string
          subtitle?: string | null
          description: string
          address?: string | null
          distance?: string | null
          capacity: string
          features?: string[]
          highlight?: string | null
          main_image: string
          images?: string[]
          image_descriptions?: string[] | null
          main_image_file_id?: string | null
          image_file_ids?: string[] | null
          price?: string | null
          cleaning_fee?: number | null
          rating?: number | null
          owner: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          slug?: string
        }
        Update: {
          id?: string
          name?: string
          subtitle?: string | null
          description?: string
          address?: string | null
          distance?: string | null
          capacity?: string
          features?: string[]
          highlight?: string | null
          main_image?: string
          images?: string[]
          image_descriptions?: string[] | null
          main_image_file_id?: string | null
          image_file_ids?: string[] | null
          price?: string | null
          cleaning_fee?: number | null
          rating?: number | null
          owner?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          slug?: string
        }
      }
      files: {
        Row: {
          id: string
          storage_id: string
          file_name: string
          file_type: string
          file_size: number
          description: string | null
          category: string
          owner_id: string | null
          uploaded_at: string
          is_active: boolean
          deleted_at: string | null
          updated_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          storage_id: string
          file_name: string
          file_type: string
          file_size: number
          description?: string | null
          category?: string
          owner_id?: string | null
          uploaded_at?: string
          is_active?: boolean
          deleted_at?: string | null
          updated_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          storage_id?: string
          file_name?: string
          file_type?: string
          file_size?: number
          description?: string | null
          category?: string
          owner_id?: string | null
          uploaded_at?: string
          is_active?: boolean
          deleted_at?: string | null
          updated_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

