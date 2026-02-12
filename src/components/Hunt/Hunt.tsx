"use client";

import {Container, Nav, Navbar, Row, Tab} from "react-bootstrap";
import {Manuscript} from "@/components/Manuscript/Manuscript";
import {Rules} from "@/components/Rules";
import React, {useEffect, useState} from "react";
import {Hunt as HuntType} from "@/types/Hunt";
import {PhraseProvider} from "@/contexts/PhraseContext";
import {ToastProvider} from "@/contexts/ToastContext";
import {Toast} from "@/components/Toast/Toast";
import {Map} from "@/components/Map/Map";
import {CompassLoader} from "@/components/UI";
import {useTranslation} from "@/i18n";
import Link from "next/link";
import styles from "./Hunt.module.css";

type HuntProps = {
  hunt: HuntType;
}

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
    <PhraseProvider defaultKeywords={hunt.defaultKeywords} huntSlug={hunt.slug}>
      <ToastProvider>
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
          paddingTop: "70px",
          height: "100dvh",
          flexDirection: "column",
          background: "var(--gradient-parchment)",
        }}>
          <Tab.Container defaultActiveKey="rules">
            <Tab.Content style={{flex: 1, overflow: "auto"}}>
              <Tab.Pane eventKey="rules" className="h-100">
                <Rules/>
              </Tab.Pane>
              <Tab.Pane eventKey="manuscript" className="h-100">
                <Manuscript manuscript={hunt.manuscript} phrase={hunt.phrase}/>
              </Tab.Pane>
              <Tab.Pane eventKey="map" className="h-100">
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
                    <Nav.Link eventKey="manuscript" data-testid="manuscript-button" className={styles.navItem}>
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
      </ToastProvider>
    </PhraseProvider>
  );
}
