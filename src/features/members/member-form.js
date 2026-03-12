"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import Button from "@/components/ui/button";

const memberSchema = z.object({
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
  dateOfBirth: z
    .string()
    .optional()
    .transform((v) => v || undefined),
  gender: z
    .enum(["male", "female", "other", ""])
    .optional()
    .transform((v) => v || undefined),
  emergencyContactName: z
    .string()
    .trim()
    .optional()
    .transform((v) => v || undefined),
  emergencyContactPhone: z
    .string()
    .trim()
    .optional()
    .transform((v) => v || undefined),
  notes: z
    .string()
    .trim()
    .optional()
    .transform((v) => v || undefined),
});

export default function MemberForm({
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
    resolver: zodResolver(memberSchema),
    defaultValues: {
      firstName: defaultValues?.first_name || "",
      lastName: defaultValues?.last_name || "",
      email: defaultValues?.email || "",
      phone: defaultValues?.phone || "",
      dateOfBirth: defaultValues?.date_of_birth || "",
      gender: defaultValues?.gender || "",
      emergencyContactName: defaultValues?.emergency_contact_name || "",
      emergencyContactPhone: defaultValues?.emergency_contact_phone || "",
      notes: defaultValues?.notes || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Ad Soyad */}
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

      {/* İletişim */}
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

      {/* Kişisel */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Doğum Tarihi"
          type="date"
          error={errors.dateOfBirth?.message}
          {...register("dateOfBirth")}
        />
        <Select
          label="Cinsiyet"
          error={errors.gender?.message}
          {...register("gender")}
        >
          <option value="">Seçiniz</option>
          <option value="female">Kadın</option>
          <option value="male">Erkek</option>
          <option value="other">Diğer</option>
        </Select>
      </div>

      {/* Acil Durum */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-gray-700">
          Acil Durum İletişim
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="İletişim Kişisi"
            placeholder="Ad Soyad"
            error={errors.emergencyContactName?.message}
            {...register("emergencyContactName")}
          />
          <Input
            label="İletişim Telefonu"
            type="tel"
            placeholder="+90 555 123 4567"
            error={errors.emergencyContactPhone?.message}
            {...register("emergencyContactPhone")}
          />
        </div>
      </div>

      {/* Notlar */}
      <Textarea
        label="Notlar"
        rows={3}
        placeholder="Ek notlar..."
        {...register("notes")}
      />

      {/* Butonlar */}
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
