"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import Textarea from "@/components/ui/textarea";

const sessionSchema = z
  .object({
    classId: z.string().min(1, "Sınıf seçimi gereklidir"),
    trainerId: z
      .string()
      .optional()
      .transform((v) => v || undefined),
    startTime: z.string().min(1, "Başlangıç zamanı gereklidir"),
    endTime: z.string().min(1, "Bitiş zamanı gereklidir"),
    notes: z
      .string()
      .trim()
      .optional()
      .transform((v) => v || undefined),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return new Date(data.endTime) > new Date(data.startTime);
      }
      return true;
    },
    { message: "Bitiş zamanı başlangıçtan sonra olmalıdır", path: ["endTime"] },
  );

function toLocalDatetimeValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export default function SessionForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
  classes = [],
  trainers = [],
  isEdit = false,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      classId: defaultValues?.class_id || "",
      trainerId: defaultValues?.trainer_id || "",
      startTime: toLocalDatetimeValue(defaultValues?.start_time),
      endTime: toLocalDatetimeValue(defaultValues?.end_time),
      notes: defaultValues?.notes || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select
        label="Sınıf *"
        error={errors.classId?.message}
        {...register("classId")}
      >
        <option value="">Sınıf seçin</option>
        {classes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>

      <Select
        label="Eğitmen"
        error={errors.trainerId?.message}
        {...register("trainerId")}
      >
        <option value="">Eğitmen seçin (opsiyonel)</option>
        {trainers.map((t) => (
          <option key={t.id} value={t.id}>
            {t.first_name} {t.last_name}
          </option>
        ))}
      </Select>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Başlangıç Zamanı *"
          type="datetime-local"
          error={errors.startTime?.message}
          {...register("startTime")}
        />
        <Input
          label="Bitiş Zamanı *"
          type="datetime-local"
          error={errors.endTime?.message}
          {...register("endTime")}
        />
      </div>

      <Textarea
        label="Notlar"
        rows={2}
        placeholder="Seans hakkında notlar..."
        {...register("notes")}
      />

      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          İptal
        </Button>
        <Button type="submit" loading={isLoading}>
          {isEdit ? "Güncelle" : "Ekle"}
        </Button>
      </div>
    </form>
  );
}
