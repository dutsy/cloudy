"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MonthYearPicker } from './MonthYearPicker';

export default function MonthlyManager({ report, selectedMonth }) {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // 1. Calculate how many days are in the selected month
  const [year, month] = selectedMonth.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();

  // 2. Transform raw orders into daily chart data
  const chartData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dayString = day.toString().padStart(2, '0');
    const ordersInDay = report.orders.filter(o => new Date(o.created_at).getDate() === day);
    return {
      day: dayString,
      count: ordersInDay.length,
      orders: ordersInDay
    };
  });

  return (
    <div className="space-y-6">
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 bg-emerald-600 text-white rounded-2xl">
          <p className="text-emerald-100 font-bold">Total Revenue</p>
          <h2 className="text-3xl font-black">${report.totalRevenue.toFixed(2)}</h2>
        </div>
        <div className="p-6 bg-blue-600 text-white rounded-2xl">
          <p className="text-blue-100 font-bold">Total Orders</p>
          <h2 className="text-3xl font-black">{report.totalCount}</h2>
        </div>
      </div>

      {/* 2. Month Selector - This triggers the URL change */}
      <MonthYearPicker selectedMonth={selectedMonth} />
      
      {/* 3. The Chart */}
      <div className="h-[400px] w-full border rounded-2xl p-4 bg-white">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} onClick={(state) => state && setSelectedDay(state.activeLabel)}>
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 4. Drill-down list */}
      {selectedDay && (
        <div className="bg-white p-6 border rounded-2xl shadow-sm">
          <h3 className="font-bold text-xl mb-4">Orders for Day {selectedDay}</h3>
          {chartData.find(d => d.day === selectedDay)?.orders.map(order => (
            <div key={order.id} className="py-3 border-b flex justify-between">
              <span>Order #{order.daily_order_number}</span>
              <span className="font-bold">${order.total_amount}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}