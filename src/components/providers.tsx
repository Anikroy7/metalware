"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Check } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { CartDrawer } from "./cart-drawer";

type Toast = { id: number; message: string };

type UIContextValue = {
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  notify: (message: string) => void;
};

const UIContext = createContext<UIContextValue | null>(null);

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside <Providers>");
  return ctx;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const notify = useCallback((message: string) => {
    const id = ++nextId.current;
    setToasts((t) => [...t.slice(-2), { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const value = useMemo(
    () => ({
      cartOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      notify,
    }),
    [cartOpen, notify],
  );

  return (
    <MotionConfig reducedMotion="user">
      <UIContext.Provider value={value}>
        {children}
        <CartDrawer />
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex flex-col items-center gap-2 px-4">
          <AnimatePresence>
            {toasts.map((t) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="pointer-events-auto flex items-center gap-3 rounded-full bg-ink py-2.5 pl-2.5 pr-5 text-sm text-white shadow-xl shadow-black/20"
                role="status"
              >
                <span className="grid size-6 place-items-center rounded-full bg-amp">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                {t.message}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </UIContext.Provider>
    </MotionConfig>
  );
}
