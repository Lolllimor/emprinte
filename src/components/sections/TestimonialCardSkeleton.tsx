export function TestimonialCardSkeleton() {
  return (
    <article
      className="flex w-[340px] shrink-0 flex-col gap-4 rounded-2xl bg-[#142218] p-6 animate-pulse md:w-[380px]"
      aria-hidden
    >
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-5 w-5 rounded-sm bg-white/15" />
        ))}
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-3.5 rounded bg-white/15 w-full" />
        <div className="h-3.5 rounded bg-white/15 w-full" />
        <div className="h-3.5 rounded bg-white/15 w-[88%]" />
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <div className="h-4 rounded bg-white/20 w-[45%]" />
        <div className="h-3 rounded bg-white/15 w-[32%]" />
      </div>
    </article>
  );
}
