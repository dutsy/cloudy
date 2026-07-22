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
            archived_order_items: {
                Row: {
                    deleted_at: string | null
                    deleted_by: string
                    deletion_batch_id: string | null
                    id: number
                    item_data: Json
                    original_item_id: number
                    parent_order_id: number
                    reason: string | null
                }
                Insert: {
                    deleted_at?: string | null
                    deleted_by: string
                    deletion_batch_id?: string | null
                    id?: never
                    item_data: Json
                    original_item_id: number
                    parent_order_id: number
                    reason?: string | null
                }
                Update: {
                    deleted_at?: string | null
                    deleted_by?: string
                    deletion_batch_id?: string | null
                    id?: never
                    item_data?: Json
                    original_item_id?: number
                    parent_order_id?: number
                    reason?: string | null
                }
                Relationships: []
            }
            archived_orders: {
                Row: {
                    deleted_at: string | null
                    deleted_by: string
                    id: number
                    order_data: Json
                    original_order_id: string | null
                    reason: string | null
                }
                Insert: {
                    deleted_at?: string | null
                    deleted_by: string
                    id?: never
                    order_data: Json
                    original_order_id?: string | null
                    reason?: string | null
                }
                Update: {
                    deleted_at?: string | null
                    deleted_by?: string
                    id?: never
                    order_data?: Json
                    original_order_id?: string | null
                    reason?: string | null
                }
                Relationships: []
            }
            order_items: {
                Row: {
                    created_at: string
                    id: string
                    is_prepared: boolean | null
                    note: string | null
                    order_id: string
                    price_at_purchase: number
                    product_id: string
                    quantity: number
                }
                Insert: {
                    created_at?: string
                    id?: string
                    is_prepared?: boolean | null
                    note?: string | null
                    order_id: string
                    price_at_purchase: number
                    product_id: string
                    quantity?: number
                }
                Update: {
                    created_at?: string
                    id?: string
                    is_prepared?: boolean | null
                    note?: string | null
                    order_id?: string
                    price_at_purchase?: number
                    product_id?: string
                    quantity?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "order_items_order_id_fkey"
                        columns: ["order_id"]
                        isOneToOne: false
                        referencedRelation: "orders"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "order_items_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    },
                ]
            }
            orders: {
                Row: {
                    created_at: string
                    daily_order_number: number | null
                    id: string
                    is_paid: boolean | null
                    notes: string | null
                    status: string
                    table_number: string | null
                    total_amount: number
                    user_id: string | null
                    customer_name?: string | null
                }
                Insert: {
                    created_at?: string
                    daily_order_number?: number | null
                    id?: string
                    is_paid?: boolean | null
                    notes?: string | null
                    status?: string
                    table_number?: string | null
                    total_amount?: number
                    user_id?: string | null
                    customer_name?: string | null
                }
                Update: {
                    created_at?: string
                    daily_order_number?: number | null
                    id?: string
                    is_paid?: boolean | null
                    notes?: string | null
                    status?: string
                    table_number?: string | null
                    total_amount?: number
                    user_id?: string | null
                    customer_name?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "orders_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            products: {
                Row: {
                    avaliable: boolean | null
                    banner: string | null
                    brand: string
                    category: string
                    category_ar?: string | null;
                    brand_ar?: string | null;
                    created_at: string
                    description: string
                    description_ar: string
                    id: string
                    images: string[]
                    is_featured: boolean | null
                    name: string
                    name_ar: string
                    num_reviews: number
                    price: number
                    rating: number
                    slug: string
                    stock: number
                }
                Insert: {
                    avaliable?: boolean | null
                    banner?: string | null
                    brand: string
                    category: string
                    created_at?: string
                    category_ar?: string | null;
                    brand_ar?: string | null;
                    description: string
                    description_ar: string
                    id?: string
                    images: string[]
                    is_featured?: boolean | null
                    name: string
                    name_ar: string
                    num_reviews?: number
                    price?: number
                    rating?: number
                    slug: string
                    stock?: number
                }
                Update: {
                    avaliable?: boolean | null
                    banner?: string | null
                    brand?: string
                    category?: string
                    created_at?: string
                    category_ar?: string | null;
                    brand_ar?: string | null;
                    description?: string
                    description_ar?: string
                    id?: string
                    images?: string[]
                    is_featured?: boolean | null
                    name?: string
                    name_ar?: string
                    num_reviews?: number
                    price?: number
                    rating?: number
                    slug?: string
                    stock?: number
                }
                Relationships: []
            }
            profiles: {
                Row: {
                    email: string | null
                    id: string
                    role: string | null
                }
                Insert: {
                    email?: string | null
                    id: string
                    role?: string | null
                }
                Update: {
                    email?: string | null
                    id?: string
                    role?: string | null
                }
                Relationships: []
            }
            views: {
                Row: {
                    created_at: string
                    id: number
                    name: string | null
                }
                Insert: {
                    created_at?: string
                    id?: number
                    name?: string | null
                }
                Update: {
                    created_at?: string
                    id?: number
                    name?: string | null
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            add_to_table_ticket: {
                Args: { p_items: Json; p_table_number: string; p_total_amount: number; p_customer_name: string; }
                Returns: string
            }
        }
        Enums: {
            [_ in never]: never
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
        Enums: {},
    },
} as const
