"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { setTableNumber } from "@/lib/storage";

export default function TableInitializer() {
  const searchParams = useSearchParams();
  const table = searchParams.get("table");

  useEffect(() => {
    const tableParam = searchParams.get("table");
    
    if (tableParam) {
      setTableNumber(tableParam);
    }
  }, [searchParams]);

  return null; // This component doesn't render anything
}