"use client";

import React from "react";
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

  return (
    <div
      data-testid="place-sheet"
      style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        background: "var(--color-surface)",
        borderTopLeftRadius: 22, borderTopRightRadius: 22,
        boxShadow: "0 -10px 30px rgba(0,0,0,0.18)",
        zIndex: 700, maxHeight: "70%",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Drag handle */}
      <div style={{padding: "10px 0 4px", display: "flex", justifyContent: "center", flexShrink: 0}}>
        <div style={{width: 40, height: 4, borderRadius: 2, background: "var(--color-hairline)"}} />
      </div>

      <div style={{overflowY: "auto", padding: "8px 20px 20px"}}>
        {/* Step badge + close */}
        <div style={{display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10}}>
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
            onClick={onClose}
            aria-label={t('close')}
            style={{
              width: 30, height: 30, borderRadius: 10,
              background: "var(--color-bg)", border: "1px solid var(--color-hairline)",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}
          >
            <Icon.X size={15} color="var(--color-ink)" strokeWidth={2} />
          </button>
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "var(--font-display)", fontSize: 23, fontWeight: 700, letterSpacing: -0.7,
          margin: "0 0 8px", lineHeight: 1.15, color: "var(--color-ink)",
        }}>
          {place.name}
        </h2>

        {/* Description */}
        <div
          style={{fontSize: 14.5, lineHeight: 1.5, color: "var(--color-ink-soft)", marginBottom: 12}}
          dangerouslySetInnerHTML={{__html: place.description}}
        />

        {/* More info */}
        {place.link && (
          <a
            href={place.link}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 14px", background: "var(--color-bg)",
              border: "1px solid var(--color-hairline)", borderRadius: 12,
              fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
              color: "var(--color-ink)", textDecoration: "none", marginBottom: 14,
            }}
          >
            <Icon.ExternalLink size={14} color="var(--color-ink)" strokeWidth={1.8} />
            {t('placeMoreInfo')}
          </a>
        )}

        {/* Énigme */}
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
