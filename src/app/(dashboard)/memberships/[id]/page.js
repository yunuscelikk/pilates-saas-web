"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useMembership,
  useUpdateMembership,
  useFreezeMembership,
  useActivateMembership,
  useDeleteMembership,
} from "@/hooks/useMemberships";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import Modal from "@/components/ui/modal";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSkeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Trash2, Snowflake, Play } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const STATUS_LABELS = {
  active: "Aktif",
  frozen: "Donduruldu",
  cancelled: "İptal Edildi",
  expired: "Süresi Doldu",
};

const STATUS_VARIANTS = {
  active: "success",
  frozen: "info",
  cancelled: "danger",
  expired: "default",
};

const PLAN_TYPE_LABELS = {
  class_pack: "Ders Paketi",
  time_based: "Süre Bazlı",
  unlimited: "Sınırsız",
};

const editSchema = z.object({
  status: z.enum(["active", "expired", "cancelled", "frozen"]),
  endDate: z
    .string()
    .optional()
    .transform((v) => v || undefined),
  classesRemaining: z
    .union([z.coerce.number().min(0), z.literal("")])
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
});

export default function MembershipDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading, isError, error: fetchError } = useMembership(id);
  const updateMutation = useUpdateMembership();
  const freezeMutation = useFreezeMembership();
  const activateMutation = useActivateMembership();
  const deleteMutation = useDeleteMembership();
  const [deleteModal, setDeleteModal] = useState(false);

  const membership = data?.data || null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editSchema),
    values: {
      status: membership?.status || "active",
      endDate: membership?.end_date || "",
      classesRemaining:
        membership?.classes_remaining != null
          ? membership.classes_remaining
          : "",
    },
  });

  const handleUpdate = async (formData) => {
    try {
      await updateMutation.mutateAsync({ id, data: formData });
      toast.success("Üyelik başarıyla güncellendi.");
      router.push("/memberships");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Üyelik güncellenirken hata oluştu.",
      );
    }
  };

  const handleFreeze = async () => {
    try {
      await freezeMutation.mutateAsync(id);
      toast.success("Üyelik donduruldu.");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Üyelik dondurulurken hata oluştu.",
      );
    }
  };

  const handleActivate = async () => {
    try {
      await activateMutation.mutateAsync(id);
      toast.success("Üyelik aktifleştirildi.");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Üyelik aktifleştirilirken hata oluştu.",
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Üyelik silindi.");
      router.push("/memberships");
    } catch {
      toast.error("Üyelik silinirken hata oluştu.");
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
        {fetchError?.response?.data?.message || "Üyelik bilgisi yüklenemedi."}
      </div>
    );
  }

  if (!membership) return null;

  const member = membership.Member;
  const plan = membership.MembershipPlan;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/memberships">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Üyelik Detayı
              </h1>
              <Badge variant={STATUS_VARIANTS[membership.status] || "default"}>
                {STATUS_LABELS[membership.status] || membership.status}
              </Badge>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">{plan?.name || "—"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {membership.status === "active" && (
            <Button
              variant="secondary"
              size="sm"
              loading={freezeMutation.isPending}
              onClick={handleFreeze}
            >
              <Snowflake className="h-4 w-4" />
              Dondur
            </Button>
          )}
          {membership.status === "frozen" && (
            <Button
              variant="secondary"
              size="sm"
              loading={activateMutation.isPending}
              onClick={handleActivate}
            >
              <Play className="h-4 w-4" />
              Aktifleştir
            </Button>
          )}
          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteModal(true)}
          >
            <Trash2 className="h-4 w-4" />
            Sil
          </Button>
        </div>
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
          </dl>
        </CardContent>
      </Card>

      {/* Plan Info */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-gray-500">Plan</dt>
              <dd className="font-medium text-gray-900">{plan?.name || "—"}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Tip</dt>
              <dd className="text-gray-900">
                {PLAN_TYPE_LABELS[plan?.plan_type] || plan?.plan_type || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Fiyat</dt>
              <dd className="text-gray-900">
                {plan
                  ? `${Number(plan.price).toLocaleString("tr-TR")} ${plan.currency || "TRY"}`
                  : "—"}
              </dd>
            </div>
            {plan?.plan_type === "class_pack" && (
              <div>
                <dt className="text-sm text-gray-500">Toplam Ders</dt>
                <dd className="text-gray-900">
                  {plan.classes_included || "—"}
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Üyelik Bilgilerini Düzenle</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
            <Select
              label="Durum"
              error={errors.status?.message}
              {...register("status")}
            >
              <option value="active">Aktif</option>
              <option value="frozen">Donduruldu</option>
              <option value="cancelled">İptal Edildi</option>
              <option value="expired">Süresi Doldu</option>
            </Select>

            <Input
              label="Bitiş Tarihi"
              type="date"
              error={errors.endDate?.message}
              {...register("endDate")}
            />

            {plan?.plan_type === "class_pack" && (
              <Input
                label="Kalan Ders Sayısı"
                type="number"
                min={0}
                error={errors.classesRemaining?.message}
                {...register("classesRemaining")}
              />
            )}

            <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => history.back()}
              >
                İptal
              </Button>
              <Button type="submit" loading={updateMutation.isPending}>
                Güncelle
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Üyeliği Sil"
      >
        <p className="text-sm text-gray-600">
          Bu üyelik kaydını silmek istediğinize emin misiniz? Bu işlem geri
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
