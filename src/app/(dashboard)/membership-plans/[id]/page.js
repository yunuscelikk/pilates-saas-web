"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useMembershipPlan,
  useUpdateMembershipPlan,
  useDeleteMembershipPlan,
} from "@/hooks/useMembershipPlans";
import MembershipPlanForm from "@/features/membership-plans/membership-plan-form";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import Card, { CardContent } from "@/components/ui/card";
import { FormSkeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/ui/page-header";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function MembershipPlanDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading, isError, error: fetchError } = useMembershipPlan(id);
  const updateMutation = useUpdateMembershipPlan();
  const deleteMutation = useDeleteMembershipPlan();
  const [deleteModal, setDeleteModal] = useState(false);

  const plan = data?.data || null;

  const handleUpdate = async (formData) => {
    try {
      await updateMutation.mutateAsync({ id, data: formData });
      toast.success("Plan başarıyla güncellendi.");
      router.push("/membership-plans");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Plan güncellenirken hata oluştu.",
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Plan silindi.");
      router.push("/membership-plans");
    } catch {
      toast.error("Plan silinirken hata oluştu.");
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
        {fetchError?.response?.data?.message || "Plan bilgisi yüklenemedi."}
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/membership-plans">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <PageHeader
            title={plan.name}
            description="Plan bilgilerini düzenleyin."
          />
        </div>
        <Button variant="danger" size="sm" onClick={() => setDeleteModal(true)}>
          <Trash2 className="h-4 w-4" />
          Sil
        </Button>
      </div>

      {/* Edit Form */}
      <Card>
        <CardContent>
          <MembershipPlanForm
            defaultValues={plan}
            onSubmit={handleUpdate}
            isLoading={updateMutation.isPending}
            isEdit
          />
        </CardContent>
      </Card>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Planı Sil"
      >
        <p className="text-sm text-gray-600">
          <span className="font-semibold">{plan.name}</span> planını silmek
          istediğinize emin misiniz? Bu işlem geri alınamaz.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteModal(false)}>
            İptal
          </Button>
          <Button
            variant="danger"
            loading={deleteMutation.isPending}
            onClick={handleDelete}
          >
            Sil
          </Button>
        </div>
      </Modal>
    </div>
  );
}
