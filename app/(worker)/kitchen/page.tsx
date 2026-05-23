import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import KitchenStream from './kitchen-stream';

export default async function KitchenPage() {
  const supabase = await createSupabaseServerClient();

  // Fetch initial queue data on the server side
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      table_number,
      notes,
      created_at,
      status,
      order_items (
        id,
        quantity,
        products (
          name,
          category
        )
      )
    `)
    .not('status', 'eq', 'completed')
    .order('created_at', { ascending: true });

  if (error) {
    return <div className="text-red-500 p-4 font-bold">Error loading database stream: {error.message}</div>;
  }

  // Feed the data seamlessly into the websocket container component
  return <KitchenStream initialOrders={orders || []} />;
}