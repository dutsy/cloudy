"use client";

import Link from "next/link";
import { LayoutDashboard, Package, BarChart3, Settings } from "lucide-react";

export default function AdminDashboard() {
  const adminLinks = [
    { title: " Add Product", href: "/admin/add-product", icon: Package, color: "text-blue-600" },
    { title: "Settings", href: "/admin/settings", icon: Settings, color: "text-gray-600" },
    { title: "Analytics", href: "/admin/analytics", icon: BarChart3, color: "text-purple-600" },
    
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-black mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {adminLinks.map((link) => (
          <Link 
            key={link.title} 
            href={link.href}
            className="p-6 bg-white border border-emerald-600/10 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-4"
          >
            <link.icon className={`h-10 w-10 ${link.color}`} />
            <span className="font-bold text-lg">{link.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}