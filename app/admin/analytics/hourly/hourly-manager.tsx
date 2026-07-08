"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function HourlyManager({ initialOrders, selectedDate }) {
  const router = useRouter();
  const [selectedHour, setSelectedHour] = useState(null);

  // Prepare data for the chart (0 to 23 hours)
  const chartData = Array.from({ length: 24 }, (_, i) => {
    const ordersInHour = initialOrders.filter(o => new Date(o.created_at).getHours() === i);
    return {
      hour: `${i}:00`,
      count: ordersInHour.length,
      orders: ordersInHour
    };
  });

  return (
    <div className="p-6 space-y-6">
      <input 
        type="date" 
        value={selectedDate}
        onChange={(e) => router.push(`/admin/analytics/hourly?date=${e.target.value}`)}
        className="p-3 border rounded-xl"
      />
      
      <div className="h-[400px] w-full border rounded-2xl p-4 bg-white">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} onClick={(state) => state && setSelectedHour(state.activeLabel)}>
            <XAxis dataKey="hour" />
            <YAxis allowDecimals={false} />
            <Tooltip cursor={{ fill: '#f3f4f6' }} />
            <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {selectedHour && chartData.find(d => d.hour === selectedHour)?.orders.length > 0 ? (
        <div className="bg-white p-6 border rounded-2xl shadow-sm">
          <h3 className="font-bold text-xl mb-4">Orders at {selectedHour}</h3>
          {chartData.find(d => d.hour === selectedHour)?.orders.map(order => (
            <div key={order.id} className="py-3 border-b flex justify-between">
              <span>Order #{order.daily_order_number}</span>
              <span className="font-bold">${order.total_amount}</span>
            </div>
          ))}
        </div>
      ) : selectedHour ? <p>No orders at this time.</p> : null}
    </div>
  );
}