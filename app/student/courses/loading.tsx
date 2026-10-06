import { PageHeader } from '@/shared/components/dashboard/PageHeader';
import { CourseCardSkeleton } from '@/shared/components/skeletons/CourseCardSkeleton';
import { Skeleton } from '@/shared/components/ui/skeleton';

export default function BrowseCoursesLoading() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Browse courses"
        description="Find a course and enroll instantly — choose your learning mode and head straight to checkout."
      />

      {/* MarketplaceFilters Skeleton */}
      <div className="flex flex-wrap items-center gap-3 border-b border-border/50 pb-4">
        <Skeleton className="h-9 w-64 rounded-md" /> {/* search box */}
        <Skeleton className="h-9 w-32 rounded-md" /> {/* category filter */}
        <Skeleton className="h-9 w-32 rounded-md" /> {/* language filter */}
        <Skeleton className="h-9 w-24 rounded-md" /> {/* difficulty filter */}
      </div>

      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-20" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <CourseCardSkeleton />
        <CourseCardSkeleton />
        <CourseCardSkeleton />
        <CourseCardSkeleton />
        <CourseCardSkeleton />
        <CourseCardSkeleton />
      </div>
    </div>
  );
}
