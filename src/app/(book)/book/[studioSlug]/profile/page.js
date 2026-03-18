"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { useCustomerAuth } from "@/components/customer/customer-auth-provider";
import { useMyBookings, useCancelCustomerBooking } from "@/hooks/public/useCustomerBookings";
import { useMyMemberships, useMyPayments } from "@/hooks/public/useCustomerProfile";
import BookingCard from "@/components/customer/booking-card";
import MembershipCard from "@/components/customer/membership-card";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "sonner";

export default function ProfilePage({ params }) {
  const { studioSlug } = use(params);
  const router = useRouter();
  const { member, isAuthenticated, isLoading: authLoading, logout } = useCustomerAuth();

  const { data: upcomingData, isLoading: upcomingLoading } = useMyBookings(
    isAuthenticated ? studioSlug : null,
    { upcoming: "true" },
  );
  const { data: pastData } = useMyBookings(
    isAuthenticated ? studioSlug : null,
    { past: "true" },
  );
  const { data: membershipsData } = useMyMemberships(isAuthenticated ? studioSlug : null);
  const { data: paymentsData } = useMyPayments(isAuthenticated ? studioSlug : null);

  const cancelBooking = useCancelCustomerBooking(studioSlug);

  const upcomingBookings = upcomingData?.data || [];
  const pastBookings = pastData?.data || [];
  const memberships = membershipsData?.data || [];
  const payments = paymentsData?.data || [];

  const handleCancel = async (bookingId) => {
    try {
      await cancelBooking.mutateAsync(bookingId);
      toast.success("Rezervasyon iptal edildi");
    } catch (error) {
      toast.error(error.response?.data?.message || "İptal edilemedi");
    }
  };

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <User className="h-12 w-12 text-gray-300" />
        <p className="text-gray-500">Profilinizi görmek için giriş yapın</p>
        <button
          onClick={() => router.push(`/book/${studioSlug}/login?redirect=/book/${studioSlug}/profile`)}
          className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-700"
        >
          Giriş Yap
        </button>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {member?.first_name} {member?.last_name}
          </h2>
          <p className="text-sm text-gray-500">{member?.phone}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
        >
          <LogOut className="h-4 w-4" />
          Çıkış
        </button>
      </div>

      {/* Active Memberships */}
      {memberships.length > 0 && (
        <div>
          <h3 className="mb-3 text-base font-semibold text-gray-900">Üyeliklerim</h3>
          <div className="space-y-3">
            {memberships.map((m) => (
              <MembershipCard key={m.id} membership={m} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Bookings */}
      <div>
        <h3 className="mb-3 text-base font-semibold text-gray-900">
          Yaklaşan Rezervasyonlar
        </h3>
        {upcomingBookings.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-300 py-6 text-center text-sm text-gray-500">
            Yaklaşan rezervasyon yok
          </p>
        ) : (
          <div className="space-y-3">
            {upcomingBookings.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                showCancel
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}
      </div>

      {/* Past Bookings */}
      {pastBookings.length > 0 && (
        <div>
          <h3 className="mb-3 text-base font-semibold text-gray-900">
            Geçmiş Dersler
          </h3>
          <div className="space-y-3">
            {pastBookings.slice(0, 10).map((b) => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </div>
        </div>
      )}

      {/* Payments */}
      {payments.length > 0 && (
        <div>
          <h3 className="mb-3 text-base font-semibold text-gray-900">Ödemelerim</h3>
          <div className="space-y-2">
            {payments.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {p.Membership?.MembershipPlan?.name || "Ödeme"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(p.payment_date), "d MMM yyyy", { locale: tr })}
                  </p>
                </div>
                <span className="font-semibold text-gray-900">
                  {p.amount} {p.currency}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
