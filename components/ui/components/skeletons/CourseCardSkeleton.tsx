import { Skeleton } from '@/shared/components/ui/skeleton';

export function CourseCardSkeleton() {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/60">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <Skeleton className="size-full rounded-none" />
        <Skeleton className="absolute left-3 top-3 z-10 h-6 w-16 rounded-full" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="mt-1 h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        
        <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3">
          <div className="flex items-center gap-2">
            <Skeleton className="size-7 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}
