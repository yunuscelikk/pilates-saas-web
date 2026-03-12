"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { memberService } from "@/services/member.service";

export function useMembers(params = {}) {
  return useQuery({
    queryKey: ["members", params],
    queryFn: () => memberService.getAll(params).then((res) => res.data),
  });
}

export function useMemberStats() {
  return useQuery({
    queryKey: ["members", "stats"],
    queryFn: () => memberService.getStats().then((res) => res.data),
  });
}

export function useMember(id) {
  return useQuery({
    queryKey: ["members", id],
    queryFn: () => memberService.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCreateMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => memberService.create(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["members", "stats"] });
    },
  });
}

export function useUpdateMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      memberService.update(id, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["members", "stats"] });
    },
  });
}

export function useDeleteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => memberService.delete(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["members", "stats"] });
    },
  });
}
