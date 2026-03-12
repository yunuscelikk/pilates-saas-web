"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import Textarea from "@/components/ui/textarea";

const membershipPlanSchema = z
  .object({
    name: z.string().min(1, "Plan adı gereklidir").trim(),
    description: z
      .string()
      .trim()
      .optional()
      .transform((v) => v || undefined),
    planType: z.enum(["class_pack", "time_based", "unlimited"], {
      required_error: "Plan tipi gereklidir",
    }),
    classesIncluded: z
      .union([z.coerce.number().min(1, "En az 1 ders olmalı"), z.literal("")])
      .optional()
      .transform((v) => (v === "" ? undefined : v)),
    durationDays: z
      .union([z.coerce.number().min(1, "En az 1 gün olmalı"), z.literal("")])
      .optional()
      .transform((v) => (v === "" ? undefined : v)),
    price: z.coerce.number().min(0, "Fiyat 0 veya daha büyük olmalı"),
    currency: z
      .string()
      .trim()
      .optional()
      .transform((v) => v || undefined),
  })
  .refine(
    (data) => {
      if (data.planType === "class_pack") {
        return data.classesIncluded !== undefined && data.classesIncluded >= 1;
      }
      return true;
    },
    {
      message: "Ders paketi için ders sayısı gereklidir",
      path: ["classesIncluded"],
    },
  )
  .refine(
    (data) => {
      if (data.planType === "time_based") {
        return data.durationDays !== undefined && data.durationDays >= 1;
      }
      return true;
    },
    {
      message: "Süre bazlı plan için gün sayısı gereklidir",
      path: ["durationDays"],
    },
  );

export default function MembershipPlanForm({
  defaultValues,
  onSubmit,
  isLoading,
  isEdit = false,
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(membershipPlanSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      planType: defaultValues?.plan_type || "class_pack",
      classesIncluded: defaultValues?.classes_included || "",
      durationDays: defaultValues?.duration_days || "",
      price: defaultValues?.price || "",
      currency: defaultValues?.currency || "TRY",
    },
  });

  const planType = useWatch({ control, name: "planType" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Plan Adı *"
        placeholder="10 Ders Paketi"
        error={errors.name?.message}
        {...register("name")}
      />

      <Textarea
        label="Açıklama"
        rows={3}
        placeholder="Plan hakkında açıklama..."
        {...register("description")}
      />

      <Select
        label="Plan Tipi *"
        error={errors.planType?.message}
        {...register("planType")}
      >
        <option value="class_pack">Ders Paketi</option>
        <option value="time_based">Süre Bazlı</option>
        <option value="unlimited">Sınırsız</option>
      </Select>

      {planType === "class_pack" && (
        <Input
          label="Ders Sayısı *"
          type="number"
          min={1}
          placeholder="10"
          error={errors.classesIncluded?.message}
          {...register("classesIncluded")}
        />
      )}

      {(planType === "time_based" || planType === "unlimited") && (
        <Input
          label={`Süre (gün) ${planType === "time_based" ? "*" : ""}`}
          type="number"
          min={1}
          placeholder="30"
          error={errors.durationDays?.message}
          {...register("durationDays")}
        />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Fiyat *"
          type="number"
          min={0}
          step="0.01"
          placeholder="2500"
          error={errors.price?.message}
          {...register("price")}
        />
        <Input
          label="Para Birimi"
          placeholder="TRY"
          maxLength={3}
          error={errors.currency?.message}
          {...register("currency")}
        />
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
