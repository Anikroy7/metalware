"use client";

import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { isTheme, THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

export type { Theme };

const listeners = new Set<() => void>();

function getSnapshot(): Theme {
  const t = document.documentElement.dataset.theme;
  return isTheme(t) ? t : "stage";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useTheme() {
  return useSyncExternalStore(subscribe, getSnapshot, () => "stage" as Theme);
}

export function setTheme(theme: Theme) {
  const apply = () => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Theme still applies for this visit.
    }
    flushSync(() => listeners.forEach((l) => l()));
  };

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced && "startViewTransition" in document) {
    document.startViewTransition(apply);
  } else {
    apply();
  }
}
