import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFF8E4] px-4">
      <div className="max-w-md text-center">
        <h1 className="text-8xl font-extrabold text-[#D4AF37]">404</h1>
        <h2 className="mt-4 text-2xl font-extrabold text-[#1D3C42]">
          Page not found
        </h2>
        <p className="mt-3 text-[#7A6262]">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-[#1D3C42] px-7 py-3 font-semibold text-white transition hover:bg-[#163136]"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
