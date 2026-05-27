"use client";

import React, {useRef, useState} from "react";
import {Place} from "@/types/Place";
import {RenderButton, RenderItem} from "@/components/Items/ItemFactory";
import {ModalItem} from "@/components/Items/ModalItem";
import {Icon} from "@/components/UI";
import {useTranslation} from "@/i18n";

export const PlaceSheet: React.FC<{
  place: Place;
  stepNumber: number;
  onClose: () => void;
}> = ({place, stepNumber, onClose}) => {
  const {t} = useTranslation();
  const sheetRef = useRef<HTMLDivElement>(null);
  // height in px while dragged/expanded; null = auto (default, content-based)
  const [heightPx, setHeightPx] = useState<number | null>(null);
  const [dragY, setDragY] = useState(0);
  const [closing, setClosing] = useState(false);

  const draggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);
  const deltaRef = useRef(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const maxExpanded = () => (typeof window !== "undefined" ? window.innerHeight * 0.92 : 600);

  const triggerClose = () => {
    if (closing) return;
    setClosing(true);
    // Fallback in case the transitionend doesn't fire
    closeTimer.current = setTimeout(onClose, 320);
  };

  const onSheetTransitionEnd = (e: React.TransitionEvent) => {
    if (closing && e.propertyName === "transform") {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      onClose();
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    draggingRef.current = true;
    startYRef.current = e.touches[0].clientY;
    startHeightRef.current = sheetRef.current?.getBoundingClientRect().height ?? 0;
    deltaRef.current = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!draggingRef.current) return;
    const delta = e.touches[0].clientY - startYRef.current;
    deltaRef.current = delta;
    if (delta <= 0) {
      // Drag up → grow height, anchored at the bottom (no gap)
      setHeightPx(Math.min(startHeightRef.current - delta, maxExpanded()));
      setDragY(0);
    } else {
      // Drag down → slide the sheet toward closing
      setDragY(delta);
    }
  };
  const onTouchEnd = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const d = deltaRef.current;
    setDragY(0);
    if (d > 110) {
      triggerClose();
    } else if (d < -40) {
      setHeightPx(maxExpanded());
    } else if (d > 40) {
      setHeightPx(null);
    } else {
      // small move: snap to nearest
      setHeightPx((prev) => (prev != null && prev > maxExpanded() * 0.65 ? maxExpanded() : null));
    }
  };

  return (
    <div
      ref={sheetRef}
      data-testid="place-sheet"
      onTransitionEnd={onSheetTransitionEnd}
      style={{
        position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 700,
        background: "var(--color-surface)",
        borderTopLeftRadius: 22, borderTopRightRadius: 22,
        boxShadow: "0 -10px 30px rgba(0,0,0,0.18)",
        height: heightPx != null ? `${heightPx}px` : "auto",
        maxHeight: heightPx != null ? "92vh" : "62vh",
        display: "flex", flexDirection: "column",
        transform: closing ? "translateY(100%)" : (dragY ? `translateY(${dragY}px)` : undefined),
        transition: draggingRef.current ? "none" : "transform 0.28s ease, height 0.25s ease, max-height 0.25s ease",
        animation: closing ? undefined : "cx-sheet-up 0.28s ease",
        touchAction: "none",
      }}
    >
      {/* Header — toujours visible, sert de poignée de drag */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{flexShrink: 0, padding: "0 20px", cursor: "grab", touchAction: "none"}}
      >
        <div style={{padding: "10px 0 8px", display: "flex", justifyContent: "center"}}>
          <div style={{width: 40, height: 4, borderRadius: 2, background: "var(--color-hairline)"}} />
        </div>

        <div style={{display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8}}>
          <div style={{display: "flex", alignItems: "center", gap: 10}}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: "var(--color-honey)", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 800,
              boxShadow: "var(--shadow-honey)",
            }}>{stepNumber}</div>
            <div>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-honey-deep)",
                letterSpacing: 1, textTransform: "uppercase", fontWeight: 700,
              }}>
                {t('stepLabel')} {String(stepNumber).padStart(2, "0")}
              </div>
              <div style={{fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-ink-mute)", letterSpacing: 0.3}}>
                {place.coordinates.lat.toFixed(4)}&deg;N &middot; {place.coordinates.lng.toFixed(4)}&deg;E
              </div>
            </div>
          </div>
          <button
            onClick={triggerClose}
            aria-label={t('close')}
            style={{
              width: 30, height: 30, borderRadius: 10,
              background: "var(--color-bg)", border: "1px solid var(--color-hairline)",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0,
            }}
          >
            <Icon.X size={15} color="var(--color-ink)" strokeWidth={2} />
          </button>
        </div>

        <h2 style={{
          fontFamily: "var(--font-display)", fontSize: 23, fontWeight: 700, letterSpacing: -0.7,
          margin: "0 0 10px", lineHeight: 1.15, color: "var(--color-ink)",
        }}>
          {place.name}
        </h2>
      </div>

      {/* Contenu défilant */}
      <div style={{flex: 1, overflowY: "auto", touchAction: "pan-y", padding: "0 20px 20px"}}>
        <div
          style={{fontSize: 14.5, lineHeight: 1.5, color: "var(--color-ink-soft)", marginBottom: 14}}
          dangerouslySetInnerHTML={{__html: place.description}}
        />

        {place.link && (
          <div style={{display: "flex", justifyContent: "center", marginBottom: 14}}>
            <a
              href={place.link}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "10px 16px",
                background: "var(--color-forest-soft)",
                border: "1px solid color-mix(in srgb, var(--color-forest) 25%, transparent)",
                borderRadius: 12,
                fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
                color: "var(--color-forest-dark)", textDecoration: "none",
              }}
            >
              <Icon.ExternalLink size={14} color="var(--color-forest-dark)" strokeWidth={1.8} />
              {t('placeMoreInfo')}
            </a>
          </div>
        )}

        {place.item?.type && (
          <ModalItem place={place.name} step={stepNumber} button={
            <button
              data-testid="place-item-trigger"
              style={{
                display: "block", width: "100%", padding: 0, border: "none",
                background: "transparent", cursor: "pointer", borderRadius: 14, overflow: "hidden",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <RenderButton {...place.item} />
            </button>
          }>
            <div className="d-flex flex-column justify-content-center align-items-center mw-100 mh-100">
              <RenderItem {...place.item} />
            </div>
          </ModalItem>
        )}
      </div>
    </div>
  );
};
