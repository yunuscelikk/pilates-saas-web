import publicApi from "@/lib/publicApi";

export const publicBookingService = {
  getMyBookings(studioSlug, params = {}) {
    return publicApi.get(`/public/${encodeURIComponent(studioSlug)}/my-bookings`, { params });
  },

  createBooking(studioSlug, sessionId) {
    return publicApi.post(`/public/${encodeURIComponent(studioSlug)}/book/${encodeURIComponent(sessionId)}`);
  },

  cancelBooking(studioSlug, bookingId) {
    return publicApi.delete(`/public/${encodeURIComponent(studioSlug)}/book/${encodeURIComponent(bookingId)}`);
  },

  getMyMemberships(studioSlug) {
    return publicApi.get(`/public/${encodeURIComponent(studioSlug)}/my-memberships`);
  },

  getMyPayments(studioSlug) {
    return publicApi.get(`/public/${encodeURIComponent(studioSlug)}/my-payments`);
  },
};
