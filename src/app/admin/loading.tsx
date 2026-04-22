import {
  AdminContentGridSkeleton,
  AdminMetricCardsSkeleton,
  AdminPageHeaderSkeleton,
} from "@/components/admin/admin-page-skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <AdminPageHeaderSkeleton />
      <AdminMetricCardsSkeleton />
      <AdminContentGridSkeleton />
    </div>
  );
}
