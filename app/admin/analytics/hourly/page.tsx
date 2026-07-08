// app/admin/analytics/hourly/page.tsx
import { getOrdersForDate } from "@/lib/orders-server";
import HourlyManager from "./hourly-manager";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function HourlyAnalyticsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ date?: string }> 
}) {
  const resolvedParams = await searchParams;
  const today = new Date().toISOString().split('T')[0];
  const date = resolvedParams.date || today;
  
  const orders = await getOrdersForDate(date);

  return (
    <div className="p-8 space-y-6">
      {/* Back Navigation Header */}
      <Link 
        href="/admin/analytics" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        <ArrowLeft size={20} />
        Back to Analytics
      </Link>

      <h1 className="text-3xl font-black">Hourly Breakdown</h1>
      
      <HourlyManager initialOrders={orders} selectedDate={date} />
    </div>
  );
}