import publicApi from "@/lib/publicApi";

export const publicStudioService = {
  getStudio(studioSlug) {
    return publicApi.get(`/public/${encodeURIComponent(studioSlug)}`);
  },

  getClasses(studioSlug) {
    return publicApi.get(`/public/${encodeURIComponent(studioSlug)}/classes`);
  },

  getSessions(studioSlug, params = {}) {
    return publicApi.get(`/public/${encodeURIComponent(studioSlug)}/sessions`, { params });
  },

  getSession(studioSlug, sessionId) {
    return publicApi.get(`/public/${encodeURIComponent(studioSlug)}/sessions/${encodeURIComponent(sessionId)}`);
  },
};
