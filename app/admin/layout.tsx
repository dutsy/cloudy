"use client";

import { useUser } from "@/components/shared/user-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Package, PlusCircle, BarChart3, Home } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { role, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  // SECURITY CHECK
  useEffect(() => {
    if (!loading && role !== "admin") {
      router.push("/");
    }
  }, [role, loading, router]);

  // Loading/Access Denied State
  if (loading || role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-bold">Checking permissions...</p>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Add Product", href: "/admin/add-product", icon: PlusCircle },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Back to Home", href: "/", icon: Home },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col gap-2">
        <h2 className="text-xl font-bold px-4 mb-4">Admin Panel</h2>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? "bg-emerald-600 text-white" : "text-gray-400 hover:bg-gray-800"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </aside>
      <main className="flex-1 p-8 bg-muted/20">{children}</main>
    </div>
  );
}