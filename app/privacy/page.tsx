import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#FFF8E4] px-5 py-16 text-[#3A2A2A]">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-bold text-[#1D3C42]">Privacy Policy</h1>
        <p className="mt-2 text-sm text-[#7A6262]">Last updated: May 2026</p>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-bold text-[#1D3C42]">1. Information We Collect</h2>
            <p className="mt-2 text-[#7A6262]">
              When you place an order on The Little Patisserie, we collect your name, phone number, email address,
              delivery address, and order details. This information is necessary to process and fulfil your order.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#1D3C42]">2. How We Use Your Information</h2>
            <p className="mt-2 text-[#7A6262]">
              We use your information solely to process orders, communicate order updates, and provide customer
              support. We do not sell, rent, or share your personal data with third parties except as required
              to fulfil your order (e.g., delivery partners, payment processors).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#1D3C42]">3. Data Security</h2>
            <p className="mt-2 text-[#7A6262]">
              We implement reasonable security measures to protect your personal information. Payment transactions
              are processed through Razorpay and are subject to their security policies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#1D3C42]">4. Data Retention</h2>
            <p className="mt-2 text-[#7A6262]">
              We retain your order information for record-keeping purposes. You may request deletion of your
              data by contacting us at the details below.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#1D3C42]">5. Contact</h2>
            <p className="mt-2 text-[#7A6262]">
              For questions about this policy, contact us at{" "}
              <a href="tel:+919488407130" className="font-semibold text-[#1D3C42] underline">+91 94884 07130</a>{" "}
              or visit our{" "}
              <a href="/about#contact" className="font-semibold text-[#1D3C42] underline">contact page</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
