"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Banknote, Check, ChevronDown, Loader2, ShieldCheck, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { divisions } from "@/data/locations";
import { getProductById } from "@/data/products";
import { delivery, getDeliveryFee } from "@/data/site";
import { formatPrice } from "@/lib/format";
import type { CustomerInfo } from "@/lib/types";
import { ProductArt } from "@/components/product-art";
import { QuantityStepper } from "@/components/quantity-stepper";
import { lineTotal, shop, useHydrated, useShop } from "@/store/shop-store";

const EMPTY_FORM: CustomerInfo = {
  fullName: "",
  phone: "",
  altPhone: "",
  email: "",
  division: "",
  district: "",
  area: "",
  address: "",
  landmark: "",
  notes: "",
};

type Errors = Partial<Record<keyof CustomerInfo, string>>;

/** Accepts 01XXXXXXXXX, +8801XXXXXXXXX or 8801XXXXXXXXX, with or without spaces/dashes. */
function normalizePhone(raw: string) {
  const digits = raw.replace(/[\s-]/g, "").replace(/^\+?88/, "");
  return /^01[3-9]\d{8}$/.test(digits) ? digits : null;
}

function validate(f: CustomerInfo): Errors {
  const e: Errors = {};
  if (f.fullName.trim().length < 3) e.fullName = "Please enter your full name";
  if (!normalizePhone(f.phone)) e.phone = "Enter a valid 11-digit mobile number (e.g. 01712345678)";
  if (f.altPhone.trim() && !normalizePhone(f.altPhone)) e.altPhone = "Enter a valid mobile number or leave it empty";
  if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "Enter a valid email or leave it empty";
  if (!f.division) e.division = "Select your division";
  if (!f.district) e.district = "Select your district";
  if (f.area.trim().length < 2) e.area = "Enter your area / thana";
  if (f.address.trim().length < 8) e.address = "Enter your full address (house, road, block)";
  return e;
}

function Field({
  label,
  required,
  error,
  hint,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium">
        {label} {required ? <span className="text-amp">*</span> : <span className="text-muted">(optional)</span>}
      </span>
      {children}
      <AnimatePresence initial={false}>
        {error ? (
          <motion.span
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="block overflow-hidden pt-1.5 text-xs font-medium text-amp"
          >
            {error}
          </motion.span>
        ) : (
          hint && <span className="block pt-1.5 text-xs text-muted">{hint}</span>
        )}
      </AnimatePresence>
    </label>
  );
}

const inputClass = (hasError?: string) =>
  `w-full rounded-xl border bg-white px-4 py-3 text-sm transition placeholder:text-muted/60 focus:outline-none focus:ring-4 ${
    hasError ? "border-amp focus:ring-amp/15" : "border-line focus:border-ink focus:ring-ink/5"
  }`;

function StepTitle({ n, title }: { n: number; title: string }) {
  return (
    <h2 className="mb-5 flex items-center gap-3 text-lg font-bold">
      <span className="grid size-8 place-items-center rounded-full bg-ink font-display text-sm text-white">
        {String(n).padStart(2, "0")}
      </span>
      {title}
    </h2>
  );
}

export function CheckoutForm() {
  const router = useRouter();
  const mode = useSearchParams().get("mode") === "direct" ? "direct" : "cart";
  const hydrated = useHydrated();
  const { cart, direct, orders } = useShop();
  const [form, setForm] = useState<CustomerInfo>(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const items = mode === "direct" ? (direct ? [direct] : []) : cart;
  const subtotal = lineTotal(items);
  const deliveryFee = form.district ? getDeliveryFee(form.district, subtotal) : null;
  const total = subtotal + (deliveryFee ?? 0);
  const lastCustomer = orders[0]?.customer;

  const set = <K extends keyof CustomerInfo>(key: K, value: CustomerInfo[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      document.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setSubmitting(true);
    const customer: CustomerInfo = {
      ...form,
      fullName: form.fullName.trim(),
      phone: normalizePhone(form.phone)!,
      altPhone: form.altPhone.trim() ? normalizePhone(form.altPhone)! : "",
    };
    // Short pause so the "placing order" state is visible; there's no backend to wait on.
    setTimeout(() => {
      const order = shop.placeOrder(customer, mode);
      if (order) router.push(`/order-success?id=${order.id}`);
      else setSubmitting(false);
    }, 900);
  };

  if (!hydrated || (submitting && items.length === 0)) {
    return <div className="h-96 animate-pulse rounded-3xl bg-stage" />;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-line py-20 text-center">
        <ShoppingBag className="mx-auto size-10 text-muted" />
        <p className="mt-4 font-display text-3xl uppercase">Nothing to check out</p>
        <p className="mt-2 text-sm text-muted">Your bag is empty. Find something loud to wear first.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-ink px-7 py-3 text-sm font-semibold text-white transition hover:bg-amp"
        >
          Browse the Shop
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
      <div className="space-y-6">
        {lastCustomer && !form.fullName && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => {
              setForm({ ...lastCustomer, notes: "" });
              setErrors({});
            }}
            className="flex w-full items-center justify-between rounded-2xl border border-line bg-paper px-5 py-4 text-left text-sm transition hover:border-ink"
          >
            <span>
              Ordered before? <strong>Use details from your last order</strong>
              <span className="block text-xs text-muted">
                {lastCustomer.fullName} · {lastCustomer.phone} · {lastCustomer.district}
              </span>
            </span>
            <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">Fill</span>
          </motion.button>
        )}

        <section className="rounded-3xl border border-line bg-paper p-5 sm:p-7">
          <StepTitle n={1} title="Contact Information" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" required error={errors.fullName} className="sm:col-span-2">
              <input
                name="fullName"
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                placeholder="e.g. Rahim Ahmed"
                autoComplete="name"
                className={inputClass(errors.fullName)}
              />
            </Field>
            <Field label="Phone Number" required error={errors.phone} hint="We'll call this number to confirm your order">
              <input
                name="phone"
                type="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="01XXXXXXXXX"
                autoComplete="tel"
                className={inputClass(errors.phone)}
              />
            </Field>
            <Field label="Alternative Phone" error={errors.altPhone}>
              <input
                name="altPhone"
                type="tel"
                inputMode="tel"
                value={form.altPhone}
                onChange={(e) => set("altPhone", e.target.value)}
                placeholder="01XXXXXXXXX"
                className={inputClass(errors.altPhone)}
              />
            </Field>
            <Field label="Email" error={errors.email} className="sm:col-span-2">
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className={inputClass(errors.email)}
              />
            </Field>
          </div>
        </section>

        <section className="rounded-3xl border border-line bg-paper p-5 sm:p-7">
          <StepTitle n={2} title="Delivery Address" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Division" required error={errors.division}>
              <div className="relative">
                <select
                  name="division"
                  value={form.division}
                  onChange={(e) => {
                    set("division", e.target.value);
                    set("district", "");
                  }}
                  className={`${inputClass(errors.division)} appearance-none pr-10`}
                >
                  <option value="">Select division</option>
                  {Object.keys(divisions).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
              </div>
            </Field>
            <Field label="District" required error={errors.district}>
              <div className="relative">
                <select
                  name="district"
                  value={form.district}
                  onChange={(e) => set("district", e.target.value)}
                  disabled={!form.division}
                  className={`${inputClass(errors.district)} appearance-none pr-10 disabled:cursor-not-allowed disabled:bg-stage/50`}
                >
                  <option value="">{form.division ? "Select district" : "Select division first"}</option>
                  {(divisions[form.division] ?? []).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
              </div>
            </Field>
            <Field label="Area / Thana" required error={errors.area} className="sm:col-span-2">
              <input
                name="area"
                value={form.area}
                onChange={(e) => set("area", e.target.value)}
                placeholder="e.g. Dhanmondi, Mirpur 10, Agrabad"
                className={inputClass(errors.area)}
              />
            </Field>
            <Field label="Full Address" required error={errors.address} className="sm:col-span-2">
              <textarea
                name="address"
                rows={3}
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="House no, road no, block / sector, flat"
                autoComplete="street-address"
                className={`${inputClass(errors.address)} resize-none`}
              />
            </Field>
            <Field label="Nearby Landmark" className="sm:col-span-2">
              <input
                name="landmark"
                value={form.landmark}
                onChange={(e) => set("landmark", e.target.value)}
                placeholder="e.g. Opposite City Bank, beside the mosque"
                className={inputClass()}
              />
            </Field>
            <Field label="Order Notes" className="sm:col-span-2">
              <textarea
                name="notes"
                rows={2}
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Anything we should know? e.g. call before coming"
                className={`${inputClass()} resize-none`}
              />
            </Field>
          </div>
        </section>

        <section className="rounded-3xl border border-line bg-paper p-5 sm:p-7">
          <StepTitle n={3} title="Payment Method" />
          <div className="flex items-start gap-4 rounded-2xl border-2 border-ink bg-white p-4">
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ink">
              <Check className="size-3 text-white" strokeWidth={3} />
            </span>
            <div className="flex-1">
              <p className="flex items-center gap-2 font-semibold">
                <Banknote className="size-5 text-ok" /> Cash on Delivery
              </p>
              <p className="mt-1 text-sm text-muted">
                Pay in cash when you receive your order. No advance payment, no card needed.
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted">Cash on Delivery is the only payment method available.</p>
        </section>
      </div>

      {/* Summary */}
      <aside className="lg:sticky lg:top-32 lg:self-start">
        <div className="rounded-3xl bg-ink p-5 text-white sm:p-7">
          <h2 className="font-display text-2xl uppercase tracking-wide">
            {mode === "direct" ? "Quick Order" : "Order Summary"}
          </h2>
          <ul className="mt-5 divide-y divide-white/10">
            {items.map((item) => {
              const product = getProductById(item.productId);
              if (!product) return null;
              const color = product.colors.find((c) => c.name === item.color) ?? product.colors[0];
              return (
                <li key={item.key} className="flex gap-3 py-4 first:pt-0">
                  <div className="size-20 shrink-0 rounded-xl bg-stage p-1">
                    <ProductArt garment={product.garment} graphic={product.graphic} color={color} />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="truncate font-semibold">{product.name}</p>
                    <p className="text-xs text-white/55">
                      {item.color} · {item.size}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="rounded-full bg-white text-ink">
                        <QuantityStepper
                          size="sm"
                          value={item.qty}
                          onChange={(q) => (mode === "direct" ? shop.setDirectQty(q) : shop.setQty(item.key, q))}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">{formatPrice(product.price * item.qty)}</span>
                        {mode === "cart" && (
                          <button
                            type="button"
                            onClick={() => shop.removeFromCart(item.key)}
                            className="grid size-8 place-items-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
                            aria-label={`Remove ${product.name}`}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <dl className="mt-2 space-y-2.5 border-t border-white/10 pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-white/60">Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/60">
                Delivery{" "}
                {form.district && (
                  <span className="text-white/40">({form.district === "Dhaka" ? "inside" : "outside"} Dhaka)</span>
                )}
              </dt>
              <dd>
                {deliveryFee === null ? (
                  <span className="text-white/40">Select district</span>
                ) : deliveryFee === 0 ? (
                  <span className="font-semibold text-gold">Free</span>
                ) : (
                  formatPrice(deliveryFee)
                )}
              </dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-white/10 pt-4">
              <dt className="font-semibold">Total (pay on delivery)</dt>
              <dd className="font-display text-3xl tracking-wide">
                <motion.span key={total} initial={{ opacity: 0.4, y: -6 }} animate={{ opacity: 1, y: 0 }} className="inline-block">
                  {formatPrice(total)}
                </motion.span>
              </dd>
            </div>
          </dl>

          {subtotal < delivery.freeOver && (
            <p className="mt-3 text-xs text-white/50">
              Add {formatPrice(delivery.freeOver - subtotal)} more for free delivery.
            </p>
          )}

          <motion.button
            type="submit"
            disabled={submitting}
            whileTap={{ scale: 0.98 }}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-amp py-4 font-semibold text-white transition hover:bg-amp-dark disabled:opacity-80"
          >
            {submitting ? (
              <>
                <Loader2 className="size-5 animate-spin" /> Placing your order…
              </>
            ) : (
              <>Place Order — {formatPrice(total)}</>
            )}
          </motion.button>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-white/50">
            <ShieldCheck className="size-4" /> We&apos;ll call you to confirm before dispatch
          </p>
        </div>
      </aside>
    </form>
  );
}
