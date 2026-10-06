import { Card } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

export function WidgetCardSkeleton() {
  return (
    <Card className="gap-0 rounded-2xl border border-border/70 p-5 shadow-sm ring-0">
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="size-10 shrink-0 rounded-xl" />
      </div>
      <div className="mt-3">
        <Skeleton className="h-9 w-20" />
      </div>
      <div className="mt-1.5">
        <Skeleton className="h-5 w-32" />
      </div>
    </Card>
  );
}
