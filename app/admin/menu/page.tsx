import Link from "next/link";

export default function AdminMenuPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFF8E4] px-4">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-[#1D3C42]">Admin</h1>
        <p className="mt-2 text-[#7A6262]">Menu management coming soon.</p>
        <Link
          href="/admin/orders"
          className="mt-6 inline-block rounded-full bg-[#1D3C42] px-7 py-3 font-semibold text-white transition hover:bg-[#163136]"
        >
          View orders
        </Link>
      </div>
    </main>
  );
}
