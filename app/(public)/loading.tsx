import { Skeleton } from '@/shared/components/ui/skeleton';

export default function PublicRootLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <Skeleton className="size-16 rounded-full" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="mt-12 w-full max-w-6xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="aspect-video w-full rounded-2xl" />
          <Skeleton className="aspect-video w-full rounded-2xl hidden sm:block" />
          <Skeleton className="aspect-video w-full rounded-2xl hidden lg:block" />
        </div>
      </div>
    </div>
  );
}
