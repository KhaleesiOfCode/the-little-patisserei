"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, FileText, Lock, CreditCard, CheckCircle, ArrowLeft, AlertTriangle, Package, ShoppingBag } from "lucide-react";
import Navbar from "../../components/Navbar";
import { useCart } from "../../components/CartContext";
import { createOrder } from "../../lib/supabase/orders";
import type { OrderFormData, DeliveryMode } from "../../types/menu";
import { getMinDateTime } from "../../types/menu";
import { getDeliveryZone, getDeliveryFeeMessage } from "../../lib/delivery-zones";
import { calculateCourierCharge, TAMIL_NADU_DISTRICTS, getCourierMessage } from "../../lib/delivery/courierZones";
import {
  sanitizeName, sanitizeCity, sanitizePhone,
  sanitizeAddress, sanitizePincode, sanitizeEmail,
  validatePhone, validatePincode,
} from "../../lib/validation";

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQty, removeFromCart, clearCart, total } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paid, setPaid] = useState(false);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

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

  const effectiveMode: DeliveryMode | null = mode === "local_delivery" && !zoneInfo.isChennai ? "courier" : mode;

  const courierCalc = useMemo(() => {
    if (effectiveMode !== "courier") return null
    const district = form.district || form.city
    return calculateCourierCharge(
      cart.map((item) => ({
        quantityLabel: item.selectedQuantity,
        courierWeightGrams: null,
        courierFragile: false,
      })),
      cart.map((item) => item.qty),
      district,
    )
  }, [effectiveMode, form.district, form.city, cart])

  const hasNonCourierItems = effectiveMode === "courier" && cart.some((item) => item.courier_supported === false)

  const courierCharge = courierCalc?.courier_charge ?? 0
  const fragileSurcharge = courierCalc?.fragile_surcharge ?? 0

  const deliveryFee = effectiveMode === "pickup" ? 0 : effectiveMode === "courier" ? courierCharge : (zoneInfo.zone.fee ?? 0);
  const deliveryZone = effectiveMode === "local_delivery" ? zoneInfo.zone.key : effectiveMode === "courier" ? (courierCalc?.courier_zone ?? null) : null;
  const deliverySupported = effectiveMode !== "local_delivery" || zoneInfo.isSupported;

  const minDate = useMemo(() => {
    const d = getMinDateTime(effectiveMode || "local_delivery");
    return d.toISOString().split("T")[0];
  }, [effectiveMode]);

  const deliveryCharge = deliveryFee;
  const grandTotal = total + deliveryCharge + fragileSurcharge;

  useEffect(() => {
    if (!effectiveMode) return;
    if (effectiveMode === "pickup" && !form.pickupDate) {
      setForm((prev) => ({ ...prev, pickupDate: minDate }));
    }
    if (effectiveMode !== "pickup" && !form.deliveryDate) {
      setForm((prev) => ({ ...prev, deliveryDate: minDate }));
    }
  }, [effectiveMode, minDate]);

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
      const isCourier =
        next.deliveryMode === "local_delivery" &&
        next.city.trim().toLowerCase() !== "chennai" &&
        !next.pincode.trim().startsWith("600");
      if (isCourier) {
        if (field === "name" && !next.receiverName) next.receiverName = sanitized;
        if (field === "phone" && !next.receiverPhone) next.receiverPhone = sanitized;
        if (["addressLine1", "city", "district", "state", "pincode"].includes(field)) {
          next.courierAddress = [next.addressLine1, next.district, next.state, next.pincode]
            .filter(Boolean)
            .join(", ");
        }
      }
      return next;
    });

  const startCheckout = (m: DeliveryMode) => {
    setMode(m);
    setForm((prev) => ({ ...prev, deliveryMode: m }));
    setShowCheckout(true);
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
      { ...form, deliveryMode: effectiveMode },
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

  const canSubmit = (() => {
    if (!effectiveMode) return false;
    if (!form.name || !validatePhone(form.phone)) return false;
    if (effectiveMode === "pickup") return form.pickupDate !== "";
    if (effectiveMode === "courier") {
      if (hasNonCourierItems) return false
      if (courierCalc?.courier_fee_status === "manual_confirmation" || !courierCalc) return false
      return form.addressLine1 && form.city && form.district && form.pincode &&
        validatePincode(form.pincode) &&
        form.receiverName && validatePhone(form.receiverPhone) &&
        form.courierAddress && form.confirmCourierRisk;
    }
    if (effectiveMode === "local_delivery") {
      if (!form.addressLine1 || !form.city || !form.pincode) return false;
      if (!validatePincode(form.pincode)) return false;
      if (!deliverySupported) return false;
      return form.deliveryDate !== "";
    }
    return false;
  })();

  return (
    <main className="min-h-screen bg-[#FFF8E4] text-[#3A2A2A]">
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr] lg:items-start">
          <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-[#F4CFC8] md:p-8">
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
                    <div key={item.id} className="flex gap-4 py-5 first:pt-0 last:pb-0">
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
                  <span>Add a note <span className="font-normal text-[#7A6262]/60">(optional)</span></span>
                </div>
                <textarea
                  value={form.instructions}
                  onChange={(e) => update("instructions", e.target.value)}
                  placeholder="Any special instructions..."
                  className="mt-3 w-full rounded-xl border border-[#F4CFC8] bg-white px-4 py-3 text-sm text-[#3A2A2A] outline-none placeholder:text-[#7A6262] focus:border-[#1D3C42]"
                />
              </div>
            )}

            {showCheckout && !mode && cart.length > 0 && (
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
                    <p className="mt-1 text-sm text-[#7A6262]">Chennai or courier</p>
                  </button>
                </div>
              </div>
            )}

            {showCheckout && mode && cart.length > 0 && (
              <div className="mt-8 rounded-[2rem] bg-[#FFF8E4] p-6 ring-1 ring-[#F4CFC8]">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl font-bold">
                    {effectiveMode === "pickup" ? "Pickup details" : "Delivery details"}
                  </h2>
                  <button onClick={() => { setMode(null); setShowCheckout(false); }} className="text-xs font-bold text-[#D4AF37] underline">Change</button>
                </div>

                {effectiveMode === "pickup" && (
                  <div className="mt-6 grid gap-4">
                    <div className="rounded-2xl bg-green-50 p-4 text-sm font-semibold text-green-800 ring-1 ring-green-200">
                      Pickup from our bakery. Minimum 24 hours prep time.
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input value={form.name} onChange={(e) => update("name", e.target.value)} className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" placeholder="Full name *" />
                      <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" placeholder="Mobile number *" />
                    </div>
                    <input value={form.email} onChange={(e) => update("email", e.target.value)} className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" placeholder="Email (optional)" />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold">Pickup date *</label>
                        <input type="date" value={form.pickupDate} onChange={(e) => update("pickupDate", e.target.value)} min={minDate} className="w-full rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" />
                        <p className="mt-1 text-xs text-[#7A6262]">Earliest: {new Date(minDate).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} (24 hrs)</p>
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
                      !zoneInfo.isChennai || effectiveMode === "courier"
                        ? "bg-orange-50 text-orange-800 ring-orange-200"
                        : "bg-green-50 text-green-800 ring-green-200"
                    }`}>
                      {!zoneInfo.isChennai || effectiveMode === "courier" ? (
                        <><AlertTriangle size={16} className="mr-1 inline" /> Courier delivery — minimum 48 hours.</>
                      ) : "Chennai local delivery — minimum 24 hours."}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input value={form.name} onChange={(e) => update("name", e.target.value)} className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" placeholder="Full name *" />
                      <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" placeholder="Mobile number *" />
                    </div>
                    <input value={form.email} onChange={(e) => update("email", e.target.value)} className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" placeholder="Email (optional)" />
                    <input value={form.addressLine1} onChange={(e) => update("addressLine1", e.target.value)} className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" placeholder="Address line 1 *" />
                    <input value={form.addressLine2} onChange={(e) => update("addressLine2", e.target.value)} className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" placeholder="Address line 2 (optional)" />
                    <div className="grid gap-4 sm:grid-cols-3">
                      <input value={form.city} onChange={(e) => update("city", e.target.value)} className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" placeholder="City *" />
                      {(effectiveMode === "courier" || !zoneInfo.isChennai) && (
                        <select value={form.district} onChange={(e) => update("district", e.target.value)} className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 text-sm outline-none focus:border-[#1D3C42]">
                          <option value="">District *</option>
                          {TAMIL_NADU_DISTRICTS.filter((d) => d !== "Chennai").map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      )}
                      <input value={form.state} onChange={(e) => update("state", e.target.value)} className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" placeholder="State" />
                      <input value={form.pincode} onChange={(e) => update("pincode", e.target.value)} className="rounded-2xl border border-[#F4CFC8] bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" placeholder="Pincode *" />
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
                        <p className="mt-1 text-xs text-[#7A6262]">Earliest: {new Date(minDate).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} ({effectiveMode === "courier" || !zoneInfo.isChennai ? "48" : "24"} hrs)</p>
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

                    {(effectiveMode === "courier" || !zoneInfo.isChennai) && (
                      <CourierFields form={form} update={update} setForm={setForm} />
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
                  <p className="mt-2 text-xs text-orange-600/70">{getCourierMessage(courierCalc, true)}</p>
                </div>
              )}
              {effectiveMode === "courier" && courierCalc && !courierCalc.courier_charge && (
                <div className="rounded-2xl bg-amber-50 p-4 text-center ring-1 ring-amber-200">
                  <p className="text-sm font-semibold text-amber-700">{courierCalc.message}</p>
                </div>
              )}
              {effectiveMode === "courier" && hasNonCourierItems && (
                <div className="rounded-2xl bg-red-50 p-4 text-center ring-1 ring-red-200">
                  <p className="text-sm font-semibold text-red-600">Some items are not suitable for courier. Choose pickup or remove them.</p>
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

function TruckIcon(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /><path d="M17 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /><path d="M5 15H3V5a1 1 0 0 1 1-1h11v11" /><path d="M19 15h-1V9l-3-3H7v3" /><path d="M10 17h4" /></svg> }

function CourierFields({ form, update, setForm }: { form: OrderFormData; update: (field: keyof OrderFormData, value: string) => void; setForm: (cb: (prev: OrderFormData) => OrderFormData) => void }) {
  return (
    <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
      <p className="text-sm font-semibold text-orange-800"><AlertTriangle size={16} className="mr-1 inline" /> Courier orders require at least 48 hours. Delicate products may need special handling.</p>
      <div className="mt-5 grid gap-4 border-t border-orange-200 pt-5">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-orange-700">Receiver details</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <input value={form.receiverName} onChange={(e) => update("receiverName", e.target.value)} className="rounded-2xl border border-orange-200 bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" placeholder="Receiver name *" />
          <input value={form.receiverPhone} onChange={(e) => update("receiverPhone", e.target.value)} className="rounded-2xl border border-orange-200 bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" placeholder="Receiver phone *" />
        </div>
        <input value={form.alternatePhone} onChange={(e) => update("alternatePhone", e.target.value)} className="rounded-2xl border border-orange-200 bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" placeholder="Alternate phone (optional)" />
        <textarea value={form.courierAddress} onChange={(e) => update("courierAddress", e.target.value)} className="min-h-20 rounded-2xl border border-orange-200 bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" placeholder="Full courier address *" />
        <textarea value={form.courierNotes} onChange={(e) => update("courierNotes", e.target.value)} className="min-h-16 rounded-2xl border border-orange-200 bg-white px-4 py-3 outline-none focus:border-[#1D3C42]" placeholder="Courier notes (optional)" />
        <label className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-orange-200">
          <input type="checkbox" checked={form.confirmCourierRisk} onChange={(e) => setForm((prev: any) => ({ ...prev, confirmCourierRisk: e.target.checked }))} className="mt-1 h-4 w-4 accent-[#1D3C42]" />
          <span className="text-sm text-[#7A6262]">I understand delicate products may need special handling. Bakery is not responsible for courier transit damage. <strong className="text-orange-800">*</strong></span>
        </label>
      </div>
    </div>
  );
}
