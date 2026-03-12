"use client";

import { useRouter } from "next/navigation";
import { useCreateStaff } from "@/hooks/useStaff";
import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/lib/permissions";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import StaffForm from "@/features/staff/staff-form";
import { toast } from "sonner";
import PlanLimitAlert from "@/components/ui/plan-limit-alert";

export default function CreateStaffPage() {
  const router = useRouter();
  const { user } = useAuth();
  const createMutation = useCreateStaff();

  if (user?.role !== ROLES.OWNER) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">
          Bu sayfaya erişim yetkiniz bulunmamaktadır.
        </p>
      </div>
    );
  }

  const handleSubmit = async (data) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Personel başarıyla oluşturuldu.");
      router.push("/staff");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Personel oluşturulurken bir hata oluştu.",
      );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Yeni Personel" />
      <PlanLimitAlert resource="staff" />
      <Card>
        <CardHeader>
          <CardTitle>Personel Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <StaffForm
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
