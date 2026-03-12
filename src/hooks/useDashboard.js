"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => dashboardService.getStats().then((res) => res.data),
  });
}

export function useAdvancedStats(enabled = true) {
  return useQuery({
    queryKey: ["dashboard", "advanced"],
    queryFn: () => dashboardService.getAdvancedStats().then((res) => res.data),
    enabled,
    retry: false,
  });
}
