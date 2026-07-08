// app/admin/analytics/monthly/page.tsx
import { getMonthlyReport, getOrdersForMonth } from "@/lib/orders-server";
import MonthlyManager from "./monthly-manager";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function MonthlyAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentMonth = new Date().toISOString().slice(0, 7);
  const month = /^\d{4}-\d{2}$/.test(resolvedParams.month || "")
    ? resolvedParams.month
    : currentMonth;

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
      <MonthlyManager report={report} selectedMonth={month} />{" "}
    </div>
  );
}
