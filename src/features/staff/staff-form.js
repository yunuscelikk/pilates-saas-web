"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import ToggleSwitch from "@/components/ui/toggle-switch";

const createSchema = z.object({
  firstName: z.string().min(1, "Ad gereklidir"),
  lastName: z.string().min(1, "Soyad gereklidir"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(8, "Şifre en az 8 karakter olmalıdır"),
  role: z.enum(["admin", "staff"], { required_error: "Rol seçimi gereklidir" }),
});

const editSchema = z.object({
  firstName: z.string().min(1, "Ad gereklidir"),
  lastName: z.string().min(1, "Soyad gereklidir"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 8, {
      message: "Şifre en az 8 karakter olmalıdır",
    }),
  role: z.enum(["admin", "staff"], { required_error: "Rol seçimi gereklidir" }),
  isActive: z.boolean().optional(),
});

export default function StaffForm({
  onSubmit,
  isLoading,
  defaultValues,
  isEdit = false,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isEdit ? editSchema : createSchema),
    defaultValues: defaultValues || {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
      isActive: true,
    },
  });

  const handleFormSubmit = (data) => {
    const submitData = { ...data };
    if (isEdit && !submitData.password) {
      delete submitData.password;
    }
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="Ad"
          {...register("firstName")}
          error={errors.firstName?.message}
        />
        <Input
          label="Soyad"
          {...register("lastName")}
          error={errors.lastName?.message}
        />
      </div>

      <Input
        label="E-posta"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />

      <Input
        label={isEdit ? "Şifre (değiştirmek için doldurun)" : "Şifre"}
        type="password"
        {...register("password")}
        error={errors.password?.message}
      />

      <Select label="Rol" {...register("role")} error={errors.role?.message}>
        <option value="">Rol seçiniz</option>
        <option value="admin">Yönetici</option>
        <option value="staff">Personel</option>
      </Select>

      {isEdit && <ToggleSwitch label="Aktif" {...register("isActive")} />}

      <div className="flex justify-end">
        <Button type="submit" loading={isLoading}>
          {isEdit ? "Güncelle" : "Oluştur"}
        </Button>
      </div>
    </form>
  );
}
