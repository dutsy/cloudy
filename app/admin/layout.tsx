"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/components/shared/user-context";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  PlusCircle,
  BarChart3,
  Home,
  Menu,
  X,
  Package,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on route change for mobile users
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (loading || role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-bold">Checking permissions...</p>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Back to Home", href: "/", icon: Home },
    { name: "Add Product", href: "/admin/add-product", icon: PlusCircle },
    { name: "Manage Products", href: "/admin/product-availability", icon: Package },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  ];

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Hamburger Button (Visible only on mobile) */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white p-4 flex flex-col gap-2 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <h2 className="text-xl font-bold px-4 mb-6 mt-12 md:mt-0">
          Admin Panel
        </h2>
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === item.href
                ? "bg-emerald-600 text-white"
                : "text-gray-400 hover:bg-gray-800"
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </aside>

      {/* Backdrop for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 w-full transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
