export type { Database, Json } from "./supabase";

export type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "./supabase";

import type { Tables, TablesInsert, TablesUpdate } from "./supabase";


// Products
export type Product = Tables<"products">;
export type ProductInsert = TablesInsert<"products">;
export type ProductUpdate = TablesUpdate<"products">;


// Orders
export type Order = Tables<"orders">;
export type OrderInsert = TablesInsert<"orders">;
export type OrderUpdate = TablesUpdate<"orders">;


// Order Items
export type OrderItem = Tables<"order_items">;
export type OrderItemInsert = TablesInsert<"order_items">;
export type OrderItemUpdate = TablesUpdate<"order_items">;


// Profiles
export type Profile = Tables<"profiles">;
export type ProfileInsert = TablesInsert<"profiles">;
export type ProfileUpdate = TablesUpdate<"profiles">;


// Archived Orders
export type ArchivedOrder = Tables<"archived_orders">;
export type ArchivedOrderInsert = TablesInsert<"archived_orders">;
export type ArchivedOrderUpdate = TablesUpdate<"archived_orders">;


// Archived Order Items
export type ArchivedOrderItem = Tables<"archived_order_items">;
export type ArchivedOrderItemInsert = TablesInsert<"archived_order_items">;
export type ArchivedOrderItemUpdate = TablesUpdate<"archived_order_items">;


// Views
export type View = Tables<"views">;
export type ViewInsert = TablesInsert<"views">;
export type ViewUpdate = TablesUpdate<"views">;

export type OrderItemWithProduct = Tables<"order_items"> & {
  products: {
    name: string;
    price: number;
  } | null;
};


export type OrderWithItems = Tables<"orders"> & {
  order_items: OrderItemWithProduct[];
};

export type ProductWithOrderItem = OrderItem & {
  products: Product | null;
};

// types/index.ts

export type KitchenItem = {
  id: string;
  quantity: number;
  note: string | null;
  created_at: string;
  products: {
    name: string;
    category: string;
  } | null;

  orders: {
    table_number: string | null;
    daily_order_number: number | null;
    // Add this line here
    customer_name: string | null; 
  } | null; // Make sure orders can be null if needed
};

export type PaymentOrder = Order & {
  order_items: {
    id: string;
    quantity: number;
    products: Pick<Product, "name" | "price"> | null;
  }[];
};

export type UnpaidOrder = Order & {
  order_items: {
    quantity: number;
    price_at_purchase: number;
    products: {
      name: string;
    } | null;
  }[];
};


export type PaymentOrderItem = {
  id: string;
  quantity: number;
  products: Pick<Product, "name" | "price"> | null;
};

export type PaymentOrderClient = Order & {
  order_items: PaymentOrderItem[];
};



// 1. Pick exactly the columns your Supabase query returns
export type MonthlyOrder = Pick<Order, 'id' | 'created_at' | 'daily_order_number' | 'total_amount'>;

// 2. Define the exact shape of your function's return object
export interface MonthlyData {
  orders: MonthlyOrder[];
  totalRevenue: number;
  totalCount: number;
}

