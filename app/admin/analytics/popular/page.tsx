// app/admin/analytics/popular/page.tsx
import { getPopularProducts } from "@/lib/orders-server";
import PopularClient from "./popular-client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// 1. Define the exact shape Next.js uses for page props
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// 2. Apply the type to your component
export default async function PopularPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  
  // 3. Extract the period (and ensure it's a string, just in case someone messes with the URL)
  const rawPeriod = resolvedParams.period;
  const period = typeof rawPeriod === 'string' ? rawPeriod : "all";

  // Fetch data directly from the server
  const data = await getPopularProducts(period);

  return (
    <div className="p-8 space-y-6">
      <Link
        href="/admin/analytics"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={20} /> Back
      </Link>
      <h1 className="text-3xl font-black">Monthly Breakdown</h1>
      <PopularClient initialData={data} />
    </div>
  );
}
