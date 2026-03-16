"use client";

import {useEffect, useState} from "react";

type GeolocationState = {
  position: { lat: number; lng: number } | null;
  error: string | null;
  isSupported: boolean;
};

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    error: null,
    isSupported: typeof navigator !== "undefined" && "geolocation" in navigator,
  });

  useEffect(() => {
    if (!state.isSupported) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setState((prev) => ({
          ...prev,
          position: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          error: null,
        }));
      },
      (err) => {
        setState((prev) => ({
          ...prev,
          error: err.message,
        }));
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 15000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [state.isSupported]);

  return state;
}
