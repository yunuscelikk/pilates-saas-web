"use client";

import { use, useState } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { MapPin, Phone, Mail } from "lucide-react";
import { useStudioBySlug, usePublicSessions } from "@/hooks/public/usePublicStudio";
import SessionCard from "@/components/customer/session-card";
import BookingConfirmation from "@/components/customer/booking-confirmation";

export default function BookLandingPage({ params }) {
  const { studioSlug } = use(params);
  const [selectedSession, setSelectedSession] = useState(null);

  const { data: studioData, isLoading: studioLoading } = useStudioBySlug(studioSlug);
  const studio = studioData?.data;

  const today = format(new Date(), "yyyy-MM-dd");
  const { data: sessionsData, isLoading: sessionsLoading } = usePublicSessions(studioSlug, { date: today });
  const sessions = sessionsData?.data || [];

  if (studioLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 animate-pulse rounded-xl bg-gray-100" />
        <div className="h-8 w-48 animate-pulse rounded bg-gray-100" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Studio Info */}
      <div className="rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 p-5 text-white">
        <h2 className="text-xl font-bold">{studio?.name}</h2>
        <div className="mt-3 space-y-1.5 text-sm text-primary-100">
          {studio?.address && (
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {studio.address}
            </p>
          )}
          {studio?.phone && (
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> {studio.phone}
            </p>
          )}
          {studio?.email && (
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> {studio.email}
            </p>
          )}
        </div>
      </div>

      {/* Today's Sessions */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-gray-900">
          Bugünkü Seanslar
        </h3>
        {sessionsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 py-8 text-center text-sm text-gray-500">
            Bugün için seans bulunmuyor
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
      </div>

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
