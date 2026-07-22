// app/admin/analytics/monthly/page.tsx
import { getOrdersForMonth } from "@/lib/orders-server";
import MonthlyManager from "./monthly-manager";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MonthlyPage({ searchParams }: PageProps) {
  
  const resolvedParams = await searchParams;
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  // 4. Safely extract the month (handling the case where it might be an array or undefined)
  const rawMonth = typeof resolvedParams.month === 'string' ? resolvedParams.month : "";
  const month = /^\d{4}-\d{2}$/.test(rawMonth) ? rawMonth : currentMonth;

  const report = await getOrdersForMonth(month);

  return (
    <div className="p-8 space-y-6">
      <Link
        href="/admin/analytics"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={20} /> Back
      </Link>
      <h1 className="text-3xl font-black">Monthly Breakdown</h1>
      
      {/* 6. Pass the data DOWN to your manager component */}
      <MonthlyManager report={report} selectedMonth={month} />
    </div>
  );
}