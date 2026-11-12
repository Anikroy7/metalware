"use client";

import { AnimatePresence, animate, motion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SRC = "/jonasblakewood-bass-bass-music-557626.mp3";
const STORAGE_KEY = "metal-world:music";
const VOLUME = 0.18;
const UNLOCK_EVENTS = ["pointerdown", "keydown", "touchstart"] as const;

/**
 * Background music at low volume. Browsers block audible autoplay until the visitor
 * interacts with the page, so if the first attempt is blocked we start on the first
 * click / tap / key press. Stopping it is remembered for future visits.
 */
export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeRef = useRef<{ stop: () => void } | null>(null);
  const removeUnlockRef = useRef<() => void>(() => {});
  const [playing, setPlaying] = useState(false);

  const fadeTo = (target: number, onDone?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;
    fadeRef.current?.stop();
    fadeRef.current = animate(audio.volume, target, {
      duration: 1.2,
      ease: "easeInOut",
      onUpdate: (v) => (audio.volume = v),
      onComplete: onDone,
    });
  };

  const start = () => {
    const audio = audioRef.current;
    if (!audio) return Promise.resolve(false);
    audio.volume = 0;
    return audio.play().then(
      () => {
        fadeTo(VOLUME);
        return true;
      },
      () => false,
    );
  };

  useEffect(() => {
    let off = false;
    try {
      off = localStorage.getItem(STORAGE_KEY) === "off";
    } catch {}
    if (off) return;

    const unlock = (e: Event) => {
      // Let the player's own button handle its click.
      if ((e.target as Element | null)?.closest?.("[data-music-toggle]")) return;
      removeUnlockRef.current();
      start();
    };
    removeUnlockRef.current = () =>
      UNLOCK_EVENTS.forEach((name) => window.removeEventListener(name, unlock));

    start().then((ok) => {
      if (!ok) UNLOCK_EVENTS.forEach((name) => window.addEventListener(name, unlock));
    });

    return () => {
      removeUnlockRef.current();
      fadeRef.current?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    removeUnlockRef.current();
    if (audio.paused) {
      start();
      try {
        localStorage.setItem(STORAGE_KEY, "on");
      } catch {}
    } else {
      fadeTo(0, () => audio.pause());
      setPlaying(false);
      try {
        localStorage.setItem(STORAGE_KEY, "off");
      } catch {}
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={SRC}
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <motion.button
        type="button"
        data-music-toggle
        onClick={toggle}
        whileTap={{ scale: 0.94 }}
        aria-pressed={playing}
        aria-label={playing ? "Pause background music" : "Play background music"}
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2.5 rounded-full border border-line bg-paper/90 py-1.5 pl-1.5 pr-4 text-xs font-semibold text-ink shadow-lg shadow-black/10 backdrop-blur transition-colors hover:bg-paper"
      >
        <span className="grid size-8 place-items-center rounded-full bg-ink text-white">
          {playing ? <Pause className="size-3.5 fill-current" /> : <Play className="ml-0.5 size-3.5 fill-current" />}
        </span>
        <span className="flex h-4 items-end gap-[3px]" aria-hidden>
          {[0.5, 1, 0.65, 0.85].map((h, i) => (
            <motion.span
              key={i}
              className="block w-[3px] rounded-full bg-amp"
              style={{ height: "100%", originY: 1 }}
              animate={playing ? { scaleY: [0.3, h, 0.45, 1, 0.3] } : { scaleY: 0.25 }}
              transition={
                playing ? { duration: 1.1 + i * 0.15, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }
              }
            />
          ))}
        </span>
        <span className="hidden sm:inline">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={String(playing)}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="block"
            >
              {playing ? "Now playing" : "Play music"}
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.button>
    </>
  );
}
