"use client";

import { useCart } from "./CartContext";

export default function LoginModal() {
  const { showLogin, setShowLogin, phone, setPhone, verifyOtp } = useCart();

  if (!showLogin) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-2xl">
        <h2 className="text-2xl font-extrabold text-[#3A2A2A]">
          Login to add items
        </h2>

        <p className="mt-2 text-sm text-[#7A6262]">
          Enter your mobile number. We’ll verify with OTP before adding items to
          cart.
        </p>

        <div className="mt-6 grid gap-4">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Mobile number"
            className="rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 outline-none focus:border-[#F08C9B] text-[#3A2A2A]"
          />

          <input
            placeholder="Enter OTP"
            className="rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 outline-none focus:border-[#F08C9B] text-[#3A2A2A]"
          />

          <button
            onClick={verifyOtp}
            className="rounded-full bg-[#F08C9B] px-6 py-3 font-semibold text-white"
          >
            Verify OTP
          </button>

          <button
            onClick={() => setShowLogin(false)}
            className="text-sm font-semibold text-[#7A6262]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}