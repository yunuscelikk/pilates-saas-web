import api from "@/lib/api";

export const trainerService = {
  getAll(params = {}) {
    return api.get("/trainers", { params });
  },

  getStats() {
    return api.get("/trainers/stats");
  },

  getById(id) {
    return api.get(`/trainers/${encodeURIComponent(id)}`);
  },

  create(data) {
    return api.post("/trainers", data);
  },

  update(id, data) {
    return api.put(`/trainers/${encodeURIComponent(id)}`, data);
  },

  delete(id) {
    return api.delete(`/trainers/${encodeURIComponent(id)}`);
  },
};
