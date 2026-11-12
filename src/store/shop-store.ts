"use client";

import { useSyncExternalStore } from "react";
import { getProductById } from "@/data/products";
import { getDeliveryFee } from "@/data/site";
import type { CartItem, CustomerInfo, Order } from "@/lib/types";

type ShopState = {
  favorites: string[];
  cart: CartItem[];
  /** Item from "Order Now" — checked out on its own without touching the bag */
  direct: CartItem | null;
  orders: Order[];
};

const STORAGE_KEY = "metal-world:v1";
const EMPTY: ShopState = { favorites: [], cart: [], direct: null, orders: [] };

let state: ShopState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function readStorage(): ShopState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  state = readStorage();
}

function setState(update: (s: ShopState) => ShopState) {
  ensureLoaded();
  state = update(state);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage may be full or blocked; the in-memory state still works.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    state = readStorage();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  ensureLoaded();
  return state;
}

function getServerSnapshot() {
  return EMPTY;
}

export function useShop() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** False during SSR and hydration, true once the browser state is in use. */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function itemKey(productId: string, color: string, size: string) {
  return `${productId}__${color}__${size}`;
}

export function lineTotal(items: CartItem[]) {
  return items.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((n, i) => n + i.qty, 0);
}

export const shop = {
  toggleFavorite(productId: string) {
    let added = false;
    setState((s) => {
      added = !s.favorites.includes(productId);
      return {
        ...s,
        favorites: added
          ? [productId, ...s.favorites]
          : s.favorites.filter((id) => id !== productId),
      };
    });
    return added;
  },

  addToCart(productId: string, color: string, size: string, qty = 1) {
    const key = itemKey(productId, color, size);
    setState((s) => {
      const existing = s.cart.find((i) => i.key === key);
      const cart = existing
        ? s.cart.map((i) => (i.key === key ? { ...i, qty: Math.min(i.qty + qty, 10) } : i))
        : [...s.cart, { key, productId, color, size, qty }];
      return { ...s, cart };
    });
  },

  setQty(key: string, qty: number) {
    setState((s) => ({
      ...s,
      cart: s.cart.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(qty, 10)) } : i)),
    }));
  },

  removeFromCart(key: string) {
    setState((s) => ({ ...s, cart: s.cart.filter((i) => i.key !== key) }));
  },

  setDirect(productId: string, color: string, size: string, qty = 1) {
    setState((s) => ({
      ...s,
      direct: { key: itemKey(productId, color, size), productId, color, size, qty },
    }));
  },

  setDirectQty(qty: number) {
    setState((s) =>
      s.direct ? { ...s, direct: { ...s.direct, qty: Math.max(1, Math.min(qty, 10)) } } : s,
    );
  },

  /** Saves the order locally and clears whichever item list it came from. */
  placeOrder(customer: CustomerInfo, mode: "cart" | "direct"): Order | null {
    const source = mode === "direct" ? (state.direct ? [state.direct] : []) : state.cart;
    const items = source.flatMap((item) => {
      const product = getProductById(item.productId);
      return product
        ? [{ ...item, name: product.name, band: product.band, price: product.price }]
        : [];
    });
    if (items.length === 0) return null;

    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const deliveryFee = getDeliveryFee(customer.district, subtotal);
    const now = new Date();
    const order: Order = {
      id: `MW-${now.getFullYear().toString().slice(2)}${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: now.toISOString(),
      customer,
      items,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      paymentMethod: "cod",
      status: "pending",
    };

    setState((s) => ({
      ...s,
      orders: [order, ...s.orders],
      cart: mode === "cart" ? [] : s.cart,
      direct: mode === "direct" ? null : s.direct,
    }));
    return order;
  },
};
