import api from "@/lib/api";

export const dashboardService = {
  getStats() {
    return api.get("/dashboard");
  },

  getAdvancedStats() {
    return api.get("/dashboard/advanced");
  },
};
