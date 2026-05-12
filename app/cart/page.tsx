"use client";

import { useEffect, useMemo, useState, startTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, FileText, Lock, CreditCard, CheckCircle, ArrowLeft, AlertTriangle, Package, ShoppingBag } from "lucide-react";
import { useCart } from "../../components/CartContext";
import { createOrder } from "../../lib/supabase/orders";
import type { OrderFormData, DeliveryMode } from "../../types/menu";
import { getMinDateTime } from "../../types/menu";
import { getDeliveryZone, getDeliveryFeeMessage } from "../../lib/delivery-zones";
import { calculateCourierCharge, getCourierMessage } from "../../lib/delivery/courierZones";
import { SOUTH_INDIA_STATES, getDistrictsForState, getCitiesForDistrict } from "../../lib/delivery/southIndiaData";
import {
  sanitizeName, sanitizeCity, sanitizePhone,
  sanitizeAddress, sanitizePincode, sanitizeEmail,
  validatePhone, validatePincode, validateEmail,
} from "../../lib/validation";
import { isOrderWindowOpen, refreshStoreStatus, getFormattedClosureEnd, getClosureReason } from "../../lib/store-hours";

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQty, removeFromCart, clearCart, total } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paid, setPaid] = useState(false);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const [orderWindowOpen, setOrderWindowOpen] = useState(true);

  useEffect(() => {
    refreshStoreStatus().then(() => setOrderWindowOpen(isOrderWindowOpen()));
    const interval = setInterval(() => {
      refreshStoreStatus().then(() => setOrderWindowOpen(isOrderWindowOpen()));
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const [mode, setMode] = useState<DeliveryMode | null>(null);
  const [form, setForm] = useState<OrderFormData>({
    deliveryMode: "local_delivery",
    name: "",
    phone: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    district: "",
    pincode: "",
    landmark: "",
    deliveryDate: "",
    deliverySlot: "",
    instructions: "",
    pickupDate: "",
    pickupSlot: "",
    receiverName: "",
    receiverPhone: "",
    alternatePhone: "",
    courierAddress: "",
    courierNotes: "",
    confirmCourierRisk: false,
  });

  const zoneInfo = useMemo(
    () => getDeliveryZone(form.city, form.pincode, form.landmark),
    [form.city, form.pincode, form.landmark],
  );

  const effectiveMode: DeliveryMode | null = mode;

  const courierCalc = useMemo(() => {
    if (effectiveMode !== "courier") return null
    return calculateCourierCharge(
      cart.map((item) => ({
        quantityLabel: item.selectedQuantity,
        courierWeightGrams: null,
        courierFragile: false,
      })),
      cart.map((item) => item.qty),
      form.state,
      form.district,
    )
  }, [effectiveMode, form.state, form.district, cart])

  const hasNonCourierItems = effectiveMode === "courier" && cart.some((item) => item.courier_supported === false)
  const hasNonBrownieItems = effectiveMode === "courier" && cart.some((item) => item.category !== "Brownies")
  const courierDisabled = hasNonCourierItems || hasNonBrownieItems

  const courierDeliveryEstimate = useMemo(() => {
    if (effectiveMode !== "courier" || !form.state) return ""
    if (form.state === "Tamil Nadu") return "Estimated delivery: 1 day"
    return "Estimated delivery: 2-3 days"
  }, [effectiveMode, form.state])

  const courierCharge = courierCalc?.courier_charge ?? 0
  const fragileSurcharge = courierCalc?.fragile_surcharge ?? 0

  const deliveryFee = effectiveMode === "pickup" ? 0 : effectiveMode === "courier" ? courierCharge : (zoneInfo.zone.fee ?? 0);
  const deliveryZone = effectiveMode === "local_delivery" ? zoneInfo.zone.key : effectiveMode === "courier" ? (courierCalc?.courier_zone ?? null) : null;
  const deliverySupported = effectiveMode !== "local_delivery" || zoneInfo.isSupported;

  const minDate = useMemo(() => {
    const d = getMinDateTime(effectiveMode || "local_delivery");
    return d.toISOString().split("T")[0];
  }, [effectiveMode]);

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const blur = (field: string) => setTouched((prev) => ({ ...prev, [field]: true }));

  const deliveryCharge = deliveryFee;
  const grandTotal = total + deliveryCharge + fragileSurcharge;

  useEffect(() => {
    if (!effectiveMode) return;
    startTransition(() => {
      if (effectiveMode === "pickup" && !form.pickupDate) {
        setForm((prev) => ({ ...prev, pickupDate: minDate }));
      }
      if (effectiveMode !== "pickup" && !form.deliveryDate) {
        setForm((prev) => ({ ...prev, deliveryDate: minDate }));
      }
    });
  }, [effectiveMode, minDate, form.pickupDate, form.deliveryDate]);

  const isChennaiLocal = effectiveMode === "local_delivery" && form.pincode.startsWith("600");

  const update = (field: keyof OrderFormData, value: string) =>
    setForm((prev) => {
      let sanitized = value;

      switch (field) {
        case "name":
        case "receiverName":
          sanitized = sanitizeName(value);
          break;
        case "city":
        case "state":
        case "district":
        case "landmark":
          sanitized = sanitizeCity(value);
          break;
        case "phone":
        case "receiverPhone":
        case "alternatePhone":
          sanitized = sanitizePhone(value);
          break;
        case "pincode":
          sanitized = sanitizePincode(value);
          break;
        case "addressLine1":
        case "addressLine2":
        case "courierAddress":
        case "courierNotes":
        case "instructions":
          sanitized = sanitizeAddress(value);
          break;
        case "email":
          sanitized = sanitizeEmail(value);
          break;
      }

      const next = { ...prev, [field]: sanitized };
      return next;
    });

  const startCheckout = (m: DeliveryMode) => {
    if (m === "local_delivery") {
      setAwaitingSubMode(true);
      setShowCheckout(true);
      return;
    }
    setMode(m);
    setForm((prev) => ({ ...prev, deliveryMode: m }));
    setShowCheckout(true);
    setShowCourierDetails(false);
    setSameAsDeliveryAddress(true);
  };

  const selectSubMode = (subMode: "local_delivery" | "courier") => {
    setMode(subMode);
    setForm((prev) => ({ ...prev, deliveryMode: subMode }));
    setAwaitingSubMode(false);
    setShowCourierDetails(false);
    setSameAsDeliveryAddress(true);
  };

  const handleGoToCourierDetails = () => {
    setForm((prev) => ({
      ...prev,
      receiverName: sameAsDeliveryAddress ? prev.name : "",
      receiverPhone: sameAsDeliveryAddress ? prev.phone : "",
      courierAddress: sameAsDeliveryAddress
        ? [prev.addressLine1, prev.addressLine2, prev.district, prev.state, prev.pincode]
            .filter(Boolean)
            .join(", ")
        : "",
    }));
    setShowCourierDetails(true);
  };

  const simulatePayment = () =>
    new Promise<void>((resolve) => {
      setSubmitting(true);
      setTimeout(() => { setPaid(true); setSubmitting(false); resolve(); }, 2000);
    });

  const handlePlaceOrder = async () => {
    if (cart.length === 0 || !effectiveMode) return;
    await simulatePayment();
    const items = cart.map((item) => ({
      name: item.name, price: item.price, qty: item.qty,
      quantityLabel: item.selectedQuantity, eggOption: item.selectedEggOption,
      productId: item.originalId || item.id,
    }));
    const order = await createOrder(
      {
        ...form,
        deliveryMode: effectiveMode,
        city: isChennaiLocal ? "Chennai" : form.city,
        state: isChennaiLocal ? "Tamil Nadu" : form.state,
      },
      items,
      total,
      deliveryFee,
      deliveryZone,
      courierCalc?.courier_zone ?? null,
      courierCalc?.total_courier_weight_grams ?? null,
      courierCalc?.courier_weight_slab ?? null,
      fragileSurcharge,
    );
    if (order) { clearCart(); router.push(`/order/confirmation?id=${order.id}`); }
  };

  const emailValid = !form.email || validateEmail(form.email);

  const canSubmit = (() => {
    if (!effectiveMode) return false;
    if (!orderWindowOpen) return false;
    if (!form.name || !validatePhone(form.phone) || !emailValid) return false;
    if (effectiveMode === "pickup") return form.pickupDate !== "" && emailValid;
    if (effectiveMode === "courier") {
      if (courierDisabled) return false
      if (courierCalc?.courier_fee_status === "manual_confirmation" || !courierCalc) return false
      return form.addressLine1 && form.city && form.district && form.pincode &&
        validatePincode(form.pincode) &&
        form.receiverName && validatePhone(form.receiverPhone) &&
        form.courierAddress && form.confirmCourierRisk;
    }
    if (effectiveMode === "local_delivery") {
      if (!form.addressLine1 || !form.pincode) return false;
      if (!validatePincode(form.pincode)) return false;
      if (!deliverySupported) return false;
      if (!isChennaiLocal && !form.city) return false;
      return form.deliveryDate !== "";
    }
    return false;
  })();

  if (!orderWindowOpen) {
    return (
      <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
        <section className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-5 text-center">
          <svg viewBox="0 0 120 80" className="mx-auto h-24 w-32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="15" width="100" height="55" rx="8" fill="#FEF3C7" stroke="#D4AF37" strokeWidth="2"/>
            <rect x="45" y="5" width="30" height="15" rx="3" fill="#D4AF37"/>
            <circle cx="60" cy="12" r="3" fill="white"/>
            <text x="60" y="40" textAnchor="middle" fontSize="16" fontWeight="900" fill="#1D3C42" fontFamily="system-ui">CLOSED</text>
            <text x="60" y="55" textAnchor="middle" fontSize="8" fill="#7A6262" fontFamily="system-ui">WE&apos;LL BE BACK</text>
          </svg>
          <h1 className="mt-6 font-display text-2xl font-bold text-[#1D3C42]">Store is currently closed</h1>
          <p className="mt-2 text-sm text-[#7A6262]">
            {getClosureReason() || "Orders are paused"}
            {getFormattedClosureEnd() ? ` — resumes ${getFormattedClosureEnd()}` : ""}
          </p>
          <Link href="/" className="mt-6 inline-block rounded-full bg-[#1D3C42] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#163136]">Back to Home</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      <section className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr] lg:items-start">
          <div className="rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-[#F4CFC8] sm:p-5 md:p-8">
            <div className="flex items-center gap-3">
              <Link href="/menu" className="grid h-9 w-9 place-items-center rounded-full bg-[#FFF8E4] text-[#1D3C42] transition hover:bg-[#FADCD4]" aria-label="Back to menu"><ArrowLeft size={18} /></Link>
              <h1 className="font-display text-2xl font-bold">My cart {cart.length > 0 && <span className="text-base font-bold text-[#D4AF37]">({cart.length})</span>}</h1>
            </div>

            <div className="mt-6">
              {cart.length === 0 ? (
                <div className="py-16 text-center">
                  <ShoppingBag size={48} className="mx-auto text-[#D4AF37]/40" />
                  <p className="mt-4 text-lg font-semibold text-[#7A6262]">Your cart is empty</p>
                  <p className="mt-1 text-sm text-[#7A6262]/70">Add items from the menu to get started</p>
                  <Link href="/menu" className="mt-6 inline-block rounded-full bg-[#1D3C42] px-8 py-3 font-semibold text-white transition hover:bg-[#163136]">View Menu</Link>
                </div>
              ) : (
                <div className="divide-y divide-[#F4CFC8]">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 py-4 first:pt-0 last:pb-0 sm:gap-4 sm:py-5">
                      <img src={item.image} alt={item.name} className="h-20 w-20 shrink-0 rounded-xl object-cover md:h-24 md:w-24" />
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h2 className="font-bold text-[#3A2A2A]">{item.name}</h2>
                            <button onClick={() => setConfirmRemoveId(item.id)} className="shrink-0 text-[#D4AF37] transition hover:text-red-500" aria-label="Remove item"><Trash2 size={16} /></button>
                          </div>
                          {item.selectedQuantity && (
                            <p className="mt-0.5 text-sm text-[#7A6262]">
                              {item.selectedQuantity}{item.selectedEggOption ? ` · ${item.selectedEggOption}` : ""}
                            </p>
                          )}
                          {item.cakeMessage && <p className="mt-0.5 text-xs text-[#D4AF37]">📝 {item.cakeMessage}</p>}
                          {item.cakeOccasion && <p className="text-xs text-[#7A6262]">🎉 {item.cakeOccasion}</p>}
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-[#F08C9B] bg-[#FFF8E4]">
                            <button onClick={() => updateQty(item.id, item.qty - 1)} className="flex h-8 w-8 items-center justify-center text-sm font-bold text-[#D4AF37] transition hover:bg-[#FADCD4] rounded-l-full">−</button>
                            <span className="flex h-8 w-8 items-center justify-center text-sm font-bold text-[#3A2A2A]">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, item.qty + 1)} className="flex h-8 w-8 items-center justify-center text-sm font-bold text-[#D4AF37] transition hover:bg-[#FADCD4] rounded-r-full">+</button>
                          </div>
                          <p className="text-lg font-extrabold text-[#1D3C42]">₹{item.price * item.qty}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && !showCheckout && (
              <div className="mt-6 rounded-2xl bg-[#FFF8E4] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#7A6262]">
                  <FileText size={16} />
                  <span>Write a short message / Add notes <span className="font-normal text-[#7A6262]/60">(optional)</span></span>
                </div>
                <textarea
                  value={form.instructions}
                  onChange={(e) => update("instructions", e.target.value)}
                  placeholder="Write a short message / Add notes..."
                  className="mt-3 w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 text-sm text-[#3A2A2A] outline-none placeholder:text-[#7A6262] focus:border-[#1D3C42]"
                />
              </div>
            )}

            {showCheckout && !mode && cart.length > 0 && !awaitingSubMode && (
              <div className="mt-8 rounded-[2rem] bg-[#FFF8E4] p-6 text-center ring-1 ring-[#F4CFC8]">
                <h2 className="font-display text-2xl font-bold">Choose how to receive</h2>
                <p className="mt-2 text-sm text-[#7A6262]">Select pickup or delivery</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <button onClick={() => startCheckout("pickup")} className="rounded-[2rem] border-2 border-[#D4AF37] bg-white p-6 text-center transition hover:bg-[#FFF8E4] hover:shadow-md">
                    <Package size={32} className="mx-auto text-[#D4AF37]" />
                    <h3 className="mt-3 font-display text-lg font-bold text-[#1D3C42]">Pickup</h3>
                    <p className="mt-1 text-sm text-[#7A6262]">Free · Collect from our bakery</p>
                  </button>
                  <button onClick={() => startCheckout("local_delivery")} className="rounded-[2rem] border-2 border-[#D4AF37] bg-white p-6 text-center transition hover:bg-[#FFF8E4] hover:shadow-md">
                    <TruckIcon size={32} className="mx-auto text-[#D4AF37]" />
                    <h3 className="mt-3 font-display text-lg font-bold text-[#1D3C42]">Delivery</h3>
                    <p className="mt-1 text-sm text-[#7A6262]">Within Chennai or courier</p>
                  </button>
                </div>
              </div>
            )}

            {showCheckout && awaitingSubMode && cart.length > 0 && (
              <div className="mt-8 rounded-[2rem] bg-[#FFF8E4] p-6 text-center ring-1 ring-[#F4CFC8]">
                <h2 className="font-display text-2xl font-bold">Delivery location</h2>
                <p className="mt-2 text-sm text-[#7A6262]">Choose your delivery type</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <button onClick={() => selectSubMode("local_delivery")} className="rounded-[2rem] border-2 border-[#D4AF37] bg-white p-6 text-center transition hover:bg-[#FFF8E4] hover:shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-[#D4AF37]"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    <h3 className="mt-3 font-display text-lg font-bold text-[#1D3C42]">Within Chennai</h3>
                    <p className="mt-1 text-sm text-[#7A6262]">Delivered within Chennai</p>
                  </button>
                  <button onClick={() => selectSubMode("courier")} disabled={cart.some((item) => item.category !== "Brownies")} className="rounded-[2rem] border-2 border-[#D4AF37] bg-white p-6 text-center transition hover:bg-[#FFF8E4] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40">
                    <TruckIcon size={32} className="mx-auto text-[#D4AF37]" />
                    <h3 className="mt-3 font-display text-lg font-bold text-[#1D3C42]">Outside Chennai</h3>
                    <p className="mt-1 text-sm text-[#7A6262]">Courier — Brownies only</p>
                  </button>
                </div>
                <button onClick={() => { setAwaitingSubMode(false); setShowCheckout(false); }} className="mt-4 text-xs font-bold text-[#D4AF37] underline">Back</button>
              </div>
            )}

            {showCheckout && mode && cart.length > 0 && (
              <div className="mt-8 rounded-[2rem] bg-[#FFF8E4] p-6 ring-1 ring-[#F4CFC8]">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl font-bold">
                    {effectiveMode === "pickup" ? "Pickup details" : "Delivery details"}
                  </h2>
                  <button onClick={() => { setMode(null); setAwaitingSubMode(false); setShowCheckout(false); }} className="text-xs font-bold text-[#D4AF37] underline">Change</button>
                </div>

                {effectiveMode === "pickup" && (
                  <div className="mt-6 grid gap-4">
                    <div className="rounded-2xl bg-green-50 p-4 text-sm font-semibold text-green-800 ring-1 ring-green-200">
                      Pickup from our bakery. Ready by {new Date(minDate).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} (24 hrs prep)
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <input value={form.name} onChange={(e) => update("name", e.target.value)} onBlur={() => blur("name")} className={`rounded-2xl border bg-white px-4 py-3 outline-none w-full focus:border-[#1D3C42] ${touched.name && !form.name ? "border-red-400" : "border-[#F4CFC8]"}`} placeholder="Full name *" />
                        {touched.name && !form.name && <p className="mt-1 text-xs text-red-500">Enter your full name</p>}
                      </div>
                      <div>
                        <div className="relative">
                          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#7A6262]">+91</span>
                          <input value={form.phone} onChange={(e) => update("phone", e.target.value)} onBlur={() => blur("phone")} className={`rounded-2xl border bg-white px-4 py-3 outline-none w-full pl-14 focus:border-[#1D3C42] ${touched.phone && !validatePhone(form.phone) ? "border-red-400" : "border-[#F4CFC8]"}`} placeholder="Mobile number *" />
                        </div>
                        {touched.phone && !validatePhone(form.phone) && <p className="mt-1 text-xs text-red-500">Enter a valid 10-digit mobile number</p>}
                      </div>
                    </div>
                    <div>
                      <input value={form.email} onChange={(e) => update("email", e.target.value)} onBlur={() => blur("email")} className={`rounded-2xl border bg-white px-4 py-3 outline-none w-full focus:border-[#1D3C42] ${touched.email && form.email && !validateEmail(form.email) ? "border-red-400" : "border-[#F4CFC8]"}`} placeholder="Email (optional)" />
                      {touched.email && form.email && !validateEmail(form.email) && <p className="mt-1 text-xs text-red-500">Enter a valid email address</p>}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold">Pickup date *</label>
                        <input type="date" value={form.pickupDate} onChange={(e) => update("pickupDate", e.target.value)} min={minDate} className="w-full rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" />
                        <p className="mt-1 text-xs text-[#7A6262]">Ready by: {new Date(minDate).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} (24 hrs prep)</p>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold">Pickup time</label>
                        <select value={form.pickupSlot} onChange={(e) => update("pickupSlot", e.target.value)} className="w-full rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 text-sm outline-none focus:border-[#1D3C42]">
                          <option value="">Select time</option>
                          <option value="9AM-12PM">9 AM - 12 PM</option>
                          <option value="12PM-3PM">12 PM - 3 PM</option>
                          <option value="3PM-6PM">3 PM - 6 PM</option>
                          <option value="6PM-9PM">6 PM - 9 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {(effectiveMode === "local_delivery" || effectiveMode === "courier") && (
                  <div className="mt-6 grid gap-4">
                    <div className={`rounded-2xl p-4 text-sm font-semibold ring-1 ${
                      effectiveMode === "courier"
                        ? "bg-orange-50 text-orange-800 ring-orange-200"
                        : "bg-green-50 text-green-800 ring-green-200"
                    }`}>
                      {effectiveMode === "courier" ? (
                        <><AlertTriangle size={16} className="mr-1 inline" /> Prep Time — minimum 24 hours. {courierDeliveryEstimate}</>
                      ) : "Within Chennai — minimum 24 hours."}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <input value={form.name} onChange={(e) => update("name", e.target.value)} onBlur={() => blur("name")} className={`rounded-2xl border bg-white px-4 py-3 outline-none w-full focus:border-[#1D3C42] ${touched.name && !form.name ? "border-red-400" : "border-[#F4CFC8]"}`} placeholder="Full name *" />
                        {touched.name && !form.name && <p className="mt-1 text-xs text-red-500">Enter your full name</p>}
                      </div>
                      <div>
                        <div className="relative">
                          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#7A6262]">+91</span>
                          <input value={form.phone} onChange={(e) => update("phone", e.target.value)} onBlur={() => blur("phone")} className={`rounded-2xl border bg-white px-4 py-3 outline-none w-full pl-14 focus:border-[#1D3C42] ${touched.phone && !validatePhone(form.phone) ? "border-red-400" : "border-[#F4CFC8]"}`} placeholder="Mobile number *" />
                        </div>
                        {touched.phone && !validatePhone(form.phone) && <p className="mt-1 text-xs text-red-500">Enter a valid 10-digit mobile number</p>}
                      </div>
                    </div>
                    <div>
                      <input value={form.email} onChange={(e) => update("email", e.target.value)} onBlur={() => blur("email")} className={`rounded-2xl border bg-white px-4 py-3 outline-none w-full focus:border-[#1D3C42] ${touched.email && form.email && !validateEmail(form.email) ? "border-red-400" : "border-[#F4CFC8]"}`} placeholder="Email (optional)" />
                      {touched.email && form.email && !validateEmail(form.email) && <p className="mt-1 text-xs text-red-500">Enter a valid email address</p>}
                    </div>
                    <div>
                      <input value={form.addressLine1} onChange={(e) => update("addressLine1", e.target.value)} onBlur={() => blur("addressLine1")} className={`rounded-2xl border bg-white px-4 py-3 outline-none w-full focus:border-[#1D3C42] ${touched.addressLine1 && !form.addressLine1 ? "border-red-400" : "border-[#F4CFC8]"}`} placeholder="Address line 1 *" />
                      {touched.addressLine1 && !form.addressLine1 && <p className="mt-1 text-xs text-red-500">Enter your address</p>}
                    </div>
                    <input value={form.addressLine2} onChange={(e) => update("addressLine2", e.target.value)} className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" placeholder="Address line 2 (optional)" />
                    <div className="grid gap-4 sm:grid-cols-3">
                      {effectiveMode !== "courier" && (
                        <div>
                          <input value={form.pincode} onChange={(e) => update("pincode", e.target.value)} onBlur={() => blur("pincode")} className={`rounded-2xl border bg-white px-4 py-3 outline-none w-full focus:border-[#1D3C42] ${touched.pincode && !validatePincode(form.pincode) ? "border-red-400" : "border-[#F4CFC8]"}`} placeholder="Pincode *" />
                          {touched.pincode && !validatePincode(form.pincode) && <p className="mt-1 text-xs text-red-500">Enter a valid 6-digit South Indian pincode</p>}
                        </div>
                      )}
                      {(effectiveMode === "courier") && (
                        <>
                          <div>
                            <select value={form.state} onChange={(e) => { update("state", e.target.value); update("district", ""); update("city", ""); }} onBlur={() => blur("state")} className={`rounded-2xl border bg-white px-4 py-3 text-sm outline-none w-full focus:border-[#1D3C42] ${touched.state && !form.state ? "border-red-400" : "border-[#F4CFC8]"}`}>
                              <option value="">State *</option>
                              {SOUTH_INDIA_STATES.map((s) => (
                                <option key={s.name} value={s.name}>{s.name}</option>
                              ))}
                            </select>
                            {touched.state && !form.state && <p className="mt-1 text-xs text-red-500">Select a state</p>}
                          </div>
                          <div>
                            <select value={form.district} onChange={(e) => { update("district", e.target.value); update("city", ""); }} onBlur={() => blur("district")} disabled={!form.state} className={`rounded-2xl border bg-white px-4 py-3 text-sm outline-none w-full focus:border-[#1D3C42] disabled:opacity-50 ${touched.district && !form.district ? "border-red-400" : "border-[#F4CFC8]"}`}>
                              <option value="">District *</option>
                              {form.state && getDistrictsForState(form.state).filter((d) => d.name !== "Chennai").map((d) => (
                                <option key={d.name} value={d.name}>{d.name}</option>
                              ))}
                            </select>
                            {touched.district && !form.district && <p className="mt-1 text-xs text-red-500">Select a district</p>}
                          </div>
                        </>
                      )}
                      {(effectiveMode === "courier") ? (
                        <div>
                          <select value={form.city} onChange={(e) => update("city", e.target.value)} onBlur={() => blur("city")} disabled={!form.district} className={`rounded-2xl border bg-white px-4 py-3 text-sm outline-none w-full focus:border-[#1D3C42] disabled:opacity-50 ${touched.city && !form.city ? "border-red-400" : "border-[#F4CFC8]"}`}>
                            <option value="">City *</option>
                            {form.district && getCitiesForDistrict(form.state, form.district).map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          {touched.city && !form.city && <p className="mt-1 text-xs text-red-500">Select a city</p>}
                        </div>
                      ) : isChennaiLocal ? (
                        <>
                          <div>
                            <input value="Chennai" disabled className="rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 outline-none w-full text-[#7A6262] cursor-not-allowed" />
                          </div>
                          <div>
                            <input value="Tamil Nadu" disabled className="rounded-2xl border border-[#F4CFC8] bg-[#FFF8E4] px-4 py-3 outline-none w-full text-[#7A6262] cursor-not-allowed" />
                          </div>
                        </>
                      ) : (
                        <div>
                          <input value={form.city} onChange={(e) => update("city", e.target.value)} onBlur={() => blur("city")} className={`rounded-2xl border bg-white px-4 py-3 outline-none w-full focus:border-[#1D3C42] ${touched.city && !form.city ? "border-red-400" : "border-[#F4CFC8]"}`} placeholder="City *" />
                          {touched.city && !form.city && <p className="mt-1 text-xs text-red-500">Enter your city</p>}
                        </div>
                      )}
                      {effectiveMode !== "courier" && !isChennaiLocal && (
                        <div>
                          <input value={form.state} onChange={(e) => update("state", e.target.value)} className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none w-full focus:border-[#1D3C42]" placeholder="State" />
                        </div>
                      )}
                      {effectiveMode === "courier" && (
                        <div className="sm:col-span-3">
                          <input value={form.pincode} onChange={(e) => update("pincode", e.target.value)} onBlur={() => blur("pincode")} className={`rounded-2xl border bg-white px-4 py-3 outline-none w-full focus:border-[#1D3C42] ${touched.pincode && !validatePincode(form.pincode) ? "border-red-400" : "border-[#F4CFC8]"}`} placeholder="Pincode *" />
                          {touched.pincode && !validatePincode(form.pincode) && <p className="mt-1 text-xs text-red-500">Enter a valid 6-digit South Indian pincode</p>}
                        </div>
                      )}
                    </div>
                    {effectiveMode === "local_delivery" && zoneInfo.isChennai && form.pincode.length >= 6 && (
                      <div className={`rounded-2xl p-4 text-sm font-semibold ring-1 ${
                        deliverySupported ? "bg-green-50 text-green-800 ring-green-200" : "bg-amber-50 text-amber-800 ring-amber-200"
                      }`}>
                        {getDeliveryFeeMessage(zoneInfo.zone, zoneInfo.isChennai)}
                      </div>
                    )}
                    <input value={form.landmark} onChange={(e) => update("landmark", e.target.value)} className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" placeholder="Area / Landmark (optional)" />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold">Preferred delivery date</label>
                        <input type="date" value={form.deliveryDate} onChange={(e) => update("deliveryDate", e.target.value)} min={minDate} className="w-full rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" />
                        <p className="mt-1 text-xs text-[#7A6262]">Ready by: {new Date(minDate).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}                         (24 hrs prep)</p>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold">Delivery slot</label>
                        <select value={form.deliverySlot} onChange={(e) => update("deliverySlot", e.target.value)} className="w-full rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 text-sm outline-none focus:border-[#1D3C42]">
                          <option value="">Select slot</option>
                          <option value="9AM-12PM">9 AM - 12 PM</option>
                          <option value="12PM-3PM">12 PM - 3 PM</option>
                          <option value="3PM-6PM">3 PM - 6 PM</option>
                          <option value="6PM-9PM">6 PM - 9 PM</option>
                        </select>
                      </div>
                    </div>

                    {(effectiveMode === "courier") && !showCourierDetails && (
                      <>
                        <label className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-orange-200">
                          <input type="checkbox" checked={sameAsDeliveryAddress} onChange={(e) => setSameAsDeliveryAddress(e.target.checked)} className="mt-1 h-4 w-4 accent-[#1D3C42]" />
                          <span className="text-sm text-[#7A6262]">Courier address is same as delivery address</span>
                        </label>
                        <button onClick={handleGoToCourierDetails} className="w-full rounded-full bg-orange-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-orange-700">
                          Courier Details →
                        </button>
                      </>
                    )}

                    {(effectiveMode === "courier") && showCourierDetails && (
                      <>
                        <button onClick={() => setShowCourierDetails(false)} className="flex items-center gap-2 text-sm font-bold text-orange-700 transition hover:text-orange-800">
                          ← Back to delivery details
                        </button>
                        <CourierFields form={form} update={update} setForm={setForm} touched={touched} blur={blur} />
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#F4CFC8]">
              <h2 className="font-display text-xl font-bold text-[#1D3C42]">Order summary</h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#7A6262]">Items ({cart.length})</span>
                  <span className="font-bold text-[#3A2A2A]">₹{total}</span>
                </div>
                {cart.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#7A6262]">{effectiveMode === "pickup" ? "Pickup" : effectiveMode === "courier" ? "Courier" : "Delivery"}</span>
                    <span className="font-bold text-[#3A2A2A]">
                      {effectiveMode === "pickup" ? "Free" : effectiveMode === "courier" ? `₹${deliveryFee}` : deliverySupported ? `₹${deliveryFee}` : "Manual"}
                    </span>
                  </div>
                )}
                {effectiveMode === "courier" && fragileSurcharge > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#7A6262]">Fragile packaging</span>
                    <span className="font-bold text-[#3A2A2A]">₹{fragileSurcharge}</span>
                  </div>
                )}
                {effectiveMode === "local_delivery" && deliverySupported && (
                  <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-green-800">Local delivery</p>
                      <p className="text-xl font-extrabold text-green-700">₹{deliveryFee}</p>
                    </div>
                    <p className="mt-1 text-xs text-green-600">Chennai — estimated fee</p>
                  </div>
                )}
                {effectiveMode === "local_delivery" && !deliverySupported && (
                  <div className="rounded-2xl bg-amber-50 p-4 text-center ring-1 ring-amber-200">
                    <p className="text-sm font-semibold text-amber-700">This location needs manual confirmation. We will contact you.</p>
                  </div>
                )}
              </div>

              {effectiveMode === "courier" && courierCalc && courierCalc.courier_charge && (
                <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-orange-800">Courier delivery</p>
                      <p className="mt-0.5 text-xs text-orange-600">Package: {courierCalc.courier_weight_slab}</p>
                    </div>
                    <p className="text-xl font-extrabold text-orange-700">₹{courierCalc.courier_charge}</p>
                  </div>
                  {fragileSurcharge > 0 && (
                    <div className="mt-2 flex items-center justify-between border-t border-orange-200 pt-2">
                      <p className="text-xs text-orange-600">Fragile packaging surcharge</p>
                      <p className="text-sm font-bold text-orange-700">+ ₹{fragileSurcharge}</p>
                    </div>
                  )}
                  <p className="mt-2 text-xs text-orange-600/70">{getCourierMessage(courierCalc)}</p>
                  {courierDeliveryEstimate && <p className="mt-1 text-xs font-semibold text-orange-700">{courierDeliveryEstimate}</p>}
                </div>
              )}
              {effectiveMode === "courier" && courierCalc && !courierCalc.courier_charge && (
                <div className="rounded-2xl bg-amber-50 p-4 text-center ring-1 ring-amber-200">
                  <p className="text-sm font-semibold text-amber-700">{courierCalc.message}</p>
                </div>
              )}
              {effectiveMode === "courier" && hasNonBrownieItems && (
                <div className="rounded-2xl bg-red-50 p-4 text-center ring-1 ring-red-200">
                  <p className="text-sm font-semibold text-red-600">Courier is available only for Brownies. Choose pickup or remove non-brownie items.</p>
                </div>
              )}
              <div className="mt-5 border-t border-[#F4CFC8] pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-extrabold text-[#1D3C42]">Total</span>
                  <span className="text-2xl font-extrabold text-[#1D3C42]">₹{grandTotal}</span>
                </div>
                {effectiveMode === "courier" && fragileSurcharge > 0 && (
                  <p className="mt-1 text-right text-xs text-[#7A6262]">incl. courier charge + ₹{fragileSurcharge} fragile packaging</p>
                )}
                {effectiveMode === "courier" && fragileSurcharge === 0 && (
                  <p className="mt-1 text-right text-xs text-[#7A6262]">incl. courier charge</p>
                )}
              </div>

              {!orderWindowOpen && (
                <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-center ring-1 ring-amber-200">
                  <p className="text-sm font-semibold text-amber-700">{getClosureReason() || "Orders are currently closed"}{getFormattedClosureEnd() ? ` — resumes ${getFormattedClosureEnd()}` : ""}</p>
                </div>
              )}

              <div className="mt-6 space-y-3">
                {!showCheckout ? (
                  <button onClick={() => setShowCheckout(true)} disabled={cart.length === 0}
                    className="w-full rounded-full bg-[#1D3C42] px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#163136] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50">
                    {cart.length === 0 ? "Cart empty" : "Proceed to checkout"}
                  </button>
                ) : effectiveMode ? (
                  <button onClick={handlePlaceOrder} disabled={submitting || cart.length === 0 || !canSubmit}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1D3C42] px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#163136] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50">
                    {submitting ? <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Processing...</>
                      : paid ? <><CheckCircle size={18} /> Saving...</>
                      : <><CreditCard size={18} /> Pay ₹{grandTotal}</>}
                  </button>
                ) : null}

                <div className="flex items-center justify-center gap-2 text-xs text-[#7A6262]">
                  <Lock size={12} /> Dummy payment — no real charge
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {confirmRemoveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setConfirmRemoveId(null)}>
          <div className="w-full max-w-sm rounded-[2rem] bg-white p-6 text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-50"><Trash2 size={24} className="text-red-500" /></div>
            <h3 className="mt-4 font-display text-xl font-bold text-[#3A2A2A]">Remove item?</h3>
            <p className="mt-2 text-sm text-[#7A6262]">This item will be removed from your cart.</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setConfirmRemoveId(null)} className="flex-1 rounded-full border border-[#F4CFC8] py-3 text-sm font-bold text-[#3A2A2A] transition hover:bg-[#FFF8E4]">Cancel</button>
              <button onClick={() => { removeFromCart(confirmRemoveId); setConfirmRemoveId(null); }} className="flex-1 rounded-full bg-red-500 py-3 text-sm font-bold text-white transition hover:bg-red-600">Remove</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function TruckIcon({ size, ...props }: { size?: number; className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width={size ?? 24} height={size ?? 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /><path d="M17 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /><path d="M5 15H3V5a1 1 0 0 1 1-1h11v11" /><path d="M19 15h-1V9l-3-3H7v3" /><path d="M10 17h4" /></svg> }

function CourierFields({ form, update, setForm, touched, blur }: { form: OrderFormData; update: (field: keyof OrderFormData, value: string) => void; setForm: (cb: (prev: OrderFormData) => OrderFormData) => void; touched: Record<string, boolean>; blur: (field: string) => void }) {
  return (
    <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
      <p className="text-sm font-semibold text-orange-800"><AlertTriangle size={16} className="mr-1 inline" /> Courier is available only for Brownies. Orders require at least 24 hours. Delicate products may need special handling.</p>
      <div className="mt-5 grid gap-4 border-t border-orange-200 pt-5">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-orange-700">Receiver details</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <input value={form.receiverName} onChange={(e) => update("receiverName", e.target.value)} onBlur={() => blur("receiverName")} className={`rounded-2xl border bg-white px-4 py-3 outline-none w-full focus:border-[#1D3C42] ${touched.receiverName && !form.receiverName ? "border-red-400" : "border-orange-200"}`} placeholder="Receiver name *" />
            {touched.receiverName && !form.receiverName && <p className="mt-1 text-xs text-red-500">Enter receiver name</p>}
          </div>
          <div>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#7A6262]">+91</span>
              <input value={form.receiverPhone} onChange={(e) => update("receiverPhone", e.target.value)} onBlur={() => blur("receiverPhone")} className={`rounded-2xl border bg-white px-4 py-3 outline-none w-full pl-14 focus:border-[#1D3C42] ${touched.receiverPhone && !validatePhone(form.receiverPhone) ? "border-red-400" : "border-orange-200"}`} placeholder="Receiver phone *" />
            </div>
            {touched.receiverPhone && !validatePhone(form.receiverPhone) && <p className="mt-1 text-xs text-red-500">Enter a valid 10-digit mobile number</p>}
          </div>
        </div>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#7A6262]">+91</span>
          <input value={form.alternatePhone} onChange={(e) => update("alternatePhone", e.target.value)} className="rounded-2xl border border-orange-200 bg-white px-4 py-3 outline-none w-full pl-14 focus:border-[#1D3C42]" placeholder="Alternate phone (optional)" />
        </div>
        <div>
          <textarea value={form.courierAddress} onChange={(e) => update("courierAddress", e.target.value)} onBlur={() => blur("courierAddress")} className={`min-h-20 rounded-2xl border bg-white px-4 py-3 outline-none w-full focus:border-[#1D3C42] ${touched.courierAddress && !form.courierAddress ? "border-red-400" : "border-orange-200"}`} placeholder="Full courier address *" />
          {touched.courierAddress && !form.courierAddress && <p className="mt-1 text-xs text-red-500">Enter courier address</p>}
        </div>
        <textarea value={form.courierNotes} onChange={(e) => update("courierNotes", e.target.value)} className="min-h-16 rounded-2xl border border-orange-200 bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" placeholder="Courier notes (optional)" />
        <label className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-orange-200">
          <input type="checkbox" checked={form.confirmCourierRisk} onChange={(e) => setForm((prev) => ({ ...prev, confirmCourierRisk: e.target.checked }))} className="mt-1 h-4 w-4 accent-[#1D3C42]" />
          <span className="text-sm text-[#7A6262]">I understand delicate products may need special handling. Bakery is not responsible for courier transit damage. <strong className="text-orange-800">*</strong></span>
        </label>
      </div>
    </div>
  );
}
