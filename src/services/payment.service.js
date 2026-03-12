import api from "@/lib/api";

export const paymentService = {
  getAll(params = {}) {
    return api.get("/payments", { params });
  },

  getById(id) {
    return api.get(`/payments/${encodeURIComponent(id)}`);
  },

  create(data) {
    return api.post("/payments", data);
  },

  delete(id) {
    return api.delete(`/payments/${encodeURIComponent(id)}`);
  },

  getStats() {
    return api.get("/payments/stats");
  },
};
