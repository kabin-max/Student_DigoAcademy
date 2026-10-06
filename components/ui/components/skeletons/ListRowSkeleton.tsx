import { Skeleton } from '@/shared/components/ui/skeleton';

export function ListRowSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border/50 p-4">
      <Skeleton className="size-12 shrink-0 rounded-md" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <Skeleton className="h-8 w-24 shrink-0 rounded-md" />
    </div>
  );
}
