"use client";

import React, { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
  Calendar,
  Clock,
  User,
  Users,
  FileText,
  Edit3,
  XCircle,
  List,
} from "lucide-react";
import Button from "@/components/ui/button";
import { cn } from "@/lib/utils";

function CapacityBar({ current, max }) {
  if (max === 0) return null;
  const ratio = Math.min(current / max, 1);
  const percentage = Math.round(ratio * 100);
  const barColor =
    ratio >= 1
      ? "bg-red-500"
      : ratio >= 0.8
        ? "bg-amber-500"
        : "bg-emerald-500";
  const textColor =
    ratio >= 1
      ? "text-red-700"
      : ratio >= 0.8
        ? "text-amber-700"
        : "text-emerald-700";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Kapasite</span>
        <span className={cn("font-semibold", textColor)}>
          {current} / {max} ({percentage}%)
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", barColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm font-medium text-gray-800">{value}</div>
      </div>
    </div>
  );
}

export default function SessionSheet({
  open,
  onOpenChange,
  session,
  onEdit,
  onCancel,
  onViewBookings,
}) {
  if (!session) return null;

  const current = session.current_capacity || 0;
  const max = session.Class?.max_capacity || 0;
  const trainerName = session.Trainer
    ? `${session.Trainer.first_name} ${session.Trainer.last_name}`
    : "Eğitmen atanmamış";

  const startDate = new Date(session.start_time);
  const endDate = new Date(session.end_time);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md w-full p-0">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {session.Class?.name || "Sınıf"}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">Oturum Detayları</p>
            </div>
            {session.Class?.class_type && (
              <span className="inline-flex items-center rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-medium text-brand">
                {session.Class.class_type === "group"
                  ? "Grup"
                  : session.Class.class_type === "private"
                    ? "Özel"
                    : "Yarı Özel"}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-5 overflow-y-auto">
          {/* Session info */}
          <div className="space-y-1 divide-y divide-gray-50">
            <InfoRow
              icon={Calendar}
              label="Tarih"
              value={format(startDate, "d MMMM yyyy, EEEE", { locale: tr })}
            />
            <InfoRow
              icon={Clock}
              label="Saat"
              value={`${format(startDate, "HH:mm")} - ${format(endDate, "HH:mm")}`}
            />
            <InfoRow icon={User} label="Eğitmen" value={trainerName} />
          </div>

          {/* Capacity */}
          <CapacityBar current={current} max={max} />

          {/* Notes */}
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <FileText className="w-4 h-4 text-gray-400" />
              Notlar
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 min-h-[40px]">
              {session.notes || (
                <span className="text-gray-400 italic">Not eklenmemiş</span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-100 mt-auto">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="primary"
              onClick={() => onEdit?.(session)}
              className="flex-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Düzenle
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewBookings?.(session)}
              className="flex-1"
            >
              <List className="w-3.5 h-3.5" />
              Rezervasyonlar
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => onCancel?.(session)}
            >
              <XCircle className="w-3.5 h-3.5" />
              İptal Et
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
