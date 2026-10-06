import type { ReactNode } from 'react';
import { Skeleton } from '@/shared/components/ui/skeleton';

export function PanelSkeleton({ className, header }: { className?: string, header?: ReactNode }) {
  return (
    <div className={`flex flex-col gap-4 ${className || ''}`}>
      {header || (
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      )}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
