import api from "@/lib/api";

export const memberService = {
  getAll(params = {}) {
    return api.get("/members", { params });
  },

  getById(id) {
    return api.get(`/members/${encodeURIComponent(id)}`);
  },

  create(data) {
    return api.post("/members", data);
  },

  update(id, data) {
    return api.put(`/members/${encodeURIComponent(id)}`, data);
  },

  delete(id) {
    return api.delete(`/members/${encodeURIComponent(id)}`);
  },

  getStats() {
    return api.get("/members/stats");
  },
};
