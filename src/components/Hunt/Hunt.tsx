"use client";

import {Button, Container, Nav, Navbar, Row, Tab} from "react-bootstrap";
import {Manuscript} from "@/components/Manuscript/Manuscript";
import {Map} from "@/components/Map/Map";
import {ItemsList as ItemsList} from "@/components/ItemsList/ItemsList";
import React, {useEffect, useState} from "react";
import {Hunt as HuntType} from "@/types/Hunt";
import {ClipLoader} from "react-spinners";
import {PhraseProvider} from "@/contexts/PhraseContext";
import {ToastProvider} from "@/contexts/ToastContext";
import {Toast} from "@/components/Toast/Toast";

interface HuntProps {
  hunt: HuntType;
}

export const Hunt: React.FC<HuntProps> = ({hunt}) => {
  // Ensure geolocation is enabled and allowed
  const [geolocation, hasGeolocation] = useState<boolean|undefined>(undefined);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      () => hasGeolocation(true),
      () => hasGeolocation(false),
    );
  }, [navigator.geolocation]);

  // Calculate application height because I suck at CSS
  const [height, setHeight] = useState<number | undefined>(undefined);
  if (typeof screen !== "undefined") {
    useEffect(() => {
      // Total height - bottom navbar - top navbar
      const timeout = setTimeout(() => setHeight(screen.height - 40 - 59), 500);

      return () => clearTimeout(timeout);
    }, [screen]);

    useEffect(() => {
      // Total height - bottom navbar - top navbar
      const handler = () => setHeight(screen.height - 40 - 59);
      screen.orientation.addEventListener('change', handler, true);

      return () => screen.orientation.removeEventListener('change', handler, true);
    }, [screen.orientation]);
  }

  // Reveal effect after height calculation
  const [opacity, setOpacity] = useState<number>(1);
  useEffect(() => {
    if (opacity === 0 || typeof height === "undefined" || geolocation !== true) {
      return;
    }

    const interval = setInterval(() => setOpacity(opacity - 0.1), 20);

    return () => clearInterval(interval);
  }, [opacity, height, geolocation]);

  return (
    <PhraseProvider>
      <ToastProvider>
        {opacity > 0 && (
          <Container
            className="z-3 vh-100 vw-100 mw-100 position-fixed top-0 left-0 bg-dark align-content-center text-center"
            style={{opacity: opacity}}>
            {geolocation !== true && (
              <div className="mb-5">
                <p>This application requires geolocation.</p>
                <p>Please enable and allow geolocation on your browser.</p>
              </div>
            )}
            <ClipLoader size={80} color="white" className="mt-5"/>
          </Container>
        )}
        <Toast/>
        <Navbar fixed="top" className="z-0 bg-light border-bottom border-dark">
          <Container>
            <Navbar.Brand>
              <Button type="button" size="lg" className="py-0 me-2 bg-transparent border-0 text-dark fs-1 lh-1" href="/">&#8249;</Button>
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
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          backgroundBlendMode: 'lighten',
        }}>
          <Tab.Container defaultActiveKey="manuscript">
            <Tab.Content style={{height: `${height}px`}}>
              <Tab.Pane eventKey="manuscript" className="h-100">
                <Manuscript manuscript={hunt.manuscript} phrase={hunt.phrase}/>
              </Tab.Pane>
              <Tab.Pane eventKey="items" className="h-100">
                <ItemsList items={hunt.items}/>
              </Tab.Pane>
              <Tab.Pane eventKey="map" className="h-100">
                <Map/>
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
                    <Nav.Link eventKey="items">
                      <i className="bi bi-backpack3"></i>
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
  );
}
