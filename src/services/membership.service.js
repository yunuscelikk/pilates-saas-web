import api from "@/lib/api";

export const membershipService = {
  getAll(params = {}) {
    return api.get("/memberships", { params });
  },

  getStats() {
    return api.get("/memberships/stats");
  },

  getById(id) {
    return api.get(`/memberships/${encodeURIComponent(id)}`);
  },

  create(data) {
    return api.post("/memberships", data);
  },

  update(id, data) {
    return api.put(`/memberships/${encodeURIComponent(id)}`, data);
  },

  freeze(id) {
    return api.patch(`/memberships/${encodeURIComponent(id)}/freeze`);
  },

  activate(id) {
    return api.patch(`/memberships/${encodeURIComponent(id)}/activate`);
  },

  delete(id) {
    return api.delete(`/memberships/${encodeURIComponent(id)}`);
  },
};
