"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "@/services/payment.service";

export function usePayments(params = {}) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: () => paymentService.getAll(params).then((res) => res.data),
  });
}

export function usePaymentStats() {
  return useQuery({
    queryKey: ["payments", "stats"],
    queryFn: () => paymentService.getStats().then((res) => res.data),
  });
}

export function usePayment(id) {
  return useQuery({
    queryKey: ["payments", id],
    queryFn: () => paymentService.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => paymentService.create(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["payments", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => paymentService.delete(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["payments", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
