import api from "@/lib/api";

export const classService = {
  getAll(params = {}) {
    return api.get("/classes", { params });
  },

  getStats() {
    return api.get("/classes/stats");
  },

  getById(id) {
    return api.get(`/classes/${encodeURIComponent(id)}`);
  },

  create(data) {
    return api.post("/classes", data);
  },

  update(id, data) {
    return api.put(`/classes/${encodeURIComponent(id)}`, data);
  },

  delete(id) {
    return api.delete(`/classes/${encodeURIComponent(id)}`);
  },
};
