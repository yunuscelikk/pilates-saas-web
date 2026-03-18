import publicApi from "@/lib/publicApi";

export const publicAuthService = {
  sendOtp(studioSlug, phone) {
    return publicApi.post(`/public/${encodeURIComponent(studioSlug)}/auth/send-otp`, { phone });
  },

  verifyOtp(studioSlug, phone, code) {
    return publicApi.post(`/public/${encodeURIComponent(studioSlug)}/auth/verify-otp`, { phone, code });
  },

  refresh(studioSlug, refreshToken) {
    return publicApi.post(`/public/${encodeURIComponent(studioSlug)}/auth/refresh`, { refreshToken });
  },

  getMe(studioSlug) {
    return publicApi.get(`/public/${encodeURIComponent(studioSlug)}/me`);
  },
};
