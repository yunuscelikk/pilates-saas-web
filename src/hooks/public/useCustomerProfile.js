"use client";

import { useQuery } from "@tanstack/react-query";
import { publicBookingService } from "@/services/public/publicBooking.service";
import { publicAuthService } from "@/services/public/publicAuth.service";

export function useCustomerMe(studioSlug) {
  return useQuery({
    queryKey: ["public", "me", studioSlug],
    queryFn: () => publicAuthService.getMe(studioSlug).then((res) => res.data),
    enabled: !!studioSlug,
  });
}

export function useMyMemberships(studioSlug) {
  return useQuery({
    queryKey: ["public", "my-memberships", studioSlug],
    queryFn: () => publicBookingService.getMyMemberships(studioSlug).then((res) => res.data),
    enabled: !!studioSlug,
  });
}

export function useMyPayments(studioSlug) {
  return useQuery({
    queryKey: ["public", "my-payments", studioSlug],
    queryFn: () => publicBookingService.getMyPayments(studioSlug).then((res) => res.data),
    enabled: !!studioSlug,
  });
}
