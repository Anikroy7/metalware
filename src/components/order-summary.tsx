import { formatDate, formatPrice } from "@/lib/format";
import type { Order } from "@/lib/types";

const STATUS_LABEL: Record<Order["status"], string> = {
  pending: "Awaiting confirmation call",
  confirmed: "Confirmed",
  shipped: "Out for delivery",
  delivered: "Delivered",
};

export function OrderSummary({ order }: { order: Order }) {
  const c = order.customer;
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-paper">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-white px-5 py-4 sm:px-7">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted">Order</p>
          <p className="font-display text-2xl tracking-wide">{order.id}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted">{formatDate(order.createdAt)}</p>
          <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-ink">
            <span className="size-1.5 rounded-full bg-gold" />
            {STATUS_LABEL[order.status]}
          </span>
        </div>
      </div>

      <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-7">
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">Deliver to</h3>
          <p className="font-semibold">{c.fullName}</p>
          <p className="text-sm text-muted">
            {c.phone}
            {c.altPhone && ` · ${c.altPhone}`}
          </p>
          <p className="mt-1 text-sm text-muted">
            {c.address}, {c.area}, {c.district}, {c.division}
            {c.landmark && <span className="block">Landmark: {c.landmark}</span>}
          </p>
          {c.notes && <p className="mt-1 text-sm italic text-muted">“{c.notes}”</p>}
        </div>
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">Items</h3>
          <ul className="space-y-1.5 text-sm">
            {order.items.map((i) => (
              <li key={i.key} className="flex justify-between gap-3">
                <span>
                  {i.name} <span className="text-muted">× {i.qty}</span>
                  <span className="block text-xs text-muted">
                    {i.color} · {i.size}
                  </span>
                </span>
                <span className="shrink-0">{formatPrice(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-3 space-y-1 border-t border-line pt-3 text-sm">
            <div className="flex justify-between text-muted">
              <dt>Subtotal</dt>
              <dd>{formatPrice(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between text-muted">
              <dt>Delivery</dt>
              <dd>{order.deliveryFee === 0 ? "Free" : formatPrice(order.deliveryFee)}</dd>
            </div>
            <div className="flex justify-between font-bold">
              <dt>Cash on Delivery</dt>
              <dd>{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
