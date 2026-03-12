"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  useMembers,
  useMemberStats,
  useDeleteMember,
  useUpdateMember,
} from "@/hooks/useMembers";
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
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLES } from "@/lib/permissions";
import {
  Plus,
  Eye,
  Trash2,
  Users,
  ToggleLeft,
  ToggleRight,
  UserCheck,
  UserX,
  UserPlus,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const PIE_COLORS = ["#22c55e", "#ef4444"];

export default function MembersPage() {
  const { user } = useAuth();
  const isOwner = user?.role === ROLES.OWNER;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [deleteModal, setDeleteModal] = useState({ open: false, member: null });
  const [rowSelection, setRowSelection] = useState({});
  const [previewMember, setPreviewMember] = useState(null);

  const { data, isLoading, isError, error } = useMembers({
    page,
    limit: 20,
    search: search || undefined,
  });

  const { data: statsData, isLoading: statsLoading } = useMemberStats();

  const deleteMutation = useDeleteMember();
  const updateMutation = useUpdateMember();

  const members = data?.data || [];
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
    if (!deleteModal.member) return;
    try {
      await deleteMutation.mutateAsync(deleteModal.member.id);
      setDeleteModal({ open: false, member: null });
      toast.success("Üye başarıyla silindi.");
    } catch {
      toast.error("Üye silinirken hata oluştu.");
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
      toast.success(`${selectedIds.length} üye başarıyla silindi.`);
    } catch {
      toast.error("Toplu silme sırasında hata oluştu.");
    }
  };

  const handleToggleStatus = useCallback(
    async (member) => {
      const newStatus = !member.is_active;
      try {
        await updateMutation.mutateAsync({
          id: member.id,
          data: { isActive: newStatus },
        });
        toast.success(
          `${member.first_name} ${member.last_name} ${newStatus ? "aktif" : "pasif"} yapıldı.`,
        );
      } catch {
        toast.error("Durum güncellenirken hata oluştu.");
      }
    },
    [updateMutation],
  );

  const handleBulkStatusChange = async (newStatus) => {
    const selectedIds = Object.keys(rowSelection);
    if (selectedIds.length === 0) return;
    try {
      await Promise.all(
        selectedIds.map((id) =>
          updateMutation.mutateAsync({ id, data: { isActive: newStatus } }),
        ),
      );
      setRowSelection({});
      toast.success(
        `${selectedIds.length} üye ${newStatus ? "aktif" : "pasif"} yapıldı.`,
      );
    } catch {
      toast.error("Toplu durum güncelleme sırasında hata oluştu.");
    }
  };

  const columns = [
    getSelectionColumn(),
    {
      accessorFn: (row) => `${row.first_name} ${row.last_name}`,
      id: "name",
      header: "Ad Soyad",
      cell: ({ row }) => (
        <button
          type="button"
          className="cursor-pointer font-medium text-left hover:text-brand transition-colors"
          onClick={() => setPreviewMember(row.original)}
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
      accessorKey: "joined_at",
      header: "Katılım",
      cell: ({ getValue }) =>
        getValue() ? new Date(getValue()).toLocaleDateString("tr-TR") : "—",
    },
    {
      accessorKey: "is_active",
      header: "Durum",
      cell: ({ row }) => {
        const isActive = row.original.is_active;
        return (
          <button
            type="button"
            onClick={() => handleToggleStatus(row.original)}
            disabled={updateMutation.isPending}
            className="group flex cursor-pointer items-center gap-1.5 disabled:opacity-50"
          >
            <Badge variant={isActive ? "success" : "danger"}>
              {isActive ? "Aktif" : "Pasif"}
            </Badge>
            {isActive ? (
              <ToggleRight className="h-4 w-4 text-emerald-500 opacity-0 transition-opacity group-hover:opacity-100" />
            ) : (
              <ToggleLeft className="h-4 w-4 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
            )}
          </button>
        );
      },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">İşlemler</span>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/members/${row.original.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          {isOwner && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setDeleteModal({ open: true, member: row.original })
              }
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </div>
      ),
      enableSorting: false,
    },
  ];

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className="space-y-6">
      <PageHeader title="Üyeler" description="Stüdyo üyelerini yönetin.">
        <Link href="/members/create">
          <Button>
            <Plus className="h-4 w-4" />
            Yeni Üye
          </Button>
        </Link>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          name="Toplam Üye"
          value={stats?.totalMembers}
          icon={Users}
          color="bg-brand-light text-brand"
          isLoading={statsLoading}
        />
        <StatsCard
          name="Aktif Üye"
          value={stats?.activeMembers}
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
          name="Üyeliği Bitiyor"
          value={stats?.expiringSoon}
          icon={AlertTriangle}
          color="bg-amber-100 text-amber-600"
          isLoading={statsLoading}
        />
      </div>

      {/* Pie Chart */}
      {stats?.distribution && stats.distribution.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Üye Dağılımı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.distribution}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ status, count }) => `${status}: ${count}`}
                  >
                    {stats.distribution.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <DataTableToolbar
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearchSubmit={handleSearch}
        searchPlaceholder="Ad, e-posta veya telefon ile ara..."
        selectedCount={selectedCount}
        onClearSelection={() => setRowSelection({})}
        bulkActions={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleBulkStatusChange(true)}
            >
              <UserCheck className="h-4 w-4" />
              Aktif Yap
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleBulkStatusChange(false)}
            >
              <UserX className="h-4 w-4" />
              Pasif Yap
            </Button>
            {isOwner && (
              <Button variant="danger" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4" />
                Seçilenleri Sil
              </Button>
            )}
          </>
        }
      />

      {isError ? (
        <div className="rounded-lg bg-red-50 px-4 py-8 text-center text-sm text-red-700">
          {error?.response?.data?.message || "Üyeler yüklenirken hata oluştu."}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={members}
          meta={meta}
          onPageChange={setPage}
          isLoading={isLoading}
          enableRowSelection
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          getRowId={(row) => String(row.id)}
          emptyState={{
            icon: Users,
            title: search ? "Arama sonucu bulunamadı" : "Henüz üye eklenmemiş",
            description: search
              ? "Farklı anahtar kelimelerle tekrar deneyin."
              : "İlk üyenizi oluşturarak başlayın.",
            children: !search && (
              <Link href="/members/create">
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                  İlk Üyeyi Ekle
                </Button>
              </Link>
            ),
          }}
        />
      )}

      {/* Row Preview Panel */}
      <RowPreviewPanel
        open={!!previewMember}
        onOpenChange={(open) => !open && setPreviewMember(null)}
        title="Üye Detayı"
      >
        {previewMember && (
          <dl className="space-y-3">
            <PreviewField
              label="Ad Soyad"
              value={`${previewMember.first_name} ${previewMember.last_name}`}
            />
            <PreviewField label="E-posta" value={previewMember.email} />
            <PreviewField label="Telefon" value={previewMember.phone} />
            <PreviewField
              label="Cinsiyet"
              value={
                previewMember.gender === "male"
                  ? "Erkek"
                  : previewMember.gender === "female"
                    ? "Kadın"
                    : previewMember.gender === "other"
                      ? "Diğer"
                      : undefined
              }
            />
            <PreviewField
              label="Doğum Tarihi"
              value={
                previewMember.date_of_birth
                  ? new Date(previewMember.date_of_birth).toLocaleDateString(
                      "tr-TR",
                    )
                  : undefined
              }
            />
            <PreviewField
              label="Katılım Tarihi"
              value={
                previewMember.joined_at
                  ? new Date(previewMember.joined_at).toLocaleDateString(
                      "tr-TR",
                    )
                  : undefined
              }
            />
            <PreviewField
              label="Durum"
              value={previewMember.is_active ? "Aktif" : "Pasif"}
            />
            <PreviewField
              label="Acil Durum Kişisi"
              value={previewMember.emergency_contact_name}
            />
            <PreviewField
              label="Acil Durum Tel."
              value={previewMember.emergency_contact_phone}
            />
            {previewMember.notes && (
              <PreviewField label="Notlar" value={previewMember.notes} />
            )}
            <div className="pt-3 border-t">
              <Link href={`/members/${previewMember.id}`}>
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
        onClose={() => setDeleteModal({ open: false, member: null })}
        title="Üyeyi Sil"
      >
        <p className="text-sm text-gray-600">
          <span className="font-medium">
            {deleteModal.member?.first_name} {deleteModal.member?.last_name}
          </span>{" "}
          isimli üyeyi silmek istediğinize emin misiniz?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setDeleteModal({ open: false, member: null })}
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
