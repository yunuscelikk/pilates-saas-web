"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  useTrainers,
  useTrainerStats,
  useDeleteTrainer,
} from "@/hooks/useTrainers";
import DataTable, { getSelectionColumn } from "@/components/ui/data-table";
import DataTableToolbar from "@/components/ui/data-table-toolbar";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import Modal from "@/components/ui/modal";
import PageHeader from "@/components/ui/page-header";
import StatsCard from "@/components/ui/stats-card";
import RowPreviewPanel, {
  PreviewField,
} from "@/components/ui/row-preview-panel";
import {
  Plus,
  Eye,
  Trash2,
  Dumbbell,
  Users,
  UserCheck,
  UserPlus,
  CalendarDays,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/lib/permissions";

export default function TrainersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    trainer: null,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [previewTrainer, setPreviewTrainer] = useState(null);

  const { data, isLoading, isError, error } = useTrainers({
    page,
    limit: 20,
    search: search || undefined,
  });

  const { data: statsData, isLoading: statsLoading } = useTrainerStats();
  const deleteMutation = useDeleteTrainer();

  const { user } = useAuth();
  const isOwner = user?.role === ROLES.OWNER;

  const trainers = data?.data || [];
  const meta = data?.meta || null;
  const stats = statsData?.data;

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      setPage(1);
      setSearch(searchInput);
    },
    [searchInput],
  );

  const handleDelete = async () => {
    if (!deleteModal.trainer) return;
    try {
      await deleteMutation.mutateAsync(deleteModal.trainer.id);
      setDeleteModal({ open: false, trainer: null });
      toast.success("Eğitmen başarıyla silindi.");
    } catch {
      toast.error("Eğitmen silinirken hata oluştu.");
    }
  };

  const handleBulkDelete = async () => {
    const selectedIds = Object.keys(rowSelection);
    if (selectedIds.length === 0) return;
    try {
      await Promise.all(
        selectedIds.map((id) => deleteMutation.mutateAsync(id)),
      );
      setRowSelection({});
      toast.success(`${selectedIds.length} eğitmen başarıyla silindi.`);
    } catch {
      toast.error("Toplu silme sırasında hata oluştu.");
    }
  };

  const columns = useMemo(
    () => [
      ...(isOwner ? [getSelectionColumn()] : []),
      {
        accessorFn: (row) => `${row.first_name} ${row.last_name}`,
        id: "name",
        header: "Ad Soyad",
        cell: ({ row }) => (
          <button
            type="button"
            className="cursor-pointer font-medium text-left hover:text-brand transition-colors"
            onClick={() => setPreviewTrainer(row.original)}
          >
            {row.original.first_name} {row.original.last_name}
          </button>
        ),
      },
      {
        accessorKey: "email",
        header: "E-posta",
        cell: ({ getValue }) => getValue() || "—",
      },
      {
        accessorKey: "phone",
        header: "Telefon",
        cell: ({ getValue }) => getValue() || "—",
        enableSorting: false,
      },
      {
        id: "specializations",
        header: "Uzmanlıklar",
        cell: ({ row }) => {
          const specs = row.original.specializations;
          return Array.isArray(specs) && specs.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {specs.map((spec) => (
                <Badge key={spec} variant="info">
                  {spec}
                </Badge>
              ))}
            </div>
          ) : (
            "—"
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "is_active",
        header: "Durum",
        cell: ({ getValue }) => (
          <Badge variant={getValue() ? "success" : "danger"}>
            {getValue() ? "Aktif" : "Pasif"}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">İşlemler</span>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Link href={`/trainers/${row.original.id}`}>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            {isOwner && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setDeleteModal({ open: true, trainer: row.original })
                }
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </div>
        ),
        enableSorting: false,
      },
    ],
    [isOwner],
  );

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Eğitmenler"
        description="Stüdyo eğitmenlerini yönetin."
      >
        <Link href="/trainers/create">
          <Button>
            <Plus className="h-4 w-4" />
            Yeni Eğitmen
          </Button>
        </Link>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          name="Toplam Eğitmen"
          value={stats?.totalTrainers}
          icon={Users}
          color="bg-brand-light text-brand"
          isLoading={statsLoading}
        />
        <StatsCard
          name="Aktif Eğitmen"
          value={stats?.activeTrainers}
          icon={UserCheck}
          color="bg-emerald-100 text-emerald-600"
          isLoading={statsLoading}
        />
        <StatsCard
          name="Bu Ay Yeni"
          value={stats?.newThisMonth}
          icon={UserPlus}
          color="bg-blue-100 text-blue-600"
          isLoading={statsLoading}
        />
        <StatsCard
          name="Bu Hafta Ders"
          value={stats?.classesThisWeek}
          icon={CalendarDays}
          color="bg-amber-100 text-amber-600"
          isLoading={statsLoading}
        />
      </div>

      <DataTableToolbar
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearchSubmit={handleSearch}
        searchPlaceholder="Ad veya e-posta ile ara..."
        selectedCount={selectedCount}
        onClearSelection={() => setRowSelection({})}
        bulkActions={
          isOwner ? (
            <Button variant="danger" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="h-4 w-4" />
              Seçilenleri Sil
            </Button>
          ) : null
        }
      />

      {isError ? (
        <div className="rounded-lg bg-red-50 px-4 py-8 text-center text-sm text-red-700">
          {error?.response?.data?.message ||
            "Eğitmenler yüklenirken hata oluştu."}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={trainers}
          meta={meta}
          onPageChange={setPage}
          isLoading={isLoading}
          enableRowSelection={isOwner}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          getRowId={(row) => String(row.id)}
          emptyState={{
            icon: Dumbbell,
            title: search
              ? "Arama sonucu bulunamadı"
              : "Henüz eğitmen eklenmemiş",
            description: search
              ? "Farklı anahtar kelimelerle tekrar deneyin."
              : "İlk eğitmeninizi oluşturarak başlayın.",
            children: !search && (
              <Link href="/trainers/create">
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                  İlk Eğitmeni Ekle
                </Button>
              </Link>
            ),
          }}
        />
      )}

      {/* Row Preview Panel */}
      <RowPreviewPanel
        open={!!previewTrainer}
        onOpenChange={(open) => !open && setPreviewTrainer(null)}
        title="Eğitmen Detayı"
      >
        {previewTrainer && (
          <dl className="space-y-3">
            <PreviewField
              label="Ad Soyad"
              value={`${previewTrainer.first_name} ${previewTrainer.last_name}`}
            />
            <PreviewField label="E-posta" value={previewTrainer.email} />
            <PreviewField label="Telefon" value={previewTrainer.phone} />
            <PreviewField
              label="Durum"
              value={previewTrainer.is_active ? "Aktif" : "Pasif"}
            />
            <PreviewField
              label="Uzmanlıklar"
              value={
                Array.isArray(previewTrainer.specializations) &&
                previewTrainer.specializations.length > 0
                  ? previewTrainer.specializations.join(", ")
                  : undefined
              }
            />
            <PreviewField
              label="Kayıt Tarihi"
              value={
                previewTrainer.created_at
                  ? new Date(previewTrainer.created_at).toLocaleDateString(
                      "tr-TR",
                    )
                  : undefined
              }
            />
            <div className="pt-3 border-t">
              <Link href={`/trainers/${previewTrainer.id}`}>
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="h-4 w-4" />
                  Detay Sayfasına Git
                </Button>
              </Link>
            </div>
          </dl>
        )}
      </RowPreviewPanel>

      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, trainer: null })}
        title="Eğitmeni Sil"
      >
        <p className="text-sm text-gray-600">
          <span className="font-medium">
            {deleteModal.trainer?.first_name} {deleteModal.trainer?.last_name}
          </span>{" "}
          isimli eğitmeni silmek istediğinize emin misiniz?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setDeleteModal({ open: false, trainer: null })}
          >
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
