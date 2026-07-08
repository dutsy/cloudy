"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { subscribeToPaymentUpdates, getUnpaidTablesWithItems, markOrderAsPaid } from "@/lib/orders-client";
import { ReceiptTemplate } from '@/components/shared/receipt-template';
import { useReactToPrint } from 'react-to-print';

export default function PaymentManager({ initialTables }) {
  const [tables, setTables] = useState(initialTables);
  const [printingOrder, setPrintingOrder] = useState(null);
  const componentRef = useRef(null);

  const reactToPrintFn = useReactToPrint({
    contentRef: componentRef,
  });

  const fetchTables = useCallback(async () => {
    const data = await getUnpaidTablesWithItems();
    setTables(data || []);
  }, []);

  const handleProcessPayment = async (order: any) => {
    // 1. Mark as paid in DB
    await markOrderAsPaid(order.id);
    
    // 2. Set the data for the receipt template
    setPrintingOrder(order);
    
    // 3. Trigger the print dialogue after render
    setTimeout(() => {
      reactToPrintFn();
    }, 100);
  };

  // Real-time subscription
  useEffect(() => {
    const unsubscribe = subscribeToPaymentUpdates(fetchTables);
    return () => unsubscribe();
  }, [fetchTables]);
  
  return (
    <div className="grid gap-4 p-6">
      {/* Hidden print template */}
      <div className="hidden">
        {printingOrder && <ReceiptTemplate ref={componentRef} order={printingOrder} />}
      </div>

      <h1 className="text-2xl font-black">Open Tables</h1>
      {tables.map((table) => (
        <div key={table.id} className="border p-4 rounded-xl flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">Table {table.table_number}</h2>
            <p className="text-sm text-muted-foreground">Order #{table.daily_order_number}</p>
          </div>
          <button 
            onClick={() => handleProcessPayment(table)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            Pay & Print Receipt ✓
          </button>
        </div>
      ))}
    </div>
  );
}