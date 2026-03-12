"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useClass, useUpdateClass, useDeleteClass } from "@/hooks/useClasses";
import { useTrainers } from "@/hooks/useTrainers";
import {
  useClassSessions,
  useCreateClassSession,
  useDeleteClassSession,
} from "@/hooks/useClassSessions";
import ClassForm from "@/features/classes/class-form";
import SessionForm from "@/features/classes/session-form";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import Modal from "@/components/ui/modal";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSkeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ArrowLeft, Trash2, Plus, Calendar } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const CLASS_TYPE_LABELS = {
  group: "Grup",
  private: "Özel",
  semi_private: "Yarı Özel",
};

const SESSION_STATUS_LABELS = {
  scheduled: "Planlandı",
  in_progress: "Devam Ediyor",
  completed: "Tamamlandı",
  cancelled: "İptal Edildi",
};

const SESSION_STATUS_VARIANTS = {
  scheduled: "info",
  in_progress: "warning",
  completed: "success",
  cancelled: "danger",
};

export default function ClassDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading, isError, error: fetchError } = useClass(id);
  const updateMutation = useUpdateClass();
  const deleteMutation = useDeleteClass();
  const [deleteModal, setDeleteModal] = useState(false);

  // Sessions
  const { data: sessionsData, isLoading: sessionsLoading } = useClassSessions({
    classId: id,
    limit: 50,
  });
  const createSessionMutation = useCreateClassSession();
  const deleteSessionMutation = useDeleteClassSession();
  const [sessionModal, setSessionModal] = useState(false);
  const [deleteSessionModal, setDeleteSessionModal] = useState({
    open: false,
    session: null,
  });

  // Trainers for session form
  const { data: trainersData } = useTrainers({ limit: 100 });

  const classItem = data?.data || null;
  const sessions = sessionsData?.data || [];
  const allClasses = classItem ? [classItem] : [];
  const allTrainers = trainersData?.data || [];

  const handleSubmit = async (formData) => {
    try {
      await updateMutation.mutateAsync({ id, data: formData });
      toast.success("Sınıf başarıyla güncellendi.");
      router.push("/classes");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Sınıf güncellenirken hata oluştu.",
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Sınıf başarıyla silindi.");
      router.push("/classes");
    } catch {
      toast.error("Sınıf silinirken hata oluştu.");
    }
  };

  const handleCreateSession = async (formData) => {
    try {
      await createSessionMutation.mutateAsync(formData);
      toast.success("Seans başarıyla eklendi.");
      setSessionModal(false);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Seans eklenirken hata oluştu.",
      );
    }
  };

  const handleDeleteSession = async () => {
    if (!deleteSessionModal.session) return;
    try {
      await deleteSessionMutation.mutateAsync(deleteSessionModal.session.id);
      toast.success("Seans silindi.");
      setDeleteSessionModal({ open: false, session: null });
    } catch {
      toast.error("Seans silinirken hata oluştu.");
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <FormSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 px-4 py-8 text-center text-sm text-red-700">
        {fetchError?.response?.data?.message || "Sınıf bilgisi yüklenemedi."}
      </div>
    );
  }

  if (!classItem) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/classes">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {classItem.name}
              </h1>
              <Badge variant={classItem.is_active ? "success" : "danger"}>
                {classItem.is_active ? "Aktif" : "Pasif"}
              </Badge>
              <Badge variant="info">
                {CLASS_TYPE_LABELS[classItem.class_type] ||
                  classItem.class_type}
              </Badge>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              {classItem.duration_minutes} dk · Maks. {classItem.max_capacity}{" "}
              kişi
            </p>
          </div>
        </div>
        <Button variant="danger" size="sm" onClick={() => setDeleteModal(true)}>
          <Trash2 className="h-4 w-4" />
          Sil
        </Button>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Sınıf Bilgilerini Düzenle</CardTitle>
        </CardHeader>
        <CardContent>
          <ClassForm
            defaultValues={classItem}
            onSubmit={handleSubmit}
            isLoading={updateMutation.isPending}
            isEdit
          />
        </CardContent>
      </Card>

      {/* Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Seanslar
            </CardTitle>
            <Button size="sm" onClick={() => setSessionModal(true)}>
              <Plus className="h-4 w-4" />
              Seans Ekle
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {sessionsLoading ? (
            <div className="py-8 text-center text-sm text-gray-500">
              Yükleniyor...
            </div>
          ) : sessions.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">
              Henüz seans planlanmamış.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarih / Saat</TableHead>
                  <TableHead>Eğitmen</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Kapasite</TableHead>
                  <TableHead className="text-right">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {new Date(session.start_time).toLocaleDateString(
                          "tr-TR",
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(session.start_time).toLocaleTimeString(
                          "tr-TR",
                          { hour: "2-digit", minute: "2-digit" },
                        )}{" "}
                        –{" "}
                        {new Date(session.end_time).toLocaleTimeString(
                          "tr-TR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {session.Trainer
                        ? `${session.Trainer.first_name} ${session.Trainer.last_name}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          SESSION_STATUS_VARIANTS[session.status] || "default"
                        }
                      >
                        {SESSION_STATUS_LABELS[session.status] ||
                          session.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {session.current_capacity || 0}/{classItem.max_capacity}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setDeleteSessionModal({ open: true, session })
                        }
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Session Modal */}
      <Modal
        isOpen={sessionModal}
        onClose={() => {
          setSessionModal(false);
        }}
        title="Yeni Seans Ekle"
      >
        <SessionForm
          defaultValues={{ class_id: id }}
          classes={allClasses}
          trainers={allTrainers}
          onSubmit={handleCreateSession}
          onCancel={() => {
            setSessionModal(false);
          }}
          isLoading={createSessionMutation.isPending}
        />
      </Modal>

      {/* Delete Session Modal */}
      <Modal
        isOpen={deleteSessionModal.open}
        onClose={() => setDeleteSessionModal({ open: false, session: null })}
        title="Seansı Sil"
      >
        <p className="text-sm text-gray-600">
          Bu seansı silmek istediğinize emin misiniz?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() =>
              setDeleteSessionModal({ open: false, session: null })
            }
          >
            İptal
          </Button>
          <Button
            variant="danger"
            loading={deleteSessionMutation.isPending}
            onClick={handleDeleteSession}
          >
            Sil
          </Button>
        </div>
      </Modal>

      {/* Delete Class Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Sınıfı Sil"
      >
        <p className="text-sm text-gray-600">
          <span className="font-medium">{classItem.name}</span> isimli sınıfı
          silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteModal(false)}>
            İptal
          </Button>
          <Button
            variant="danger"
            loading={deleteMutation.isPending}
            onClick={handleDelete}
          >
            Sil
          </Button>
        </div>
      </Modal>
    </div>
  );
}
