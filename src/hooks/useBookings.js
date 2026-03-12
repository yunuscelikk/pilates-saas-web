"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "@/services/booking.service";

export function useBookings(params = {}) {
  return useQuery({
    queryKey: ["bookings", params],
    queryFn: () => bookingService.getAll(params).then((res) => res.data),
  });
}

export function useBookingStats() {
  return useQuery({
    queryKey: ["bookings", "stats"],
    queryFn: () => bookingService.getStats().then((res) => res.data),
  });
}

export function useBooking(id) {
  return useQuery({
    queryKey: ["bookings", id],
    queryFn: () => bookingService.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => bookingService.create(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["classSessions"] });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => bookingService.cancel(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["classSessions"] });
    },
  });
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => bookingService.delete(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["classSessions"] });
    },
  });
}
