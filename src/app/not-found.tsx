"use client";

import Link from "next/link";
import {useEffect, useState} from "react";
import {useTranslation} from "@/i18n";
import {CompassLoader, Icon} from "@/components/UI";

export default function NotFound() {
  const { t } = useTranslation();
  const [locked, setLocked] = useState<boolean | undefined>(undefined);
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);
  const [loaded, setLoaded] = useState<boolean>(false);

  if (typeof navigator !== "undefined") {
    useEffect(() => setIsMobile(/iphone|ipad|ipod|android|blackberry|windows phone/g.test(navigator.userAgent.toLowerCase())));
  }

  if (typeof window !== "undefined") {
    useEffect(() => {
      const handler = () => setLocked(screen.orientation.type.toString().startsWith("landscape"));
      handler();
      screen.orientation.addEventListener('change', handler, true);

      return () => screen.orientation.removeEventListener('change', handler, true);
    }, [screen.orientation]);

    useEffect(() => setLoaded(typeof locked !== "undefined" && typeof isMobile !== "undefined"), [locked, isMobile]);
  }

  const screenStyle: React.CSSProperties = {
    minHeight: "100dvh", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", textAlign: "center",
    padding: "0 36px", background: "var(--color-bg)", color: "var(--color-ink)",
    fontFamily: "var(--font-body)",
  };

  if (!loaded) {
    return <CompassLoader fullScreen text={t('loading')} />;
  }

  if (!isMobile) {
    return (
      <div style={screenStyle}>
        <h2 style={{fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, margin: "0 0 8px"}}>{t('mobileOnly')}</h2>
        <p style={{color: "var(--color-ink-soft)", margin: 0}}>{t('mobileOnlyHelper')}</p>
      </div>
    );
  }

  if (locked) {
    return (
      <div style={screenStyle}>
        <h2 style={{fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, margin: "0 0 8px"}}>{t('landscapeNotSupported')}</h2>
        <p style={{color: "var(--color-ink-soft)", margin: 0}}>{t('landscapeHelper')}</p>
      </div>
    );
  }

  return (
    <div style={screenStyle}>
      <div style={{
        fontFamily: "var(--font-display)", fontSize: 88, fontWeight: 700,
        letterSpacing: -3, lineHeight: 0.9, margin: "0 0 4px",
      }}>
        <span style={{color: "var(--color-honey)"}}>4</span>
        <span style={{
          display: "inline-block", transform: "rotate(8deg)",
          background: "var(--color-honey-soft)", color: "var(--color-honey-deep)",
          border: "2px solid var(--color-honey)", borderRadius: 16,
          padding: "0 12px", margin: "0 4px",
        }}>?</span>
        <span style={{color: "var(--color-ink)"}}>4</span>
      </div>
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-honey-deep)",
        letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginTop: 6,
      }}>
        {t('notFoundHint')}
      </div>
      <h2 style={{fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, letterSpacing: -0.6, margin: "16px 0 8px"}}>
        {t('notFoundColdTrail')}
      </h2>
      <p style={{fontSize: 14.5, lineHeight: 1.55, color: "var(--color-ink-soft)", margin: "0 0 22px"}}>
        {t('notFoundMessage')}
      </p>
      <Link
        href="/"
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "13px 20px", background: "var(--color-ink)", color: "#fff",
          border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: "none",
        }}
      >
        <Icon.ArrowLeft size={15} color="#fff" />
        {t('notFoundBackButton')}
      </Link>
    </div>
  );
}
