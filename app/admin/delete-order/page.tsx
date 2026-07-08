import { getArchivedData } from '@/lib/orders-server';

export default async function ArchivePage() {
  const { orders, items } = await getArchivedData();

  return (
    <div className="p-8 space-y-12">
      <h1 className="text-3xl font-black">Audit Log & Archive</h1>

      {/* Archived Orders Section */}
      <section>
        <h2 className="text-xl font-bold mb-4">Deleted Orders</h2>
        <div className="bg-white border rounded-2xl overflow-hidden">
          {orders.map((o) => (
            <div key={o.id} className="p-4 border-b flex justify-between">
              <div>
                <p className="font-bold">Order #{o.original_order_id}</p>
                <p className="text-sm text-gray-500">Reason: {o.reason}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Deleted by: {o.deleted_by}</p>
                <p className="text-xs text-gray-400">{new Date(o.deleted_at).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Archived Items Section */}
      <section>
        <h2 className="text-xl font-bold mb-4">Deleted Items</h2>
        <div className="bg-white border rounded-2xl overflow-hidden">
          {items.map((i) => (
            <div key={i.id} className="p-4 border-b flex justify-between">
              <div>
                <p className="font-bold">{i.item_data.products?.name || "Unknown Item"}</p>
                <p className="text-sm text-gray-500">Reason: {i.reason}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Deleted by: {i.deleted_by}</p>
                <p className="text-xs text-gray-400">Batch: {i.deletion_batch_id.slice(0, 8)}...</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}