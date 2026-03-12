"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useMember,
  useUpdateMember,
  useDeleteMember,
} from "@/hooks/useMembers";
import MemberForm from "@/features/members/member-form";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import Modal from "@/components/ui/modal";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSkeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function MemberDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading, isError, error: fetchError } = useMember(id);
  const updateMutation = useUpdateMember();
  const deleteMutation = useDeleteMember();
  const [deleteModal, setDeleteModal] = useState(false);

  const member = data?.data || null;

  const handleSubmit = async (formData) => {
    try {
      await updateMutation.mutateAsync({ id, data: formData });
      toast.success("Üye başarıyla güncellendi.");
      router.push("/members");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Üye güncellenirken hata oluştu.",
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Üye başarıyla silindi.");
      router.push("/members");
    } catch {
      toast.error("Üye silinirken hata oluştu.");
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
        {fetchError?.response?.data?.message || "Üye bilgisi yüklenemedi."}
      </div>
    );
  }

  if (!member) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/members">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {member.first_name} {member.last_name}
              </h1>
              <Badge variant={member.is_active ? "success" : "danger"}>
                {member.is_active ? "Aktif" : "Pasif"}
              </Badge>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              Kayıt:{" "}
              {member.joined_at
                ? new Date(member.joined_at).toLocaleDateString("tr-TR")
                : "—"}
            </p>
          </div>
        </div>
        <Button variant="danger" size="sm" onClick={() => setDeleteModal(true)}>
          <Trash2 className="h-4 w-4" />
          Sil
        </Button>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Üye Bilgilerini Düzenle</CardTitle>
        </CardHeader>
        <CardContent>
          <MemberForm
            defaultValues={member}
            onSubmit={handleSubmit}
            isLoading={updateMutation.isPending}
            isEdit
          />
        </CardContent>
      </Card>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Üyeyi Sil"
      >
        <p className="text-sm text-gray-600">
          <span className="font-medium">
            {member.first_name} {member.last_name}
          </span>{" "}
          isimli üyeyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
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
