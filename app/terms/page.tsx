import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#FFF8E4] px-5 py-16 text-[#3A2A2A]">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-bold text-[#1D3C42]">Terms of Service</h1>
        <p className="mt-2 text-sm text-[#7A6262]">Last updated: May 2026</p>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-bold text-[#1D3C42]">1. Orders</h2>
            <p className="mt-2 text-[#7A6262]">
              All orders are subject to availability. We reserve the right to refuse or cancel any order.
              Upon placing an order, you will receive a confirmation with your order number and estimated
              completion time.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#1D3C42]">2. Payments</h2>
            <p className="mt-2 text-[#7A6262]">
              Payments are processed securely through Razorpay. By providing payment details, you confirm
              that you are authorised to use the payment method. All prices are in Indian Rupees (INR) and
              inclusive of applicable taxes.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#1D3C42]">3. Delivery & Pickup</h2>
            <p className="mt-2 text-[#7A6262]">
              Delivery times are estimates and not guaranteed. We deliver within Chennai and ship via courier
              to select South Indian cities. Pickup is available from our Arumbakkam bakery during operating
              hours. Delivery fees are non-refundable once the order is in transit.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#1D3C42]">4. Cancellations & Refunds</h2>
            <p className="mt-2 text-[#7A6262]">
              Orders may be cancelled before preparation begins. Once preparation has started, cancellations
              are at our discretion. Refunds for cancellations will be processed within 5-7 business days to
              the original payment method. Please contact us for any quality concerns.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#1D3C42]">5. Custom Cakes</h2>
            <p className="mt-2 text-[#7A6262]">
              Custom cake orders require minimum 48 hours notice. Design consultations are facilitated via
              WhatsApp. Final designs may vary from reference images due to ingredient availability and
              feasibility.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#1D3C42]">6. Limitation of Liability</h2>
            <p className="mt-2 text-[#7A6262]">
              The Little Patisserie is not liable for any indirect, incidental, or consequential damages
              arising from the use of our products or services. Our total liability is limited to the
              amount paid for the order in question.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#1D3C42]">7. Contact</h2>
            <p className="mt-2 text-[#7A6262]">
              For any queries regarding these terms, reach us at{" "}
              <a href="tel:+919488407130" className="font-semibold text-[#1D3C42] underline">+91 94884 07130</a>{" "}
              or via our{" "}
              <a href="/about#contact" className="font-semibold text-[#1D3C42] underline">contact page</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
