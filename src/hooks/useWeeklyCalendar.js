import { startOfWeek, endOfWeek, formatISO } from "date-fns";
import { useMemo, useState } from "react";
import { useClassSessions } from "@/hooks/useClassSessions";

export function useWeeklyCalendar(date = new Date()) {
  // Haftanın başlangıcı (Pazartesi) ve bitişi (Pazar)
  const [current, setCurrent] = useState(date);
  const weekStart = useMemo(
    () => startOfWeek(current, { weekStartsOn: 1 }),
    [current],
  );
  const weekEnd = useMemo(
    () => endOfWeek(current, { weekStartsOn: 1 }),
    [current],
  );

  const { data, isLoading, error } = useClassSessions({
    startDate: formatISO(weekStart, { representation: "date" }),
    endDate: formatISO(weekEnd, { representation: "date" }),
  });

  return {
    weekStart,
    weekEnd,
    current,
    setCurrent,
    sessions: data?.data || [],
    isLoading,
    error,
  };
}
