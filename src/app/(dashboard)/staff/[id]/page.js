"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useStaffMember,
  useUpdateStaff,
  useDeleteStaff,
} from "@/hooks/useStaff";
import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/lib/permissions";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { FormSkeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/ui/page-header";
import StaffForm from "@/features/staff/staff-form";
import { toast } from "sonner";

export default function StaffDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { data, isLoading } = useStaffMember(id);
  const updateMutation = useUpdateStaff();
  const deleteMutation = useDeleteStaff();
  const [deleteModal, setDeleteModal] = useState(false);

  if (user?.role !== ROLES.OWNER) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">
          Bu sayfaya erişim yetkiniz bulunmamaktadır.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <FormSkeleton />
      </div>
    );
  }

  const staff = data?.data;

  if (!staff) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Personel bulunamadı.</p>
      </div>
    );
  }

  const handleSubmit = async (formData) => {
    try {
      await updateMutation.mutateAsync({ id, data: formData });
      toast.success("Personel başarıyla güncellendi.");
      router.push("/staff");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Personel güncellenirken bir hata oluştu.",
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Personel silindi.");
      router.push("/staff");
    } catch {
      toast.error("Personel silinirken hata oluştu.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Personel Düzenle" />
        {staff.role !== ROLES.OWNER && (
          <Button variant="danger" onClick={() => setDeleteModal(true)}>
            Personeli Sil
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personel Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <StaffForm
            onSubmit={handleSubmit}
            isLoading={updateMutation.isPending}
            isEdit
            defaultValues={{
              firstName: staff.first_name,
              lastName: staff.last_name,
              email: staff.email,
              password: "",
              role: staff.role,
              isActive: staff.is_active,
            }}
          />
        </CardContent>
      </Card>

      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Personeli Sil"
      >
        <p className="text-sm text-gray-600">
          <strong>
            {staff.first_name} {staff.last_name}
          </strong>{" "}
          adlı personeli silmek istediğinize emin misiniz? Bu işlem geri
          alınamaz.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteModal(false)}>
            İptal
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            loading={deleteMutation.isPending}
          >
            Sil
          </Button>
        </div>
      </Modal>
    </div>
  );
}
