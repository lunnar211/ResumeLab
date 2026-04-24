function SkeletonBox({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className ?? ""}`} />
}

export default function BuilderLoading() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b bg-background px-3 gap-2">
        <div className="flex items-center gap-2">
          <SkeletonBox className="h-8 w-8" />
          <SkeletonBox className="h-7 w-40" />
        </div>
        <div className="flex items-center gap-2">
          <SkeletonBox className="h-7 w-16" />
          <SkeletonBox className="h-7 w-20" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden lg:flex w-[140px] shrink-0 flex-col border-r bg-muted/20 py-2 gap-1 px-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonBox key={i} className="h-7 w-full" />
          ))}
        </div>

        {/* Form panel */}
        <div className="flex-1 flex flex-col border-r overflow-hidden">
          <div className="shrink-0 border-b p-2">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonBox key={i} className="h-16 w-14 shrink-0" />
              ))}
            </div>
          </div>
          <div className="shrink-0 border-b px-3 py-2">
            <SkeletonBox className="h-1.5 w-full" />
          </div>
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBox key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>

        {/* Preview panel */}
        <div className="hidden md:flex flex-1 overflow-hidden bg-muted/30 items-center justify-center">
          <SkeletonBox className="h-[90%] w-[60%]" />
        </div>
      </div>
    </div>
  )
}
