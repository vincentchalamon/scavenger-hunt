"use client";

import {Container, Nav, Navbar, Row, Tab} from "react-bootstrap";
import {Manuscript} from "@/components/Manuscript/Manuscript";
import {Rules} from "@/components/Rules";
import React, {useEffect, useState} from "react";
import {Hunt as HuntType} from "@/types/Hunt";
import {PhraseProvider, PhraseContext} from "@/contexts/PhraseContext";
import {ToastProvider} from "@/contexts/ToastContext";
import {Toast} from "@/components/Toast/Toast";
import dynamic from "next/dynamic";
import {CompassLoader} from "@/components/UI";
import {useTranslation} from "@/i18n";
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

// Internal component to access PhraseContext
const HuntContent: React.FC<HuntProps> = ({hunt}) => {
  const { t } = useTranslation();
  const { keywords } = React.useContext(PhraseContext);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [prevKeywordsCount, setPrevKeywordsCount] = useState(keywords.length);

  // Detect when a new keyword is added
  useEffect(() => {
    if (keywords.length > prevKeywordsCount) {
      // New keyword found - trigger animation
      setShouldAnimate(true);
    }
    setPrevKeywordsCount(keywords.length);
  }, [keywords.length, prevKeywordsCount]);

  // Handler for clicking on the Manuscript button
  const handleManuscriptClick = () => {
    // Disable animation when user clicks on Manuscript
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
          defaultActiveKey="rules"
          onSelect={(key) => {
            // Force window resize event to trigger map invalidation
            if (key === 'map') {
              setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
              }, 50);
            }
          }}
        >
          <Tab.Content style={{flex: 1, overflow: "auto", padding: 0, margin: 0}}>
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

  // Lock screen orientation (native browser option is not fully supported)
  const [locked, setLocked] = useState<boolean | undefined>(undefined);
  // Lock for mobile only
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);
  // Loading screen
  const [loaded, setLoaded] = useState<boolean>(false);

  if (typeof navigator !== "undefined") {
    useEffect(() => setIsMobile(/iphone|ipad|ipod|android|blackberry|windows phone/g.test(navigator.userAgent.toLowerCase())));
  }

  if (typeof window !== "undefined") {
    // Lock screen orientation (native browser option is not fully supported)
    useEffect(() => {
      const handler = () => setLocked(screen.orientation.type.toString().startsWith("landscape"));
      handler();
      screen.orientation.addEventListener('change', handler, true);

      return () => screen.orientation.removeEventListener('change', handler, true);
    }, [screen.orientation]);

    // Loading screen
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
