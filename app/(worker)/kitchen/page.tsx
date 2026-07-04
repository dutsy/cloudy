import KitchenStream from './kitchen-stream';
import { getActiveKitchenData } from "@/lib/orders-server";


export default async function KitchenPage() {

  const orders = await getActiveKitchenData();

  return <KitchenStream initialItems={orders || []} />;
}