"use client";
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MonthYearPicker } from './MonthYearPicker';

// 1. Define the exact shape of your data
interface PopularClientProps {
  initialData: {
    name: string;
    count: number;
  }[];
}

// 2. Apply the interface to your component
export default function PopularClient({ initialData }: PopularClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState(searchParams.get('period') === 'all' ? 'all' : 'month');

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-black">Best Sellers</h1>

      {/* Mode Selection */}
      <div className="flex gap-4 p-2 bg-slate-100 rounded-xl w-fit">
        <button 
          onClick={() => { setMode('all'); router.push('?period=all'); }}
          className={`px-4 py-2 rounded-lg ${mode === 'all' ? 'bg-white shadow-sm font-bold' : ''}`}
        >All Time</button>
        <button 
          onClick={() => { setMode('month'); }}
          className={`px-4 py-2 rounded-lg ${mode === 'month' ? 'bg-white shadow-sm font-bold' : ''}`}
        >By Month</button>
      </div>

      {/* Use your custom MonthYearPicker */}
      {mode === 'month' && (
        <div className="w-fit">
          <MonthYearPicker selectedMonth={searchParams.get('period') || '2026-07'} />
        </div>
      )}

      {/* Chart */}
      <div className="h-125 w-full bg-white p-6 border rounded-2xl">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={initialData} layout="vertical" margin={{ left: 80 }}>
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={80} interval={0} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}