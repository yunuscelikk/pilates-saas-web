"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { publicBookingService } from "@/services/public/publicBooking.service";

export function useMyBookings(studioSlug, params = {}) {
  return useQuery({
    queryKey: ["public", "my-bookings", studioSlug, params],
    queryFn: () => publicBookingService.getMyBookings(studioSlug, params).then((res) => res.data),
    enabled: !!studioSlug,
  });
}

export function useCreateCustomerBooking(studioSlug) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId) =>
      publicBookingService.createBooking(studioSlug, sessionId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public", "my-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["public", "sessions"] });
      queryClient.invalidateQueries({ queryKey: ["public", "my-memberships"] });
    },
  });
}

export function useCancelCustomerBooking(studioSlug) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId) =>
      publicBookingService.cancelBooking(studioSlug, bookingId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public", "my-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["public", "sessions"] });
      queryClient.invalidateQueries({ queryKey: ["public", "my-memberships"] });
    },
  });
}
