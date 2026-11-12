export function formatPrice(amount: number) {
  return `৳${amount.toLocaleString("en-US")}`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function pad2(n: number) {
  return n.toString().padStart(2, "0");
}
