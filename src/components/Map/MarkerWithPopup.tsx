"use client";

import React from "react";
import {Marker} from "react-leaflet";
import L from "leaflet";
import {Place} from "@/types/Place";

const HONEY = "#D58C2A";
const HONEY_DEEP = "#A86A1B";
const PIN_FONT = "'Inter Tight', sans-serif";

const createPinIcon = (number: number, isLatest: boolean) => {
  if (isLatest) {
    const html = `
      <div style="position:relative;width:44px;height:52px;">
        <div style="position:absolute;left:4px;top:12px;width:36px;height:36px;border-radius:50%;background:${HONEY};opacity:0.35;animation:cx-pulse 1.8s ease-out infinite;"></div>
        <svg width="44" height="52" viewBox="0 0 44 52" style="position:relative;">
          <path d="M22 4 C10 4 0 14 0 26 C0 36 22 52 22 52 C22 52 44 36 44 26 C44 14 34 4 22 4 Z"
                fill="${HONEY}" stroke="${HONEY_DEEP}" stroke-width="2"
                filter="drop-shadow(0 4px 6px rgba(213,140,42,0.45))"/>
          <circle cx="22" cy="24" r="13" fill="white"/>
          <text x="22" y="29" text-anchor="middle" font-family="${PIN_FONT}" font-size="15" font-weight="800" fill="${HONEY_DEEP}">${number}</text>
        </svg>
      </div>`;
    return L.divIcon({html, className: "custom-leaflet-marker", iconSize: [44, 52], iconAnchor: [22, 52]});
  }
  const html = `
    <div style="filter:drop-shadow(0 3px 6px rgba(213,140,42,0.4));">
      <svg width="36" height="44" viewBox="0 0 36 44">
        <path d="M18 0 C8 0 0 8 0 18 C0 28 18 44 18 44 C18 44 36 28 36 18 C36 8 28 0 18 0 Z"
              fill="${HONEY}" stroke="${HONEY_DEEP}" stroke-width="1.5"/>
        <circle cx="18" cy="18" r="11" fill="white"/>
        <text x="18" y="22" text-anchor="middle" font-family="${PIN_FONT}" font-size="13" font-weight="800" fill="${HONEY_DEEP}">${number}</text>
      </svg>
    </div>`;
  return L.divIcon({html, className: "custom-leaflet-marker", iconSize: [36, 44], iconAnchor: [18, 44]});
};

export const MarkerWithPopup = React.memo((props: {
  place: Place;
  number: number;
  isLatest: boolean;
  onMarkerClick: (place: Place) => void;
}) => {
  const {place, number, isLatest, onMarkerClick} = props;

  return (
    <Marker
      position={[place.coordinates.lat, place.coordinates.lng]}
      icon={createPinIcon(number, isLatest)}
      eventHandlers={{
        click: () => onMarkerClick(place),
      }}
    />
  );
});

MarkerWithPopup.displayName = 'MarkerWithPopup';
