"use client";

import {Container, Nav, Navbar, Row, Tab} from "react-bootstrap";
import {Manuscript} from "@/components/Manuscript/Manuscript";
import {Rules} from "@/components/Rules";
import React, {useEffect, useRef, useState} from "react";
import {Hunt as HuntType} from "@/types/Hunt";
import {PhraseProvider, PhraseContext} from "@/contexts/PhraseContext";
import {ToastProvider} from "@/contexts/ToastContext";
import {Toast} from "@/components/Toast/Toast";
import dynamic from "next/dynamic";
import {CompassLoader} from "@/components/UI";
import {useTranslation} from "@/i18n";
import {useWakeLock} from "@/hooks/useWakeLock";
import Link from "next/link";
import styles from "./Hunt.module.css";

// Dynamic import of Map component to prevent SSR issues with Leaflet
const Map = dynamic(
  () => import("@/components/Map/Map").then((mod) => mod.Map),
  {
    ssr: false,
    loading: () => <CompassLoader fullScreen text="Loading map..." />
  }
);

type HuntProps = {
  hunt: HuntType;
}

const VALID_TABS = ['rules', 'manuscript', 'map'] as const;
type TabKey = typeof VALID_TABS[number];

function tabFromHash(): TabKey | null {
  if (typeof window === 'undefined') return null;
  const match = window.location.hash.match(/^#tab=(.+)$/);
  const tab = match?.[1];
  return VALID_TABS.includes(tab as TabKey) ? (tab as TabKey) : null;
}

// Internal component to access PhraseContext
const HuntContent: React.FC<HuntProps> = ({hunt}) => {
  const { t } = useTranslation();
  const { keywords } = React.useContext(PhraseContext);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [prevKeywordsCount, setPrevKeywordsCount] = useState(keywords.length);
  const tabContentRef = useRef<HTMLDivElement>(null);
  const [activeKey, setActiveKey] = useState<string>("rules");

  useWakeLock();

  // Set initial hash so the hunt entry is identifiable in history
  useEffect(() => {
    window.history.replaceState({tab: 'rules'}, "", '#tab=rules');
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

  // Detect when a new keyword is added
  useEffect(() => {
    if (keywords.length > prevKeywordsCount) {
      setShouldAnimate(true);
    }
    setPrevKeywordsCount(keywords.length);
  }, [keywords.length, prevKeywordsCount]);

  const handleManuscriptClick = () => {
    setShouldAnimate(false);
  };

  return (
    <>
      <Toast/>
      <Navbar fixed="top" className={styles.treasureNavbar}>
        <Container className={styles.navbarContainer}>
          <Link href="/" className={styles.backButton}>
            <span className={styles.backIcon}>🏛️</span>
          </Link>
          <Navbar.Brand className={styles.navbarTitle} data-testid="hunt-title">
            {hunt.name}
          </Navbar.Brand>
        </Container>
      </Navbar>
      <div className="px-0 d-flex" style={{
        paddingTop: "65px",
        height: "100dvh",
        flexDirection: "column",
        background: "var(--gradient-parchment)",
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
            <Tab.Pane eventKey="rules" className="h-100">
              <Rules/>
            </Tab.Pane>
            <Tab.Pane eventKey="manuscript" className="h-100">
              <Manuscript manuscript={hunt.manuscript} phrase={hunt.phrase}/>
            </Tab.Pane>
            <Tab.Pane eventKey="map" className="h-100" style={{padding: 0, margin: 0}}>
              <Map places={hunt.places} debug={hunt.debug} coordinates={hunt.coordinates} huntSlug={hunt.slug}/>
            </Tab.Pane>
          </Tab.Content>
          <Nav variant="pills" justify fill className={styles.treasureNav}>
            <Container>
              <Row>
                <Nav.Item>
                  <Nav.Link eventKey="rules" data-testid="rules-button" className={styles.navItem}>
                    <span className={styles.navIcon}>📖</span>
                    <span className={styles.navLabel}>{t('navRules')}</span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="manuscript"
                    data-testid="manuscript-button"
                    className={`${styles.navItem} ${shouldAnimate ? styles.keywordAnimation : ''}`}
                    onClick={handleManuscriptClick}
                  >
                    <span className={styles.navIcon}>📜</span>
                    <span className={styles.navLabel}>{t('navManuscript')}</span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="map" data-testid="map-button" className={styles.navItem}>
                    <span className={styles.navIcon}>🧭</span>
                    <span className={styles.navLabel}>{t('navMap')}</span>
                  </Nav.Link>
                </Nav.Item>
              </Row>
            </Container>
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
          <span className={styles.errorIcon}>📱</span>
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
          <span className={styles.errorIcon}>🔄</span>
          <h2 className={styles.errorTitle}>{t('landscapeNotSupported')}</h2>
          <p className={styles.errorText}>{t('landscapeHelper')}</p>
        </div>
      </div>
    );
  }

  return (
    <PhraseProvider defaultKeywords={hunt.defaultKeywords} huntSlug={hunt.slug} phrase={hunt.phrase}>
      <ToastProvider>
        <HuntContent hunt={hunt} />
      </ToastProvider>
    </PhraseProvider>
  );
}
