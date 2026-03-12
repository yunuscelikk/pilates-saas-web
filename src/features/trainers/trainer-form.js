"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Textarea from "@/components/ui/textarea";

const trainerSchema = z.object({
  firstName: z.string().min(1, "Ad gereklidir").trim(),
  lastName: z.string().min(1, "Soyad gereklidir").trim(),
  email: z
    .string()
    .email("Geçerli bir e-posta girin")
    .or(z.literal(""))
    .optional()
    .transform((v) => v || undefined),
  phone: z
    .string()
    .trim()
    .optional()
    .transform((v) => v || undefined),
  specializations: z
    .string()
    .trim()
    .optional()
    .transform((v) =>
      v
        ? v
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    ),
  bio: z
    .string()
    .trim()
    .optional()
    .transform((v) => v || undefined),
});

export default function TrainerForm({
  defaultValues,
  onSubmit,
  isLoading,
  isEdit = false,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(trainerSchema),
    defaultValues: {
      firstName: defaultValues?.first_name || "",
      lastName: defaultValues?.last_name || "",
      email: defaultValues?.email || "",
      phone: defaultValues?.phone || "",
      specializations: Array.isArray(defaultValues?.specializations)
        ? defaultValues.specializations.join(", ")
        : "",
      bio: defaultValues?.bio || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Ad *"
          placeholder="Ad"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <Input
          label="Soyad *"
          placeholder="Soyad"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="E-posta"
          type="email"
          placeholder="ornek@email.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Telefon"
          type="tel"
          placeholder="+90 555 123 4567"
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>

      <Input
        label="Uzmanlık Alanları"
        placeholder="Pilates, Yoga, Reformer (virgülle ayırın)"
        error={errors.specializations?.message}
        {...register("specializations")}
      />

      <Textarea
        label="Biyografi"
        rows={3}
        placeholder="Eğitmen hakkında kısa bilgi..."
        {...register("bio")}
      />

      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
        <Button type="button" variant="outline" onClick={() => history.back()}>
          İptal
        </Button>
        <Button type="submit" loading={isLoading}>
          {isEdit ? "Güncelle" : "Kaydet"}
        </Button>
      </div>
    </form>
  );
}
