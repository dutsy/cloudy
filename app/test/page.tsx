"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

export default function TestPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    const fetchData = async () => {
      // Direct query to the table, no joins, no filters
      const { data, error } = await supabase
        .from("order_items")
        .select("*"); // Get EVERYTHING

      if (error) {
        console.error("Error fetching order_items:", error);
      } else {
        console.log("RAW ORDER_ITEMS DATA:", data);
        setData(data || []);
      }
      setLoading(false);
    };

    fetchData();
  }, [supabase]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Raw Order Items Data</h1>
      <pre className="bg-gray-100 p-4 rounded text-xs">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}