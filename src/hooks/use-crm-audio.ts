"use client";

import { useCallback } from "react";

const SOUNDS = {
  SUCCESS: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
  WON: "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3",
  CLICK: "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3",
  NOTIFY: "https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3",
};

export function useCrmAudio() {
  const playSound = useCallback((type: keyof typeof SOUNDS) => {
    try {
      const audio = new Audio(SOUNDS[type]);
      audio.volume = 0.4;
      audio.play().catch(e => {
          // Browser usually blocks auto-play without user interaction
          // This is fine as most actions here are user-initiated
      });
    } catch (e) {
      console.warn("Audio playback failed", e);
    }
  }, []);

  return { playSound };
}
