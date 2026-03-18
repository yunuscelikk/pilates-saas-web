"use client";

import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "@/components/ui/modal";
import SessionForm from "@/features/classes/session-form";
import { useClasses } from "@/hooks/useClasses";
import { useTrainers } from "@/hooks/useTrainers";
import {
  useCreateClassSession,
  useUpdateClassSession,
  useDeleteClassSession,
} from "@/hooks/useClassSessions";
import { toast } from "sonner";
import PageHeader from "@/components/ui/page-header";
import { useWeeklyCalendar } from "@/hooks/useWeeklyCalendar";
import WeekNavigator from "@/components/calendar/WeekNavigator";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import CalendarSkeleton from "@/components/calendar/CalendarSkeleton";
import MobileAgendaView from "@/components/calendar/MobileAgendaView";
import SessionSheet from "@/components/calendar/SessionSheet";
import Button from "@/components/ui/button";
import { addWeeks, subWeeks, formatISO } from "date-fns";
import { Plus, CalendarDays, AlertCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

function toLocalDatetimeValue(date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export default function CalendarPage() {
  const queryClient = useQueryClient();
  const {
    weekStart,
    weekEnd,
    current,
    setCurrent,
    sessions,
    isLoading,
    error,
  } = useWeeklyCalendar();

  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(d.getDate() + i);
        return d;
      }),
    [weekStart],
  );

  const [selectedSession, setSelectedSession] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editSession, setEditSession] = useState(null);
  const [prefillDate, setPrefillDate] = useState(null);

  const { data: classesData } = useClasses();
  const { data: trainersData } = useTrainers();
  const createSession = useCreateClassSession();
  const updateSession = useUpdateClassSession();
  const deleteSession = useDeleteClassSession();

  const invalidateCalendar = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["classSessions"] });
  }, [queryClient]);

  const handleCreateSession = useCallback(
    async (formData) => {
      try {
        await createSession.mutateAsync(formData);
        toast.success("Oturum başarıyla oluşturuldu.");
        setModalOpen(false);
        setPrefillDate(null);
        invalidateCalendar();
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Oturum oluşturulurken hata oluştu.",
        );
      }
    },
    [createSession, invalidateCalendar],
  );

  const handleUpdateSession = useCallback(
    async (formData) => {
      if (!editSession) return;
      try {
        await updateSession.mutateAsync({ id: editSession.id, data: formData });
        toast.success("Oturum güncellendi.");
        setEditSession(null);
        setModalOpen(false);
        invalidateCalendar();
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Oturum güncellenirken hata oluştu.",
        );
      }
    },
    [editSession, updateSession, invalidateCalendar],
  );

  const handleCancelSession = useCallback(
    async (session) => {
      try {
        await deleteSession.mutateAsync(session.id);
        toast.success("Oturum iptal edildi.");
        setSheetOpen(false);
        setSelectedSession(null);
        invalidateCalendar();
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Oturum iptal edilirken hata oluştu.",
        );
      }
    },
    [deleteSession, invalidateCalendar],
  );

  const handleSessionClick = useCallback((session) => {
    setSelectedSession(session);
    setSheetOpen(true);
  }, []);

  const handleSlotClick = useCallback((date) => {
    setPrefillDate(date);
    setEditSession(null);
    setModalOpen(true);
  }, []);

  const handleEditFromSheet = useCallback((session) => {
    setEditSession(session);
    setSheetOpen(false);
    setModalOpen(true);
  }, []);

  const openCreateModal = useCallback(() => {
    setEditSession(null);
    setPrefillDate(null);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditSession(null);
    setPrefillDate(null);
  }, []);

  // Build default values for session form
  const formDefaults = useMemo(() => {
    if (editSession) return editSession;
    if (prefillDate) {
      const endDate = new Date(prefillDate);
      endDate.setHours(endDate.getHours() + 1);
      return {
        start_time: prefillDate.toISOString(),
        end_time: endDate.toISOString(),
      };
    }
    return undefined;
  }, [editSession, prefillDate]);

  return (
    <div>
      <PageHeader
        title="Takvim"
        description="Haftalık ders programınızı görsel olarak yönetin."
      >
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4" />
          Oturum Oluştur
        </Button>
      </PageHeader>

      {/* Toolbar */}
      <div className="flex items-center justify-between mt-6 mb-4">
        <WeekNavigator
          weekStart={weekStart}
          weekEnd={weekEnd}
          onPrev={() => setCurrent((d) => subWeeks(d, 1))}
          onNext={() => setCurrent((d) => addWeeks(d, 1))}
          onToday={() => setCurrent(new Date())}
        />
        <div className="text-sm text-gray-500 hidden sm:block">
          {sessions.length} oturum
        </div>
      </div>

      {/* Calendar content */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <CalendarSkeleton />
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="py-20 text-center"
          >
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-red-600 font-medium">Takvim yüklenemedi.</p>
            <p className="text-sm text-gray-500 mt-1">
              Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
            </p>
          </motion.div>
        ) : sessions.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="py-20 text-center"
          >
            <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              Bu hafta için oturum bulunamadı.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Yeni bir oturum oluşturarak başlayın.
            </p>
            <Button className="mt-4" onClick={openCreateModal}>
              <Plus className="w-4 h-4" />
              İlk Oturumu Oluştur
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key={weekStart.toISOString()}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
          >
            {/* Desktop: Time grid */}
            <div className="hidden md:block">
              <CalendarGrid
                days={days}
                sessions={sessions}
                onSessionClick={handleSessionClick}
                onSlotClick={handleSlotClick}
              />
            </div>

            {/* Mobile: Agenda list */}
            <div className="md:hidden">
              <MobileAgendaView
                days={days}
                sessions={sessions}
                onSessionClick={handleSessionClick}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editSession ? "Oturumu Düzenle" : "Oturum Oluştur"}
      >
        <SessionForm
          defaultValues={formDefaults}
          onSubmit={editSession ? handleUpdateSession : handleCreateSession}
          onCancel={closeModal}
          isLoading={
            editSession ? updateSession.isPending : createSession.isPending
          }
          isEdit={!!editSession}
          classes={classesData?.data || []}
          trainers={trainersData?.data || []}
        />
      </Modal>

      {/* Session detail sheet */}
      <SessionSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        session={selectedSession}
        onEdit={handleEditFromSheet}
        onCancel={handleCancelSession}
      />
    </div>
  );
}
