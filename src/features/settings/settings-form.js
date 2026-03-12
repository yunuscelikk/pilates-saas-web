"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import ToggleSwitch from "@/components/ui/toggle-switch";

const settingsSchema = z.object({
  name: z.string().min(1, "Stüdyo adı gereklidir"),
  email: z
    .string()
    .email("Geçerli bir e-posta adresi giriniz")
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  allowOnlineBooking: z.boolean().optional(),
  requireBookingApproval: z.boolean().optional(),
  maxBookingPerSession: z.coerce.number().min(1).optional(),
  cancellationHoursLimit: z.coerce.number().min(0).optional(),
});

export default function SettingsForm({ onSubmit, isLoading, defaultValues }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: defaultValues || {
      name: "",
      email: "",
      phone: "",
      address: "",
      allowOnlineBooking: true,
      requireBookingApproval: false,
      maxBookingPerSession: 10,
      cancellationHoursLimit: 24,
    },
  });

  const handleFormSubmit = (data) => {
    const {
      allowOnlineBooking,
      requireBookingApproval,
      maxBookingPerSession,
      cancellationHoursLimit,
      ...studioData
    } = data;
    onSubmit({
      ...studioData,
      settings: {
        allowOnlineBooking,
        requireBookingApproval,
        maxBookingPerSession,
        cancellationHoursLimit,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Stüdyo Bilgileri
        </h3>
        <div className="space-y-4">
          <Input
            label="Stüdyo Adı"
            {...register("name")}
            error={errors.name?.message}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="E-posta"
              type="email"
              {...register("email")}
              error={errors.email?.message}
            />
            <Input
              label="Telefon"
              {...register("phone")}
              error={errors.phone?.message}
            />
          </div>
          <Input
            label="Adres"
            {...register("address")}
            error={errors.address?.message}
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          İş Ayarları
        </h3>
        <div className="space-y-4">
          <ToggleSwitch
            label="Online Rezervasyona İzin Ver"
            {...register("allowOnlineBooking")}
          />
          <ToggleSwitch
            label="Rezervasyon Onayı Gerektir"
            {...register("requireBookingApproval")}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Seans Başına Maks. Rezervasyon"
              type="number"
              {...register("maxBookingPerSession")}
              error={errors.maxBookingPerSession?.message}
            />
            <Input
              label="İptal Süresi (Saat)"
              type="number"
              {...register("cancellationHoursLimit")}
              error={errors.cancellationHoursLimit?.message}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end border-t pt-6">
        <Button type="submit" loading={isLoading}>
          Kaydet
        </Button>
      </div>
    </form>
  );
}
