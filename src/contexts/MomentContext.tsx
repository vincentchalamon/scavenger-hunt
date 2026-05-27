"use client";

import React, {createContext, ReactNode, useCallback, useContext, useMemo, useState} from "react";
import {createPortal} from "react-dom";
import {useTranslation} from "@/i18n";
import {Icon} from "@/components/UI";
import {CompletionCard} from "@/components/CompletionCard/CompletionCard";

type MomentState = { word: string; keywords: string[]; complete: boolean } | null;

type MomentContextType = {
  showKeywordFound: (word: string, keywords: string[]) => void;
};

export const MomentContext = createContext<MomentContextType>({
  showKeywordFound: () => {},
});

export const useMoment = () => useContext(MomentContext);

export function MomentProvider({children, phrase, defaultKeywords}: {
  children: ReactNode;
  phrase: string;
  defaultKeywords: string[];
}) {
  const [moment, setMoment] = useState<MomentState>(null);

  const showKeywordFound = useCallback((word: string, keywords: string[]) => {
    const uniqueWords = [...new Set(phrase.split(" "))];
    const total = Math.max(1, uniqueWords.length - defaultKeywords.length);
    const found = Math.min(Math.max(0, keywords.length - defaultKeywords.length), total);
    setMoment({word, keywords, complete: found >= total});
  }, [phrase, defaultKeywords]);

  const value = useMemo(() => ({showKeywordFound}), [showKeywordFound]);

  const close = () => setMoment(null);
  const completeAndGoToMap = () => {
    setMoment(null);
    // Close the énigme modal and switch to the map tab
    window.dispatchEvent(new Event("hunt:dismiss-modals"));
    window.dispatchEvent(new Event("hunt:go-to-map"));
  };

  return (
    <MomentContext.Provider value={value}>
      {children}
      {moment && typeof document !== "undefined" && createPortal(
        moment.complete ? (
          <div
            data-testid="phrase-complete-overlay"
            onClick={close}
            style={{
              position: "fixed", inset: 0, zIndex: 2000,
              background: "rgba(17,18,16,0.55)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "0 24px",
            }}
          >
            <div onClick={(e) => e.stopPropagation()} style={{width: "100%", maxWidth: 340}}>
              <CompletionCard phrase={phrase} defaultKeywords={defaultKeywords} onGoToMap={completeAndGoToMap} />
            </div>
          </div>
        ) : (
          <KeywordFoundOverlay
            word={moment.word}
            keywords={moment.keywords}
            phrase={phrase}
            defaultKeywords={defaultKeywords}
            onClose={close}
          />
        ),
        document.body
      )}
    </MomentContext.Provider>
  );
}

const KeywordFoundOverlay: React.FC<{
  word: string;
  keywords: string[];
  phrase: string;
  defaultKeywords: string[];
  onClose: () => void;
}> = ({word, keywords, phrase, defaultKeywords, onClose}) => {
  const {t} = useTranslation();

  const words = phrase.split(" ");
  const uniqueWords = [...new Set(words)];
  const total = Math.max(1, uniqueWords.length - defaultKeywords.length);
  const found = Math.min(Math.max(0, keywords.length - defaultKeywords.length), total);
  const pct = Math.round((found / total) * 100);

  return (
    <div
      data-testid="keyword-found"
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "rgba(17,18,16,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "0 24px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--color-surface)", borderRadius: 22,
          padding: "30px 22px 22px", width: "100%", maxWidth: 320,
          boxShadow: "var(--shadow-xl)",
          border: "1px solid color-mix(in srgb, var(--color-honey) 40%, transparent)",
          position: "relative",
        }}
      >
        <div style={{
          position: "absolute", top: -26, left: "50%", transform: "translateX(-50%)",
          width: 56, height: 56, borderRadius: 28, background: "var(--color-honey)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 10px 24px rgba(213,140,42,0.5)",
          border: "4px solid var(--color-surface)",
        }}>
          <Icon.Check size={26} color="#fff" strokeWidth={3} />
        </div>

        <div style={{marginTop: 14, textAlign: "center"}}>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-honey-deep)",
            letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginBottom: 6,
          }}>
            {t('momentWordFound')}
          </div>
          <div style={{
            fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 700,
            color: "var(--color-ink)", letterSpacing: -1.5, lineHeight: 1, margin: "4px 0 10px",
          }}>
            &laquo;&nbsp;{word}&nbsp;&raquo;
          </div>
        </div>

        {/* Mini phrase board — le nouveau mot est mis en évidence */}
        <div style={{
          marginTop: 8, padding: "10px 12px", background: "var(--color-bg)", borderRadius: 12,
          display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center",
        }}>
          {words.map((w, i) => {
            if (keywords.includes(w)) {
              const isNew = w === word;
              return (
                <span key={i} style={{
                  fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 700,
                  color: isNew ? "#fff" : "var(--color-honey-deep)",
                  background: isNew ? "var(--color-honey)" : "var(--color-honey-soft)",
                  padding: "2px 8px", borderRadius: 5,
                  animation: isNew ? "cx-word-pop 0.45s ease-out, cx-word-halo 0.9s ease-out 0.2s" : undefined,
                }}>{w}</span>
              );
            }
            return (
              <span key={i} style={{
                fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-ink-dim)",
                border: "1px dashed var(--color-ink-dim)", padding: "2px 10px", borderRadius: 5,
              }}>{"•".repeat(3)}</span>
            );
          })}
        </div>

        <div style={{
          marginTop: 14, paddingTop: 8, borderTop: "1px solid var(--color-hairline)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-ink-mute)", letterSpacing: 0.5,
        }}>
          <span>{found} / {total} {t('wordsFoundLabel')}</span>
          <span style={{color: "var(--color-honey-deep)", fontWeight: 700}}>{pct} %</span>
        </div>

        <button
          data-testid="moment-continue"
          onClick={onClose}
          style={{
            marginTop: 18, width: "100%", padding: "13px 16px",
            background: "var(--color-ink)", color: "#fff", border: "none", borderRadius: 12,
            fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}
        >
          {t('momentContinue')}
        </button>
      </div>
    </div>
  );
};
