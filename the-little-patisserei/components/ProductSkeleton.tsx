export default function ProductSkeleton() {
  return (
    <div className="grid gap-5 rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-[#F4CFC8] md:grid-cols-[260px_1fr_auto]">
      <div className="aspect-[4/3] animate-pulse rounded-[1.5rem] bg-[#FADCD4]" />

      <div className="flex flex-col justify-center space-y-4">
        <div className="h-6 w-2/3 animate-pulse rounded bg-[#FADCD4]" />
        <div className="h-4 w-full animate-pulse rounded bg-[#FADCD4]" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-[#FADCD4]" />
        <div className="h-6 w-24 animate-pulse rounded bg-[#FADCD4]" />
      </div>

      <div className="flex items-center">
        <div className="h-11 w-24 animate-pulse rounded-full bg-[#FADCD4]" />
      </div>
    </div>
  );
}