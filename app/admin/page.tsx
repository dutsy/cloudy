"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Home,
  PlusCircle,
  BarChart3,
  Package,
  Settings,
  Wallet,
} from "lucide-react";

const adminLinks = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    color: "text-primary",
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    color: "text-primary",
  },
  {
    title: "Manage Products",
    href: "/admin/product-availability",
    icon: Package,
    color: "text-primary",
  },
  {
    title: "Add Product",
    href: "/admin/add-product",
    icon: PlusCircle,
    color: "text-primary",
  },
  {
    title: "User Management",
    href: "/admin/user-management",
    icon: BarChart3,
    color: "text-primary",
  },
  {
    title: "Process Payments",
    href: "/admin/kitchen/payments",
    icon: Wallet,
    color: "text-primary",
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
    color: "text-gray-500",
  },
  { title: "Back to Home", href: "/", icon: Home, color: "text-gray-500" },
];


export default function AdminDashboardPage() {
  return (
    <div className="wrapper py-10">
      <h1 className="h1-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="p-6 border rounded-2xl bg-card hover:bg-primary/5 transition-all flex flex-col gap-4 group"
            >
              <Icon className={`h-8 w-8 ${link.color}`} />
              <h3 className="font-bold text-xl">{link.title}</h3>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
