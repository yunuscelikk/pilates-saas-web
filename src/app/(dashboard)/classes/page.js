"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useClasses, useClassStats, useDeleteClass } from "@/hooks/useClasses";
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
  CalendarDays,
  BookOpen,
  CheckCircle,
  Clock,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/lib/permissions";

const CLASS_TYPE_LABELS = {
  group: "Grup",
  private: "Özel",
  semi_private: "Yarı Özel",
};

export default function ClassesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [classType, setClassType] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    classItem: null,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [previewClass, setPreviewClass] = useState(null);

  const { data, isLoading, isError, error } = useClasses({
    page,
    limit: 20,
    search: search || undefined,
    classType: classType || undefined,
  });

  const { data: statsData, isLoading: statsLoading } = useClassStats();
  const deleteMutation = useDeleteClass();

  const { user } = useAuth();
  const isOwner = user?.role === ROLES.OWNER;

  const classes = data?.data || [];
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
    if (!deleteModal.classItem) return;
    try {
      await deleteMutation.mutateAsync(deleteModal.classItem.id);
      setDeleteModal({ open: false, classItem: null });
      toast.success("Sınıf başarıyla silindi.");
    } catch {
      toast.error("Sınıf silinirken hata oluştu.");
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
      toast.success(`${selectedIds.length} sınıf başarıyla silindi.`);
    } catch {
      toast.error("Toplu silme sırasında hata oluştu.");
    }
  };

  const columns = useMemo(
    () => [
      ...(isOwner ? [getSelectionColumn()] : []),
      {
        accessorKey: "name",
        header: "Sınıf Adı",
        cell: ({ row }) => (
          <button
            type="button"
            className="cursor-pointer font-medium text-left hover:text-brand transition-colors"
            onClick={() => setPreviewClass(row.original)}
          >
            {row.original.name}
          </button>
        ),
      },
      {
        accessorKey: "class_type",
        header: "Tip",
        cell: ({ getValue }) => (
          <Badge variant="info">
            {CLASS_TYPE_LABELS[getValue()] || getValue()}
          </Badge>
        ),
      },
      {
        accessorKey: "duration_minutes",
        header: "Süre",
        cell: ({ getValue }) => `${getValue()} dk`,
      },
      {
        accessorKey: "max_capacity",
        header: "Kapasite",
        cell: ({ getValue }) => `${getValue()} kişi`,
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
            <Link href={`/classes/${row.original.id}`}>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            {isOwner && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setDeleteModal({ open: true, classItem: row.original })
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
      <PageHeader title="Sınıflar" description="Stüdyo sınıflarını yönetin.">
        <Link href="/classes/create">
          <Button>
            <Plus className="h-4 w-4" />
            Yeni Sınıf
          </Button>
        </Link>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          name="Toplam Sınıf"
          value={stats?.totalClasses}
          icon={BookOpen}
          color="bg-brand-light text-brand"
          isLoading={statsLoading}
        />
        <StatsCard
          name="Aktif Sınıf"
          value={stats?.activeClasses}
          icon={CheckCircle}
          color="bg-emerald-100 text-emerald-600"
          isLoading={statsLoading}
        />
        <StatsCard
          name="Bugünkü Seanslar"
          value={stats?.sessionsToday}
          icon={Clock}
          color="bg-blue-100 text-blue-600"
          isLoading={statsLoading}
        />
        <StatsCard
          name="Ort. Kapasite"
          value={stats?.avgCapacity}
          icon={Users}
          color="bg-amber-100 text-amber-600"
          isLoading={statsLoading}
        />
      </div>

      <DataTableToolbar
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearchSubmit={handleSearch}
        searchPlaceholder="Sınıf adı ile ara..."
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
        filters={
          <select
            value={classType}
            onChange={(e) => {
              setClassType(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="">Tüm Tipler</option>
            <option value="group">Grup</option>
            <option value="private">Özel</option>
            <option value="semi_private">Yarı Özel</option>
          </select>
        }
      />

      {isError ? (
        <div className="rounded-lg bg-red-50 px-4 py-8 text-center text-sm text-red-700">
          {error?.response?.data?.message ||
            "Sınıflar yüklenirken hata oluştu."}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={classes}
          meta={meta}
          onPageChange={setPage}
          isLoading={isLoading}
          enableRowSelection={isOwner}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          getRowId={(row) => String(row.id)}
          emptyState={{
            icon: CalendarDays,
            title:
              search || classType
                ? "Arama sonucu bulunamadı"
                : "Henüz sınıf eklenmemiş",
            description:
              search || classType
                ? "Farklı filtrelerle tekrar deneyin."
                : "İlk sınıfınızı oluşturarak başlayın.",
            children: !search && !classType && (
              <Link href="/classes/create">
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                  İlk Sınıfı Ekle
                </Button>
              </Link>
            ),
          }}
        />
      )}

      {/* Row Preview Panel */}
      <RowPreviewPanel
        open={!!previewClass}
        onOpenChange={(open) => !open && setPreviewClass(null)}
        title="Sınıf Detayı"
      >
        {previewClass && (
          <dl className="space-y-3">
            <PreviewField label="Sınıf Adı" value={previewClass.name} />
            <PreviewField
              label="Tip"
              value={
                CLASS_TYPE_LABELS[previewClass.class_type] ||
                previewClass.class_type
              }
            />
            <PreviewField
              label="Süre"
              value={
                previewClass.duration_minutes
                  ? `${previewClass.duration_minutes} dk`
                  : undefined
              }
            />
            <PreviewField
              label="Kapasite"
              value={
                previewClass.max_capacity
                  ? `${previewClass.max_capacity} kişi`
                  : undefined
              }
            />
            <PreviewField
              label="Durum"
              value={previewClass.is_active ? "Aktif" : "Pasif"}
            />
            <PreviewField label="Açıklama" value={previewClass.description} />
            <PreviewField
              label="Oluşturma Tarihi"
              value={
                previewClass.created_at
                  ? new Date(previewClass.created_at).toLocaleDateString(
                      "tr-TR",
                    )
                  : undefined
              }
            />
            <div className="pt-3 border-t">
              <Link href={`/classes/${previewClass.id}`}>
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
        onClose={() => setDeleteModal({ open: false, classItem: null })}
        title="Sınıfı Sil"
      >
        <p className="text-sm text-gray-600">
          <span className="font-medium">{deleteModal.classItem?.name}</span>{" "}
          isimli sınıfı silmek istediğinize emin misiniz?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setDeleteModal({ open: false, classItem: null })}
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
