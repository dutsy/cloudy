"use client";
import { useRouter } from 'next/navigation';

export function MonthYearPicker({ selectedMonth }) {
  const router = useRouter();
  const current = selectedMonth || '2026-07';
  const [currentYear, currentMonth] = current.split('-');

  const handleUpdate = (y: string, m: string) => {
    // Ensure we are working with valid strings
    const yearStr = String(y);
    const monthStr = String(m).padStart(2, '0');
    router.push(`?period=${yearStr}-${monthStr}`);
  };

  return (
    <div className="flex gap-4 p-4 border rounded-2xl bg-white shadow-sm w-fit">
      <select 
        value={currentMonth} 
        onChange={(e) => handleUpdate(currentYear, e.target.value)} 
        className="p-2 rounded-lg border font-medium"
      >
        {Array.from({ length: 12 }, (_, i) => (
          <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
            {new Date(0, i).toLocaleString('default', { month: 'long' })}
          </option>
        ))}
      </select>
      
      <select 
        value={currentYear} 
        onChange={(e) => handleUpdate(e.target.value, currentMonth)} 
        className="p-2 rounded-lg border font-medium"
      >
        {[2026, 2027, 2028, 2029].map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
}