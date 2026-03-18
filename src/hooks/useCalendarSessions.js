import { useQuery } from "@tanstack/react-query";
import { calendarSessionService } from "@/services/calendar-session.service";

/**
 * Haftalık class session'ları çeker. startDate ve endDate zorunlu.
 * @param {Object} params
 * @param {string} params.startDate - ISO string (hafta başı)
 * @param {string} params.endDate - ISO string (hafta sonu)
 */
export function useCalendarSessions({ startDate, endDate }) {
  return useQuery({
    queryKey: ["calendar-sessions", startDate, endDate],
    queryFn: () =>
      calendarSessionService
        .list({ startDate, endDate })
        .then((res) => res.data),
    enabled: !!startDate && !!endDate,
  });
}
