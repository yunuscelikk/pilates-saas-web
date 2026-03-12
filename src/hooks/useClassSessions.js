"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { classSessionService } from "@/services/classSession.service";

export function useClassSessions(params = {}) {
  return useQuery({
    queryKey: ["classSessions", params],
    queryFn: () => classSessionService.getAll(params).then((res) => res.data),
  });
}

export function useClassSession(id) {
  return useQuery({
    queryKey: ["classSessions", id],
    queryFn: () => classSessionService.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCreateClassSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      classSessionService.create(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classSessions"] });
    },
  });
}

export function useUpdateClassSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      classSessionService.update(id, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classSessions"] });
    },
  });
}

export function useDeleteClassSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => classSessionService.delete(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classSessions"] });
    },
  });
}
