import api from "@/lib/api";

export const authService = {
  login(credentials) {
    return api.post("/auth/login", credentials);
  },

  register(data) {
    return api.post("/auth/register", data);
  },

  refreshToken(refreshToken) {
    return api.post("/auth/refresh", { refreshToken });
  },

  logout(refreshToken) {
    return api.post("/auth/logout", { refreshToken });
  },

  getMe() {
    return api.get("/auth/me");
  },

  checkSlug(slug) {
    return api.get(`/auth/check-slug/${slug}`);
  },
};
