import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { staffService } from "@/services/staff.service";

export function useStaff(params = {}) {
  return useQuery({
    queryKey: ["staff", params],
    queryFn: () => staffService.getAll(params).then((res) => res.data),
  });
}

export function useStaffStats() {
  return useQuery({
    queryKey: ["staff", "stats"],
    queryFn: () => staffService.getStats().then((res) => res.data),
  });
}

export function useStaffMember(id) {
  return useQuery({
    queryKey: ["staff", id],
    queryFn: () => staffService.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => staffService.create(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}

export function useUpdateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      staffService.update(id, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}

export function useDeleteStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => staffService.delete(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}
