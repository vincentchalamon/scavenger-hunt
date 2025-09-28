"use client";

import {Container, Nav, Navbar, Row, Tab} from "react-bootstrap";
import {Manuscript} from "@/components/Manuscript/Manuscript";
import React, {useEffect, useState} from "react";
import {Hunt as HuntType} from "@/types/Hunt";
import {PhraseProvider} from "@/contexts/PhraseContext";
import {ToastProvider} from "@/contexts/ToastContext";
import {Toast} from "@/components/Toast/Toast";
import {Map} from "@/components/Map/Map";
import {PulseLoader} from "react-spinners";
import {ApiKeyProvider} from "@/contexts/ApiKeyContext";

type HuntProps = {
  hunt: HuntType;
}

export const Hunt: React.FC<HuntProps> = ({hunt}) => {
  // Calculate application height because I suck at CSS
  const [height, setHeight] = useState<number | undefined>(undefined);
  // Lock screen orientation (native browser option is not fully supported)
  const [locked, setLocked] = useState<boolean | undefined>(undefined);
  // Lock for mobile only
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);
  // Loading screen
  const [loaded, setLoaded] = useState<boolean>(false);

  if (typeof navigator !== "undefined") {
    useEffect(() => setIsMobile(/iphone|ipad|ipod|android|blackberry|windows phone/g.test(navigator.userAgent.toLowerCase())));
  }

  if (typeof screen !== "undefined") {
    // Calculate application height because I suck at CSS
    useEffect(() => {
      // Total height - bottom navbar - top navbar
      const timeout = setTimeout(() => setHeight(screen.height - 40 - 59), 500);

      return () => clearTimeout(timeout);
    }, [screen]);

    // Lock screen orientation (native browser option is not fully supported)
    useEffect(() => {
      const handler = () => setLocked(screen.orientation.type.toString().startsWith("landscape"));
      handler();
      screen.orientation.addEventListener('change', handler, true);

      return () => screen.orientation.removeEventListener('change', handler, true);
    }, [screen.orientation]);

    // Loading screen
    useEffect(() => setLoaded(typeof height !== "undefined" && typeof locked !== "undefined" && typeof isMobile !== "undefined"), [height, locked, isMobile]);
  }

  if (!loaded) {
    return (
      <Container className="z-3 vh-100 vw-100 mw-100 position-fixed top-0 left-0 bg-dark align-content-center text-center">
        <PulseLoader color="white"/>
      </Container>
    );
  }

  if (!isMobile) {
    return (
      <Container className="pt-2">
        <p>Cette application est uniquement compatible sur mobile.</p>
        <p>Veuillez l'ouvrir sur votre mobile.</p>
      </Container>
    );
  }

  if (locked) {
    return (
      <Container>
        <p>Le mode paysage n'est pas supporté.</p>
      </Container>
    );
  }

  return (
    <ApiKeyProvider>
      <PhraseProvider defaultKeywords={hunt.defaultKeywords}>
        <ToastProvider>
          <Toast/>
          <Navbar fixed="top" className="z-0 bg-light border-bottom border-dark">
            <Container>
              <Navbar.Brand className="ms-2">
                {hunt.name}
              </Navbar.Brand>
            </Container>
          </Navbar>
          <div className="px-0 d-flex" style={{
            paddingTop: '58px',
            minHeight: '100vh',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundImage: 'url(/assets/background.png)',
            backgroundPosition: 'center',
            backgroundRepeat: 'repeat',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backgroundBlendMode: 'lighten',
          }}>
            <Tab.Container defaultActiveKey="manuscript">
              <Tab.Content style={{height: `${height}px`}}>
                <Tab.Pane eventKey="manuscript" className="h-100">
                  <Manuscript manuscript={hunt.manuscript} phrase={hunt.phrase}/>
                </Tab.Pane>
                <Tab.Pane eventKey="map" className="h-100">
                  <Map places={hunt.places} debug={hunt.debug} coordinates={hunt.coordinates}/>
                </Tab.Pane>
              </Tab.Content>
              <Nav variant="pills" justify fill className="bg-white text-dark border-top border-dark">
                <Container>
                  <Row>
                    <Nav.Item>
                      <Nav.Link eventKey="manuscript">
                        <i className="bi bi-house"></i>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="map">
                        <i className="bi bi-compass"></i>
                      </Nav.Link>
                    </Nav.Item>
                  </Row>
                </Container>
              </Nav>
            </Tab.Container>
          </div>
        </ToastProvider>
      </PhraseProvider>
    </ApiKeyProvider>
  );
}
