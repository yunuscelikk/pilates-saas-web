"use client";

import { useRouter } from "next/navigation";
import { useCreateBooking } from "@/hooks/useBookings";
import BookingForm from "@/features/bookings/booking-form";
import Button from "@/components/ui/button";
import Card, { CardContent } from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CreateBookingPage() {
  const router = useRouter();
  const createMutation = useCreateBooking();

  const handleSubmit = async (data) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Rezervasyon başarıyla oluşturuldu.");
      router.push("/bookings");
    } catch (err) {
      const code = err.response?.status;
      const msg = err.response?.data?.message;
      if (code === 409) {
        toast.error(msg || "Bu üye zaten bu seansa kayıtlı.");
      } else {
        toast.error(msg || "Rezervasyon oluşturulurken hata oluştu.");
      }
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/bookings">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <PageHeader
          title="Yeni Rezervasyon"
          description="Bir üye için seans rezervasyonu oluşturun."
        />
      </div>

      <Card>
        <CardContent>
          <BookingForm
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
