"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { membershipPlanService } from "@/services/membershipPlan.service";

export function useMembershipPlans(params = {}) {
  return useQuery({
    queryKey: ["membershipPlans", params],
    queryFn: () => membershipPlanService.getAll(params).then((res) => res.data),
  });
}

export function useMembershipPlan(id) {
  return useQuery({
    queryKey: ["membershipPlans", id],
    queryFn: () => membershipPlanService.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCreateMembershipPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      membershipPlanService.create(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membershipPlans"] });
    },
  });
}

export function useUpdateMembershipPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      membershipPlanService.update(id, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membershipPlans"] });
    },
  });
}

export function useDeleteMembershipPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      membershipPlanService.delete(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membershipPlans"] });
    },
  });
}
