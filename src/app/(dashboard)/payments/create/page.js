"use client";

import { useRouter } from "next/navigation";
import { useCreatePayment } from "@/hooks/usePayments";
import PaymentForm from "@/features/payments/payment-form";
import Button from "@/components/ui/button";
import Card, { CardContent } from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CreatePaymentPage() {
  const router = useRouter();
  const createMutation = useCreatePayment();

  const handleSubmit = async (data) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Ödeme başarıyla oluşturuldu.");
      router.push("/payments");
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Ödeme oluşturulurken hata oluştu.",
      );
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/payments">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <PageHeader
          title="Yeni Ödeme"
          description="Bir üye için ödeme kaydı oluşturun."
        />
      </div>

      <Card>
        <CardContent>
          <PaymentForm
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
