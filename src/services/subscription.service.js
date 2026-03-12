import api from "@/lib/api";

export const subscriptionService = {
  getPlans() {
    return api.get("/plans");
  },

  getCurrentSubscription() {
    return api.get("/subscription");
  },

  initializeCheckout(data) {
    return api.post("/subscription/checkout", data);
  },

  handleCheckoutCallback(token) {
    return api.post("/subscription/checkout/callback", { token });
  },

  cancelSubscription() {
    return api.post("/subscription/cancel");
  },

  upgradeSubscription(planId) {
    return api.post("/subscription/upgrade", { planId });
  },

  retryPayment() {
    return api.post("/subscription/retry-payment");
  },

  reactivateSubscription(data) {
    return api.post("/subscription/reactivate", data);
  },

  getPlanUsage() {
    return api.get("/subscription/usage");
  },
};
