"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBooking, useCancelBooking } from "@/hooks/useBookings";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import Modal from "@/components/ui/modal";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSkeleton } from "@/components/ui/skeleton";
import { ArrowLeft, XCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const STATUS_LABELS = {
  confirmed: "Onaylandı",
  waitlisted: "Bekleme Listesi",
  cancelled: "İptal Edildi",
  no_show: "Gelmedi",
};

const STATUS_VARIANTS = {
  confirmed: "success",
  waitlisted: "warning",
  cancelled: "danger",
  no_show: "default",
};

export default function BookingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading, isError, error: fetchError } = useBooking(id);
  const cancelMutation = useCancelBooking();
  const [cancelModal, setCancelModal] = useState(false);

  const booking = data?.data || null;

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync(id);
      toast.success("Rezervasyon iptal edildi.");
      setCancelModal(false);
      router.push("/bookings");
    } catch {
      toast.error("Rezervasyon iptal edilirken hata oluştu.");
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <FormSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 px-4 py-8 text-center text-sm text-red-700">
        {fetchError?.response?.data?.message ||
          "Rezervasyon bilgisi yüklenemedi."}
      </div>
    );
  }

  if (!booking) return null;

  const member = booking.Member;
  const session = booking.ClassSession;
  const cls = session?.Class;
  const canCancel =
    booking.status === "confirmed" || booking.status === "waitlisted";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/bookings">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Rezervasyon Detayı
              </h1>
              <Badge variant={STATUS_VARIANTS[booking.status] || "default"}>
                {STATUS_LABELS[booking.status] || booking.status}
              </Badge>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              Kayıt:{" "}
              {booking.booked_at
                ? new Date(booking.booked_at).toLocaleDateString("tr-TR")
                : "—"}
            </p>
          </div>
        </div>
        {canCancel && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => setCancelModal(true)}
          >
            <XCircle className="h-4 w-4" />
            İptal Et
          </Button>
        )}
      </div>

      {/* Member Info */}
      <Card>
        <CardHeader>
          <CardTitle>Üye Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-gray-500">Ad Soyad</dt>
              <dd className="font-medium text-gray-900">
                {member ? `${member.first_name} ${member.last_name}` : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">E-posta</dt>
              <dd className="text-gray-900">{member?.email || "—"}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Telefon</dt>
              <dd className="text-gray-900">{member?.phone || "—"}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Session Info */}
      <Card>
        <CardHeader>
          <CardTitle>Seans Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-gray-500">Sınıf</dt>
              <dd className="font-medium text-gray-900">{cls?.name || "—"}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Eğitmen</dt>
              <dd className="text-gray-900">
                {session?.Trainer
                  ? `${session.Trainer.first_name} ${session.Trainer.last_name}`
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Tarih / Saat</dt>
              <dd className="text-gray-900">
                {session?.start_time
                  ? `${new Date(session.start_time).toLocaleDateString("tr-TR")} ${new Date(session.start_time).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })} – ${new Date(session.end_time).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Kapasite</dt>
              <dd className="text-gray-900">
                {session?.current_capacity ?? "?"} / {cls?.max_capacity ?? "?"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <CardTitle>Rezervasyon Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-gray-500">Durum</dt>
              <dd>
                <Badge variant={STATUS_VARIANTS[booking.status] || "default"}>
                  {STATUS_LABELS[booking.status] || booking.status}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Rezervasyon Tarihi</dt>
              <dd className="text-gray-900">
                {booking.booked_at
                  ? new Date(booking.booked_at).toLocaleString("tr-TR")
                  : "—"}
              </dd>
            </div>
            {booking.cancelled_at && (
              <div>
                <dt className="text-sm text-gray-500">İptal Tarihi</dt>
                <dd className="text-gray-900">
                  {new Date(booking.cancelled_at).toLocaleString("tr-TR")}
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Cancel Modal */}
      <Modal
        isOpen={cancelModal}
        onClose={() => setCancelModal(false)}
        title="Rezervasyonu İptal Et"
      >
        <p className="text-sm text-gray-600">
          Bu rezervasyonu iptal etmek istediğinize emin misiniz?
        </p>
        {booking.status === "confirmed" && (
          <p className="mt-2 text-sm text-brand">
            Onaylı bir rezervasyonun iptali halinde bekleme listesindeki ilk
            kişi otomatik olarak onaylanacaktır.
          </p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setCancelModal(false)}>
            Vazgeç
          </Button>
          <Button
            variant="danger"
            loading={cancelMutation.isPending}
            onClick={handleCancel}
          >
            İptal Et
          </Button>
        </div>
      </Modal>
    </div>
  );
}
