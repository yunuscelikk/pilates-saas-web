"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import { FormSkeleton } from "@/components/ui/skeleton";
import { useMembers } from "@/hooks/useMembers";
import { useClassSessions } from "@/hooks/useClassSessions";

const bookingSchema = z.object({
  memberId: z.string().min(1, "Üye seçimi gereklidir"),
  classSessionId: z.string().min(1, "Seans seçimi gereklidir"),
});

export default function BookingForm({ onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: { memberId: "", classSessionId: "" },
  });

  const { data: membersData, isLoading: membersLoading } = useMembers({
    limit: 100,
  });
  const { data: sessionsData, isLoading: sessionsLoading } = useClassSessions({
    limit: 100,
    status: "scheduled",
  });

  const members = membersData?.data || [];
  const sessions = sessionsData?.data || [];

  if (membersLoading || sessionsLoading) {
    return <FormSkeleton />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-lg bg-brand-light px-4 py-3 text-sm text-brand-dark">
        Seans kapasitesi doluysa rezervasyon otomatik olarak{" "}
        <strong>bekleme listesine</strong> alınır.
      </div>

      <Select
        label="Üye *"
        error={errors.memberId?.message}
        {...register("memberId")}
      >
        <option value="">Üye seçin</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>
            {m.first_name} {m.last_name}
            {m.email ? ` (${m.email})` : ""}
          </option>
        ))}
      </Select>

      <Select
        label="Seans *"
        error={errors.classSessionId?.message}
        {...register("classSessionId")}
      >
        <option value="">Seans seçin</option>
        {sessions.map((s) => {
          const className = s.Class?.name || "Sınıf";
          const date = new Date(s.start_time).toLocaleDateString("tr-TR");
          const time = new Date(s.start_time).toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
          });
          const capacity = `${s.current_capacity || 0}/${s.Class?.max_capacity || "?"}`;
          return (
            <option key={s.id} value={s.id}>
              {className} — {date} {time} (Kapasite: {capacity})
            </option>
          );
        })}
      </Select>

      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
        <Button type="button" variant="outline" onClick={() => history.back()}>
          İptal
        </Button>
        <Button type="submit" loading={isLoading}>
          Rezervasyon Oluştur
        </Button>
      </div>
    </form>
  );
}
