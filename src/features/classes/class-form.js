"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import Textarea from "@/components/ui/textarea";

const classSchema = z.object({
  name: z.string().min(1, "Sınıf adı gereklidir").trim(),
  description: z
    .string()
    .trim()
    .optional()
    .transform((v) => v || undefined),
  durationMinutes: z.coerce.number().min(1, "Süre en az 1 dakika olmalı"),
  maxCapacity: z.coerce.number().min(1, "Kapasite en az 1 olmalı"),
  classType: z.enum(["group", "private", "semi_private"]),
});

export default function ClassForm({
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
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      durationMinutes: defaultValues?.duration_minutes || 60,
      maxCapacity: defaultValues?.max_capacity || 10,
      classType: defaultValues?.class_type || "group",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Sınıf Adı *"
        placeholder="Reformer Pilates"
        error={errors.name?.message}
        {...register("name")}
      />

      <Textarea
        label="Açıklama"
        rows={3}
        placeholder="Sınıf hakkında açıklama..."
        {...register("description")}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          label="Süre (dk) *"
          type="number"
          min={1}
          error={errors.durationMinutes?.message}
          {...register("durationMinutes")}
        />
        <Input
          label="Maks. Kapasite *"
          type="number"
          min={1}
          error={errors.maxCapacity?.message}
          {...register("maxCapacity")}
        />
        <Select
          label="Sınıf Tipi *"
          error={errors.classType?.message}
          {...register("classType")}
        >
          <option value="group">Grup</option>
          <option value="private">Özel</option>
          <option value="semi_private">Yarı Özel</option>
        </Select>
      </div>

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
