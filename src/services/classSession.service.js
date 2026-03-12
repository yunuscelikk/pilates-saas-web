import api from "@/lib/api";

export const classSessionService = {
  getAll(params = {}) {
    return api.get("/class-sessions", { params });
  },

  getById(id) {
    return api.get(`/class-sessions/${encodeURIComponent(id)}`);
  },

  create(data) {
    return api.post("/class-sessions", data);
  },

  update(id, data) {
    return api.put(`/class-sessions/${encodeURIComponent(id)}`, data);
  },

  delete(id) {
    return api.delete(`/class-sessions/${encodeURIComponent(id)}`);
  },
};
