// app/(worker)/payments/page.tsx
import PaymentManager from './payment-manager';
import { getUnpaidTablesWithItems } from "@/lib/orders-server"; 

export default async function PaymentPage() {
  // This runs on the server, very fast
  const data = await getUnpaidTablesWithItems();
  
  // Pass the data as a prop
  return <PaymentManager initialTables={data || []} />;
}