"use client";

import {Nav, Tab} from "react-bootstrap";
import {Manuscript} from "@/components/Manuscript/Manuscript";
import React, {useContext, useEffect, useState} from "react";
import {Hunt as HuntType} from "@/types/Hunt";
import {PhraseContext, PhraseProvider} from "@/contexts/PhraseContext";
import {ToastProvider} from "@/contexts/ToastContext";
import {MomentProvider} from "@/contexts/MomentContext";
import {Toast} from "@/components/Toast/Toast";
import dynamic from "next/dynamic";
import {CompassLoader, Icon} from "@/components/UI";
import {useTranslation} from "@/i18n";
import {useWakeLock} from "@/hooks/useWakeLock";
import {useOnboarding} from "@/hooks/useOnboarding";
import Link from "next/link";
import styles from "./Hunt.module.css";

const MapLoading = () => {
  const {t} = useTranslation();
  return <CompassLoader fullScreen text={t('loading')} />;
};

// Dynamic import of Map component to prevent SSR issues with Leaflet
const Map = dynamic(
  () => import("@/components/Map/Map").then((mod) => mod.Map),
  {
    ssr: false,
    loading: () => <MapLoading />
  }
);

type HuntProps = {
  hunt: HuntType;
}

const VALID_TABS = ['manuscript', 'map'] as const;
type TabKey = typeof VALID_TABS[number];

function tabFromHash(): TabKey | null {
  if (typeof window === 'undefined') return null;
  const match = window.location.hash.match(/^#tab=(.+)$/);
  const tab = match?.[1];
  return VALID_TABS.includes(tab as TabKey) ? (tab as TabKey) : null;
}

// Persistent header with title, word progress and help.
const HuntHeader: React.FC<{hunt: HuntType; onHelp: () => void}> = ({hunt, onHelp}) => {
  const {t} = useTranslation();
  const {keywords} = useContext(PhraseContext);

  const defaultCount = hunt.defaultKeywords?.length || 0;
  const uniqueWords = [...new Set(hunt.phrase.split(' '))];
  const total = Math.max(1, uniqueWords.length - defaultCount);
  const step = Math.min(Math.max(0, keywords.length - defaultCount), total);

  return (
    <div className={styles.header}>
      <div className={styles.headerRow}>
        <Link href="/" className={styles.iconButton} aria-label="Retour">
          <Icon.ArrowLeft size={16} color="var(--color-ink)" strokeWidth={2} />
        </Link>
        <div className={styles.headerCenter}>
          <div className={styles.headerTitle} data-testid="hunt-title">{hunt.name}</div>
          <div className={styles.headerMeta}>
            {step}/{total} {t('wordsFoundLabel')}
          </div>
        </div>
        <button
          className={styles.iconButton}
          onClick={onHelp}
          title={t('helpButtonLabel')}
          aria-label={t('helpButtonLabel')}
        >
          <Icon.Help size={16} color="var(--color-ink-soft)" strokeWidth={2} />
        </button>
      </div>
      <div className={styles.progressSegments}>
        {Array.from({length: total}).map((_, i) => (
          <div
            key={i}
            className={`${styles.progressSegment} ${i < step ? styles.progressSegmentFilled : ''} ${i === step ? styles.progressSegmentCurrent : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

// Internal component to access PhraseContext
const HuntContent: React.FC<HuntProps> = ({hunt}) => {
  const { t } = useTranslation();
  const tabContentRef = React.useRef<HTMLDivElement>(null);
  const [activeKey, setActiveKey] = useState<string>("manuscript");

  useWakeLock();

  const {replay: replayOnboarding} = useOnboarding({activeKey, setActiveKey});

  // Set initial hash so the hunt entry is identifiable in history
  useEffect(() => {
    window.history.replaceState({tab: 'manuscript'}, "", '#tab=manuscript');
  }, []);

  // Handle browser back button: restore tab from hash
  useEffect(() => {
    const handlePopState = () => {
      const tab = tabFromHash();
      if (tab) {
        setActiveKey(tab);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <>
      <Toast/>
      <HuntHeader hunt={hunt} onHelp={replayOnboarding} />
      <div className="px-0 d-flex" style={{
        paddingTop: "var(--navbar-height)",
        height: "100dvh",
        flexDirection: "column",
        background: "var(--color-bg)",
      }}>
        <Tab.Container
          activeKey={activeKey}
          onSelect={(key) => {
            if (!key) return;
            setActiveKey(key);
            // Use hash-based navigation: Next.js router ignores hash-only changes
            window.history.pushState({tab: key}, "", `#tab=${key}`);
            tabContentRef.current?.scrollTo(0, 0);
            if (key === 'map') {
              setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
            }
          }}
        >
          <Tab.Content ref={tabContentRef} style={{flex: 1, overflow: "auto", padding: 0, margin: 0}}>
            <Tab.Pane eventKey="manuscript" className="h-100">
              <Manuscript manuscript={hunt.manuscript} phrase={hunt.phrase} onGoToMap={() => setActiveKey('map')}/>
            </Tab.Pane>
            <Tab.Pane eventKey="map" className="h-100" style={{padding: 0, margin: 0}}>
              <Map places={hunt.places} debug={hunt.debug} coordinates={hunt.coordinates} huntSlug={hunt.slug}/>
            </Tab.Pane>
          </Tab.Content>
          <Nav justify fill className={styles.bottomNav}>
            <Nav.Item>
              <Nav.Link eventKey="manuscript" data-testid="manuscript-button" className={styles.navItem}>
                <Icon.Scroll size={20} color="currentColor" strokeWidth={activeKey === 'manuscript' ? 2 : 1.7} />
                <span className={styles.navLabel}>{t('navManuscript')}</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="map" data-testid="map-button" className={styles.navItem}>
                <Icon.Map size={20} color="currentColor" strokeWidth={activeKey === 'map' ? 2 : 1.7} />
                <span className={styles.navLabel}>{t('navMap')}</span>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Tab.Container>
      </div>
    </>
  );
};

export const Hunt: React.FC<HuntProps> = ({hunt}) => {
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

  if (typeof document !== "undefined") {
    useEffect(() => {
      document.addEventListener('contextmenu', event => {
        event.preventDefault();
      });
    }, [document]);
  }

  if (!loaded) {
    return <CompassLoader fullScreen text={t('loading')} />;
  }

  if (!isMobile) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <div className={`${styles.errorIconBox} ${styles.errorIconBoxHoney}`}>
            <Icon.Phone size={34} color="var(--color-honey-deep)" strokeWidth={1.8} />
          </div>
          <h2 className={styles.errorTitle}>{t('mobileOnly')}</h2>
          <p className={styles.errorText}>{t('mobileOnlyHelper')}</p>
        </div>
      </div>
    );
  }

  if (locked) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <div className={`${styles.errorIconBox} ${styles.errorIconBoxForest}`}>
            <Icon.Rotate size={32} color="var(--color-forest)" strokeWidth={1.8} />
          </div>
          <h2 className={styles.errorTitle}>{t('landscapeNotSupported')}</h2>
          <p className={styles.errorText}>{t('landscapeHelper')}</p>
        </div>
      </div>
    );
  }

  return (
    <PhraseProvider defaultKeywords={hunt.defaultKeywords} huntSlug={hunt.slug} phrase={hunt.phrase}>
      <ToastProvider>
        <MomentProvider phrase={hunt.phrase} defaultKeywords={hunt.defaultKeywords || []}>
          <HuntContent hunt={hunt} />
        </MomentProvider>
      </ToastProvider>
    </PhraseProvider>
  );
}
