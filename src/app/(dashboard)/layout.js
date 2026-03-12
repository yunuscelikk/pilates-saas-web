"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/protected-route";
import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";
import TrialBanner from "@/components/layout/trial-banner";
import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isCollapsed } = useSidebar();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div
          className={cn(
            "transition-all duration-300",
            isCollapsed ? "lg:pl-16" : "lg:pl-64",
          )}
        >
          <Navbar onMenuToggle={() => setSidebarOpen(true)} />
          <main className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
            <TrialBanner />
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
