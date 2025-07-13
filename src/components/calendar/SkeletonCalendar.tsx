import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function SkeletonCalendar() {
  return (
    <div className="p-4 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-10 w-10 rounded-lg bg-gray-200" />
        <Skeleton className="h-6 w-40 rounded bg-gray-200" />
        <Skeleton className="h-10 w-10 rounded-lg bg-gray-200" />
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 mb-px">
        {Array.from({ length: 7 }).map((_, idx) => (
          <div
            key={idx}
            className="text-center text-sm font-semibold bg-gray-50 py-2"
          >
            <Skeleton className="h-4 w-10 mx-auto" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {Array.from({ length: 35 }).map((_, idx) => (
          <div
            key={idx}
            className={cn(
              'h-[120px] p-2 bg-white flex flex-col justify-between',
            )}
          >
            <Skeleton className="h-4 w-6 rounded" />
            <Skeleton className="h-5 w-full rounded mt-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
