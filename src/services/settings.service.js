import api from "@/lib/api";

export const settingsService = {
  getCurrent() {
    return api.get("/studios/current");
  },
  update(data) {
    return api.put("/studios/current", data);
  },
};
