export default function BrandLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#1D3C42] text-center">
      <div>
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full border border-[#D4AF37]/40 bg-white/5">
          <img
            src="/logo.png"
            alt="The Little Patisserie"
            className="h-16 w-16 object-contain"
          />
        </div>

        <h1 className="mt-6 text-3xl font-extrabold tracking-wide text-[#D4AF37]">
          The Little Patisserie
        </h1>

        <p className="mt-2 text-sm uppercase tracking-[0.3em] text-white/70">
          Baking something sweet
        </p>

        <div className="mx-auto mt-6 h-1 w-32 overflow-hidden rounded-full bg-white/15">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-[#D4AF37]" />
        </div>
      </div>
    </div>
  );
}