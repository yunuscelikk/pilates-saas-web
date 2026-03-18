"use client";

import { useState } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { X, Clock, Users, User, CheckCircle, AlertTriangle } from "lucide-react";
import { useCreateCustomerBooking } from "@/hooks/public/useCustomerBookings";
import { useCustomerAuth } from "./customer-auth-provider";
import { toast } from "sonner";

export default function BookingConfirmation({ session, studioSlug, onClose }) {
  const { isAuthenticated, requireAuth } = useCustomerAuth();
  const createBooking = useCreateCustomerBooking(studioSlug);
  const [success, setSuccess] = useState(false);

  const cls = session?.Class;
  const trainer = session?.Trainer;
  const startTime = session ? new Date(session.start_time) : null;
  const endTime = session ? new Date(session.end_time) : null;
  const capacity = cls?.max_capacity || 0;
  const current = session?.current_capacity || 0;
  const isFull = current >= capacity;

  const handleBook = async () => {
    if (!requireAuth()) return;

    try {
      await createBooking.mutateAsync(session.id);
      setSuccess(true);
      toast.success("Rezervasyon oluşturuldu!");
    } catch (error) {
      const msg = error.response?.data?.message || "Rezervasyon oluşturulamadı";
      toast.error(msg);
    }
  };

  if (!session) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="w-full max-w-lg rounded-t-2xl bg-white p-6 sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {success ? "Rezervasyon Onaylandı" : "Rezervasyon"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center py-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <p className="mt-3 text-lg font-medium text-gray-900">Başarılı!</p>
            <p className="mt-1 text-sm text-gray-500">Rezervasyonunuz oluşturuldu.</p>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-xl bg-primary-600 py-3 text-sm font-medium text-white hover:bg-primary-700"
            >
              Tamam
            </button>
          </div>
        ) : (
          <>
            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900">{cls?.name}</h3>
              {trainer && (
                <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                  <User className="h-3.5 w-3.5" />
                  {trainer.first_name} {trainer.last_name}
                </p>
              )}
              <div className="mt-3 space-y-1.5 text-sm text-gray-600">
                {startTime && (
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {format(startTime, "d MMMM yyyy, EEEE", { locale: tr })}
                    {" "}
                    {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
                  </p>
                )}
                <p className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {current}/{capacity} kişi
                </p>
              </div>
            </div>

            {!isAuthenticated && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-700">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                Rezervasyon yapabilmek için giriş yapmanız gerekiyor.
              </div>
            )}

            {isFull && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-orange-50 p-3 text-sm text-orange-700">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                Bu seans dolu. Bekleme listesine ekleneceksiniz.
              </div>
            )}

            <button
              onClick={handleBook}
              disabled={createBooking.isPending}
              className="mt-4 w-full rounded-xl bg-primary-600 py-3 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {createBooking.isPending
                ? "Rezervasyon yapılıyor..."
                : isFull
                  ? "Bekleme Listesine Katıl"
                  : "Rezervasyonu Onayla"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
