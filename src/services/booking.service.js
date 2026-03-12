import api from "@/lib/api";

export const bookingService = {
  getAll(params = {}) {
    return api.get("/bookings", { params });
  },

  getById(id) {
    return api.get(`/bookings/${encodeURIComponent(id)}`);
  },

  create(data) {
    return api.post("/bookings", data);
  },

  cancel(id) {
    return api.patch(`/bookings/${encodeURIComponent(id)}/cancel`);
  },

  delete(id) {
    return api.delete(`/bookings/${encodeURIComponent(id)}`);
  },

  getStats() {
    return api.get("/bookings/stats");
  },
};
