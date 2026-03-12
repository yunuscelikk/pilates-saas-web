"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { classService } from "@/services/class.service";

export function useClasses(params = {}) {
  return useQuery({
    queryKey: ["classes", params],
    queryFn: () => classService.getAll(params).then((res) => res.data),
  });
}

export function useClassStats() {
  return useQuery({
    queryKey: ["classes", "stats"],
    queryFn: () => classService.getStats().then((res) => res.data),
  });
}

export function useClass(id) {
  return useQuery({
    queryKey: ["classes", id],
    queryFn: () => classService.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCreateClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => classService.create(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
}

export function useUpdateClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      classService.update(id, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
}

export function useDeleteClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => classService.delete(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
}
