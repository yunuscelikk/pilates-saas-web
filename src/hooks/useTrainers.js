"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trainerService } from "@/services/trainer.service";

export function useTrainers(params = {}) {
  return useQuery({
    queryKey: ["trainers", params],
    queryFn: () => trainerService.getAll(params).then((res) => res.data),
  });
}

export function useTrainerStats() {
  return useQuery({
    queryKey: ["trainers", "stats"],
    queryFn: () => trainerService.getStats().then((res) => res.data),
  });
}

export function useTrainer(id) {
  return useQuery({
    queryKey: ["trainers", id],
    queryFn: () => trainerService.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCreateTrainer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => trainerService.create(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainers"] });
    },
  });
}

export function useUpdateTrainer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      trainerService.update(id, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainers"] });
    },
  });
}

export function useDeleteTrainer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => trainerService.delete(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainers"] });
    },
  });
}
