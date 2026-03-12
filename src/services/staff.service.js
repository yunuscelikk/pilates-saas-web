import api from "@/lib/api";

export const staffService = {
  getAll(params = {}) {
    return api.get("/users", { params });
  },
  getStats() {
    return api.get("/users/stats");
  },
  getById(id) {
    return api.get(`/users/${encodeURIComponent(id)}`);
  },
  create(data) {
    return api.post("/users", data);
  },
  update(id, data) {
    return api.put(`/users/${encodeURIComponent(id)}`, data);
  },
  delete(id) {
    return api.delete(`/users/${encodeURIComponent(id)}`);
  },
};
