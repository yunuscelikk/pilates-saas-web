"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionService } from "@/services/subscription.service";

export function usePlans() {
  return useQuery({
    queryKey: ["plans"],
    queryFn: () => subscriptionService.getPlans().then((res) => res.data),
  });
}

export function useCurrentSubscription() {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: () =>
      subscriptionService.getCurrentSubscription().then((res) => res.data),
  });
}

export function useInitializeCheckout() {
  return useMutation({
    mutationFn: (data) =>
      subscriptionService.initializeCheckout(data).then((res) => res.data),
  });
}

export function useCheckoutCallback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (token) =>
      subscriptionService.handleCheckoutCallback(token).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      subscriptionService.cancelSubscription().then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}

export function useUpgradeSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId) =>
      subscriptionService.upgradeSubscription(planId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}

export function useRetryPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      subscriptionService.retryPayment().then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
  });
}

export function useReactivateSubscription() {
  return useMutation({
    mutationFn: (data) =>
      subscriptionService.reactivateSubscription(data).then((res) => res.data),
  });
}

export function usePlanUsage() {
  return useQuery({
    queryKey: ["subscription", "usage"],
    queryFn: () => subscriptionService.getPlanUsage().then((res) => res.data),
  });
}
