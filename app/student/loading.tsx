import { PageHeader } from '@/shared/components/dashboard/PageHeader';
import { WidgetCardSkeleton } from '@/shared/components/skeletons/WidgetCardSkeleton';
import { Skeleton } from '@/shared/components/ui/skeleton';

export default function StudentDashboardLoading() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Loading dashboard..."
        description="Fetching your learning progress."
      />

      {/* NextLiveClassCard Skeleton */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <Skeleton className="h-6 w-1/3 mb-2" />
        <Skeleton className="h-4 w-1/4" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <WidgetCardSkeleton />
        <WidgetCardSkeleton />
        <WidgetCardSkeleton />
        <WidgetCardSkeleton />
      </div>

      <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border/60">
        <div className="flex items-start gap-3.5">
          <Skeleton className="mt-0.5 size-10 shrink-0 rounded-xl" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-2/3" />
            <div className="pt-2">
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
