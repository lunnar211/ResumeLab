function SkeletonBox({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className ?? ""}`} />
}

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Stats skeleton */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-6">
            <SkeletonBox className="mb-2 h-4 w-24" />
            <SkeletonBox className="h-8 w-16" />
          </div>
        ))}
      </div>

      {/* Header row skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <SkeletonBox className="h-8 w-28" />
        <SkeletonBox className="h-9 w-36" />
      </div>

      {/* CV grid skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card overflow-hidden">
            <div className="p-4">
              <SkeletonBox className="mb-1 h-5 w-40" />
              <SkeletonBox className="mt-1 h-3.5 w-24" />
            </div>
            <div className="px-4 pb-2">
              <SkeletonBox className="h-28 w-full" />
            </div>
            <div className="flex gap-2 p-4 pt-2">
              <SkeletonBox className="h-8 flex-1" />
              <SkeletonBox className="h-8 w-8" />
              <SkeletonBox className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
