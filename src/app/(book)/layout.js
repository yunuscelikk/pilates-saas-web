"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";
import { Toaster } from "sonner";

export default function BookLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
      <Toaster position="top-center" richColors closeButton duration={3000} />
    </QueryClientProvider>
  );
}
