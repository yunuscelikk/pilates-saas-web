import api from "@/lib/api";

export const membershipPlanService = {
  getAll(params = {}) {
    return api.get("/membership-plans", { params });
  },

  getById(id) {
    return api.get(`/membership-plans/${encodeURIComponent(id)}`);
  },

  create(data) {
    return api.post("/membership-plans", data);
  },

  update(id, data) {
    return api.put(`/membership-plans/${encodeURIComponent(id)}`, data);
  },

  delete(id) {
    return api.delete(`/membership-plans/${encodeURIComponent(id)}`);
  },
};
