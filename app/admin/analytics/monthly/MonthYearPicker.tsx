"use client";
import { useRouter } from 'next/navigation';

interface MonthYearPickerProps {
  selectedMonth: string;
}



export function MonthYearPicker({ selectedMonth }: MonthYearPickerProps) {
  const router = useRouter();
  const [year, month] = selectedMonth.split('-');

  const handleUpdate = (y: string, m: string) => {
    // Construct the string strictly here
    const formattedDate = `${y}-${m.padStart(2, '0')}`;
    router.push(`/admin/analytics/monthly?month=${formattedDate}`);
  };

  return (
    <div className="flex gap-4 p-4 border rounded-2xl bg-white shadow-sm">
      <select 
        value={month} 
        onChange={(e) => handleUpdate(year, e.target.value)} 
        className="p-2 rounded-lg border font-medium"
      >
        {Array.from({ length: 12 }, (_, i) => (
          <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
            {new Date(0, i).toLocaleString('default', { month: 'long' })}
          </option>
        ))}
      </select>
      
      <select 
        value={year} 
        onChange={(e) => handleUpdate(e.target.value, month)} 
        className="p-2 rounded-lg border font-medium"
      >
        {[2025, 2026, 2027].map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
}