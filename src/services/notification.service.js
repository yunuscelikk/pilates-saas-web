import api from "@/lib/api";

export const notificationService = {
  getAll(params = {}) {
    return api.get("/notifications", { params });
  },

  create(data) {
    return api.post("/notifications", data);
  },

  markRead(id) {
    return api.patch(`/notifications/${encodeURIComponent(id)}/read`);
  },

  markAllRead() {
    return api.patch("/notifications/read-all");
  },

  delete(id) {
    return api.delete(`/notifications/${encodeURIComponent(id)}`);
  },
};
