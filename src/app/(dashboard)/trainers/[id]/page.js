"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useTrainer,
  useUpdateTrainer,
  useDeleteTrainer,
} from "@/hooks/useTrainers";
import TrainerForm from "@/features/trainers/trainer-form";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import Modal from "@/components/ui/modal";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSkeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function TrainerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading, isError, error: fetchError } = useTrainer(id);
  const updateMutation = useUpdateTrainer();
  const deleteMutation = useDeleteTrainer();
  const [deleteModal, setDeleteModal] = useState(false);

  const trainer = data?.data || null;

  const handleSubmit = async (formData) => {
    try {
      await updateMutation.mutateAsync({ id, data: formData });
      toast.success("Eğitmen başarıyla güncellendi.");
      router.push("/trainers");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Eğitmen güncellenirken hata oluştu.",
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Eğitmen başarıyla silindi.");
      router.push("/trainers");
    } catch {
      toast.error("Eğitmen silinirken hata oluştu.");
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
        {fetchError?.response?.data?.message || "Eğitmen bilgisi yüklenemedi."}
      </div>
    );
  }

  if (!trainer) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/trainers">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {trainer.first_name} {trainer.last_name}
              </h1>
              <Badge variant={trainer.is_active ? "success" : "danger"}>
                {trainer.is_active ? "Aktif" : "Pasif"}
              </Badge>
            </div>
            {Array.isArray(trainer.specializations) &&
              trainer.specializations.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {trainer.specializations.map((spec) => (
                    <Badge key={spec} variant="info">
                      {spec}
                    </Badge>
                  ))}
                </div>
              )}
          </div>
        </div>
        <Button variant="danger" size="sm" onClick={() => setDeleteModal(true)}>
          <Trash2 className="h-4 w-4" />
          Sil
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Eğitmen Bilgilerini Düzenle</CardTitle>
        </CardHeader>
        <CardContent>
          <TrainerForm
            defaultValues={trainer}
            onSubmit={handleSubmit}
            isLoading={updateMutation.isPending}
            isEdit
          />
        </CardContent>
      </Card>

      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Eğitmeni Sil"
      >
        <p className="text-sm text-gray-600">
          <span className="font-medium">
            {trainer.first_name} {trainer.last_name}
          </span>{" "}
          isimli eğitmeni silmek istediğinize emin misiniz? Bu işlem geri
          alınamaz.
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
