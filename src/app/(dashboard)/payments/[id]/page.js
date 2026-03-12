"use client";

import { useParams } from "next/navigation";
import { usePayment } from "@/hooks/usePayments";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSkeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const STATUS_LABELS = {
  pending: "Beklemede",
  completed: "Tamamlandı",
  failed: "Başarısız",
  refunded: "İade Edildi",
};

const STATUS_VARIANTS = {
  pending: "warning",
  completed: "success",
  failed: "danger",
  refunded: "info",
};

const METHOD_LABELS = {
  cash: "Nakit",
  credit_card: "Kredi Kartı",
  bank_transfer: "Havale/EFT",
  other: "Diğer",
};

export default function PaymentDetailPage() {
  const { id } = useParams();
  const { data, isLoading, isError, error: fetchError } = usePayment(id);

  const payment = data?.data || null;

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
        {fetchError?.response?.data?.message || "Ödeme bilgisi yüklenemedi."}
      </div>
    );
  }

  if (!payment) return null;

  const member = payment.Member;
  const membership = payment.Membership;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/payments">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Ödeme Detayı</h1>
            <Badge variant={STATUS_VARIANTS[payment.status] || "default"}>
              {STATUS_LABELS[payment.status] || payment.status}
            </Badge>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            {payment.payment_date
              ? new Date(payment.payment_date).toLocaleDateString("tr-TR")
              : ""}
          </p>
        </div>
      </div>

      {/* Payment Info */}
      <Card>
        <CardHeader>
          <CardTitle>Ödeme Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-gray-500">Tutar</dt>
              <dd className="text-xl font-bold text-gray-900">
                {parseFloat(payment.amount).toLocaleString("tr-TR", {
                  minimumFractionDigits: 2,
                })}{" "}
                {payment.currency || "TRY"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Ödeme Yöntemi</dt>
              <dd className="font-medium text-gray-900">
                {METHOD_LABELS[payment.payment_method] ||
                  payment.payment_method}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Ödeme Tarihi</dt>
              <dd className="text-gray-900">
                {payment.payment_date
                  ? new Date(payment.payment_date).toLocaleDateString("tr-TR")
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Durum</dt>
              <dd>
                <Badge variant={STATUS_VARIANTS[payment.status] || "default"}>
                  {STATUS_LABELS[payment.status] || payment.status}
                </Badge>
              </dd>
            </div>
            {payment.notes && (
              <div className="sm:col-span-2">
                <dt className="text-sm text-gray-500">Notlar</dt>
                <dd className="text-gray-900">{payment.notes}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

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

      {/* Membership Info (if linked) */}
      {membership && (
        <Card>
          <CardHeader>
            <CardTitle>Üyelik Bilgileri</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-gray-500">Durum</dt>
                <dd>
                  <Badge
                    variant={
                      membership.status === "active" ? "success" : "default"
                    }
                  >
                    {membership.status}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Başlangıç Tarihi</dt>
                <dd className="text-gray-900">
                  {membership.start_date
                    ? new Date(membership.start_date).toLocaleDateString(
                        "tr-TR",
                      )
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Bitiş Tarihi</dt>
                <dd className="text-gray-900">
                  {membership.end_date
                    ? new Date(membership.end_date).toLocaleDateString("tr-TR")
                    : "—"}
                </dd>
              </div>
              {membership.classes_remaining !== null &&
                membership.classes_remaining !== undefined && (
                  <div>
                    <dt className="text-sm text-gray-500">Kalan Ders</dt>
                    <dd className="text-gray-900">
                      {membership.classes_remaining}
                    </dd>
                  </div>
                )}
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
