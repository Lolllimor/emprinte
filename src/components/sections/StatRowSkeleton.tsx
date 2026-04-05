export function StatRowSkeleton() {
  return (
    <div className="flex items-center gap-2 animate-pulse" aria-hidden>
      <div className="h-[60px] md:h-10 xl:h-16 w-[72px] md:w-[88px] xl:w-[104px] shrink-0 rounded-md bg-white/15" />
      <div className="flex flex-col gap-2 min-w-0 max-w-[120px] lg:max-w-[170px]">
        <div className="h-4 rounded bg-white/15 w-full" />
        <div className="h-4 rounded bg-white/15 w-[85%]" />
      </div>
    </div>
  );
}
