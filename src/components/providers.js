"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";
import { AuthProvider } from "@/hooks/useAuth";
import { SidebarProvider } from "@/hooks/useSidebar";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SidebarProvider>
          <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
        </SidebarProvider>
        <Toaster position="top-right" richColors closeButton duration={4000} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
