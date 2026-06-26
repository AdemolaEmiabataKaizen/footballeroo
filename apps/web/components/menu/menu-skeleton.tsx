'use client';

/**
 * Skeleton loading state for the menu grid.
 * Shows placeholder cards while dishes are being generated/fetched.
 */
export function MenuSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border bg-card shadow-sm animate-pulse"
        >
          {/* Image skeleton */}
          <div className="aspect-[4/3] bg-muted" />

          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            <div className="flex justify-between">
              <div className="space-y-1.5">
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="h-3 w-16 rounded bg-muted" />
              </div>
              <div className="h-4 w-12 rounded bg-muted" />
            </div>
            <div className="h-3 w-full rounded bg-muted" />
            <div className="h-3 w-3/4 rounded bg-muted" />
            <div className="flex justify-between items-center">
              <div className="flex gap-1">
                <div className="h-5 w-14 rounded-full bg-muted" />
                <div className="h-5 w-14 rounded-full bg-muted" />
              </div>
              <div className="h-7 w-14 rounded-lg bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton for the match banner
 */
export function BannerSkeleton() {
  return (
    <div className="rounded-xl border p-6 animate-pulse">
      <div className="h-3 w-40 rounded bg-muted" />
      <div className="mt-3 flex items-center gap-3">
        <div className="h-6 w-24 rounded bg-muted" />
        <div className="h-8 w-16 rounded-lg bg-muted" />
        <div className="h-6 w-24 rounded bg-muted" />
      </div>
      <div className="mt-3 h-3 w-56 rounded bg-muted" />
    </div>
  );
}
