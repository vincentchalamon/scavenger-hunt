"use client";

import React from "react";
import {Icon} from "@/components/UI";
import {useTranslation} from "@/i18n";

export const CompletionCard: React.FC<{
  phrase: string;
  defaultKeywords: string[];
  onGoToMap?: () => void;
}> = ({phrase, defaultKeywords, onGoToMap}) => {
  const {t} = useTranslation();
  const words = phrase.split(" ");

  return (
    <div
      data-testid="phrase-complete"
      style={{
        background: "var(--color-surface)",
        border: "1px solid color-mix(in srgb, var(--color-honey) 55%, transparent)",
        borderRadius: 18,
        padding: "26px 20px 20px",
        textAlign: "center",
        boxShadow: "0 10px 26px rgba(213,140,42,0.12)",
      }}
    >
      <div style={{
        width: 68, height: 68, margin: "0 auto 14px", borderRadius: 34,
        background: "radial-gradient(circle at 30% 30%, var(--color-honey) 0%, var(--color-honey-deep) 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 12px 28px rgba(213,140,42,0.4)",
        border: "4px solid var(--color-surface)",
      }}>
        <Icon.Sparkle size={28} color="#fff" strokeWidth={2.4} />
      </div>

      <div style={{
        fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-honey-deep)",
        letterSpacing: 2, textTransform: "uppercase", fontWeight: 700,
      }}>
        {t('phraseReconstructedKicker')}
      </div>
      <h2 style={{
        fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700,
        letterSpacing: -0.5, lineHeight: 1.15, margin: "6px 0 8px", color: "var(--color-ink)",
      }}>
        {t('phraseReconstructedTitle')}
      </h2>
      <p style={{fontFamily: "var(--font-body)", fontSize: 15, color: "var(--color-ink-soft)", lineHeight: 1.5, margin: "0 0 16px"}}>
        {t('phraseReconstructedBody')}
      </p>

      {/* Phrase révélée */}
      <div style={{
        background: "var(--color-bg)", borderRadius: 12, padding: "14px 16px", marginBottom: 16,
        fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, lineHeight: 1.45,
        color: "var(--color-ink)", letterSpacing: -0.2,
      }}>
        {words.map((w, i) => (
          <React.Fragment key={i}>
            <span style={{color: defaultKeywords.includes(w) ? "var(--color-ink)" : "var(--color-honey-deep)"}}>{w}</span>
            {i < words.length - 1 ? " " : ""}
          </React.Fragment>
        ))}
      </div>

      {onGoToMap && (
        <button
          onClick={onGoToMap}
          data-testid="back-to-map"
          style={{
            width: "100%", padding: "13px 16px",
            background: "var(--color-forest)", color: "#fff",
            border: "none", borderRadius: 12,
            fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer",
          }}
        >
          <Icon.Map size={15} color="#fff" strokeWidth={2} />
          {t('backToMap')}
        </button>
      )}
    </div>
  );
};
