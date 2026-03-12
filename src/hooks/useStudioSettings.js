import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "@/services/settings.service";

export function useStudioSettings() {
  return useQuery({
    queryKey: ["studioSettings"],
    queryFn: () => settingsService.getCurrent().then((res) => res.data),
  });
}

export function useUpdateStudioSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => settingsService.update(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studioSettings"] });
    },
  });
}
