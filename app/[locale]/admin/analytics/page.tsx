// app/admin/analytics/page.tsx
import { getAnalytics } from "@/lib/orders-server";
import Link from 'next/link';
import { ArrowRight, Clock, TrendingUp } from 'lucide-react';

type AnalyticsData = Awaited<ReturnType<typeof getAnalytics>>;

export default async function AnalyticsPage() {
  const today = await getAnalytics('today');
  const week = await getAnalytics('week');
  const month = await getAnalytics('month');

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-black">Business Analytics</h1>

      <div className="flex gap-4">
        <Link href="/admin/analytics/popular" className="px-6 py-3 bg-violet-600 text-white font-bold rounded-xl flex items-center gap-2">
           <TrendingUp size={20} /> View Best Sellers
        </Link>
      </div>


      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Today" data={today} />
        <StatCard title="This Week" data={week} />
        <StatCard title="This Month" data={month} />
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <Link 
          href="/admin/analytics/hourly" 
          className="group p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between hover:bg-emerald-100 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500 rounded-xl text-white">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Hourly Breakdown</h3>
              <p className="text-emerald-700 text-sm">See rush hour trends</p>
            </div>
          </div>
          <ArrowRight className="text-emerald-500 group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <Link 
          href="/admin/analytics/monthly" 
          className="group p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between hover:bg-emerald-100 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500 rounded-xl text-white">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Monthly Breakdown</h3>
              <p className="text-emerald-700 text-sm">See monthly sales trends</p>
            </div>
          </div>
          <ArrowRight className="text-emerald-500 group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>

    </div>
    
  );
}

function StatCard({ title, data }: { title: string; data: AnalyticsData }) {
  return (
    <div className="p-6 bg-card border rounded-2xl shadow-sm">
      <h3 className="text-muted-foreground font-bold">{title}</h3>
      <p className="text-4xl font-black mt-2">${data.totalRevenue.toFixed(2)}</p>
      <p className="text-emerald-600 font-bold mt-1">{data.totalOrders} Orders</p>
    </div>
  );
}

