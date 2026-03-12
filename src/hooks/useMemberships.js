"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { membershipService } from "@/services/membership.service";

export function useMemberships(params = {}) {
  return useQuery({
    queryKey: ["memberships", params],
    queryFn: () => membershipService.getAll(params).then((res) => res.data),
  });
}

export function useMembershipStats() {
  return useQuery({
    queryKey: ["memberships", "stats"],
    queryFn: () => membershipService.getStats().then((res) => res.data),
  });
}

export function useMembership(id) {
  return useQuery({
    queryKey: ["memberships", id],
    queryFn: () => membershipService.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCreateMembership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      membershipService.create(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberships"] });
    },
  });
}

export function useUpdateMembership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      membershipService.update(id, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberships"] });
    },
  });
}

export function useFreezeMembership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => membershipService.freeze(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberships"] });
    },
  });
}

export function useActivateMembership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => membershipService.activate(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberships"] });
    },
  });
}

export function useDeleteMembership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => membershipService.delete(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberships"] });
    },
  });
}
