"use client";

import { useQuery } from "@tanstack/react-query";
import { publicStudioService } from "@/services/public/publicStudio.service";

export function useStudioBySlug(studioSlug) {
  return useQuery({
    queryKey: ["public", "studio", studioSlug],
    queryFn: () => publicStudioService.getStudio(studioSlug).then((res) => res.data),
    enabled: !!studioSlug,
  });
}

export function usePublicClasses(studioSlug) {
  return useQuery({
    queryKey: ["public", "classes", studioSlug],
    queryFn: () => publicStudioService.getClasses(studioSlug).then((res) => res.data),
    enabled: !!studioSlug,
  });
}

export function usePublicSessions(studioSlug, params = {}) {
  return useQuery({
    queryKey: ["public", "sessions", studioSlug, params],
    queryFn: () => publicStudioService.getSessions(studioSlug, params).then((res) => res.data),
    enabled: !!studioSlug,
  });
}

export function usePublicSession(studioSlug, sessionId) {
  return useQuery({
    queryKey: ["public", "sessions", studioSlug, sessionId],
    queryFn: () => publicStudioService.getSession(studioSlug, sessionId).then((res) => res.data),
    enabled: !!studioSlug && !!sessionId,
  });
}
