"use client";

import { use, useState } from "react";
import { format } from "date-fns";
import { usePublicSessions } from "@/hooks/public/usePublicStudio";
import DaySelector from "@/components/customer/day-selector";
import SessionCard from "@/components/customer/session-card";
import BookingConfirmation from "@/components/customer/booking-confirmation";

export default function SchedulePage({ params }) {
  const { studioSlug } = use(params);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState(null);

  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const { data: sessionsData, isLoading } = usePublicSessions(studioSlug, { date: dateStr });
  const sessions = sessionsData?.data || [];

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-900">Ders Takvimi</h2>

      <DaySelector selectedDate={selectedDate} onSelect={setSelectedDate} />

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center text-sm text-gray-500">
          Bu tarihte seans bulunmuyor
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onBook={setSelectedSession}
            />
          ))}
        </div>
      )}

      {selectedSession && (
        <BookingConfirmation
          session={selectedSession}
          studioSlug={studioSlug}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
}
