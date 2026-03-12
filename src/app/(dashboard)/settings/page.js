"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  useStudioSettings,
  useUpdateStudioSettings,
} from "@/hooks/useStudioSettings";
import { ROLES } from "@/lib/permissions";
import Card from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import SettingsForm from "@/features/settings/settings-form";

export default function SettingsPage() {
  const { user } = useAuth();
  const { data, isLoading } = useStudioSettings();
  const updateMutation = useUpdateStudioSettings();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (user?.role !== ROLES.OWNER && user?.role !== ROLES.ADMIN) {
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
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const studio = data?.data;

  const handleSubmit = async (formData) => {
    try {
      setError(null);
      setSuccess(false);
      await updateMutation.mutateAsync(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Ayarlar güncellenirken bir hata oluştu.",
      );
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Stüdyo Ayarları</h1>

      {success && (
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-600">
          Ayarlar başarıyla güncellendi.
        </div>
      )}

      <Card>
        <SettingsForm
          onSubmit={handleSubmit}
          isLoading={updateMutation.isPending}
          error={error}
          defaultValues={
            studio
              ? {
                  name: studio.name || "",
                  email: studio.email || "",
                  phone: studio.phone || "",
                  address: studio.address || "",
                  allowOnlineBooking:
                    studio.settings?.allowOnlineBooking ?? true,
                  requireBookingApproval:
                    studio.settings?.requireBookingApproval ?? false,
                  maxBookingPerSession:
                    studio.settings?.maxBookingPerSession ?? 10,
                  cancellationHoursLimit:
                    studio.settings?.cancellationHoursLimit ?? 24,
                }
              : undefined
          }
        />
      </Card>
    </div>
  );
}
