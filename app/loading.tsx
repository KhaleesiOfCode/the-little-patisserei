export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#FFF8E4]">
      <div className="text-center">
        <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-[#D4AF37] border-t-[#1D3C42]" />
        <p className="mt-4 text-sm font-semibold text-[#1D3C42]">
          Baking something sweet...
        </p>
      </div>
    </div>
  );
}