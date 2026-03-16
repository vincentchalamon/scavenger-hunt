"use client";

import {useEffect, useRef} from "react";

export function useWakeLock() {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!("wakeLock" in navigator)) return;

    const requestWakeLock = async () => {
      try {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
      } catch {
        // Wake lock request failed (e.g., low battery, not supported)
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        requestWakeLock();
      }
    };

    requestWakeLock();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      wakeLockRef.current?.release().catch(() => {});
      wakeLockRef.current = null;
    };
  }, []);
}
