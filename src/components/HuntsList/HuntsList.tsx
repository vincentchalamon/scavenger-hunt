"use client";

import React, {useEffect, useState} from "react";
import {Hunt} from "@/types/Hunt";
import {Card, Container} from "react-bootstrap";
import {PulseLoader} from "react-spinners";
import {ApiKeyProvider} from "@/contexts/ApiKeyContext";
import Link from "next/link";

type HuntsListProps = {
  hunts: Hunt[];
}

export const HuntsList: React.FC<HuntsListProps> = ({hunts}) => {
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
    return (
      <Container style={{height: "100svh"}} className="z-3 vw-100 mw-100 position-fixed top-0 left-0 bg-dark align-content-center text-center">
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
      <Container className="py-4">
        <h1 className="mb-4">Chasses au trésor disponibles</h1>
        <div className="d-flex flex-column gap-3">
          {hunts.map((hunt) => (
            <Card key={hunt.slug}>
              <Card.Body>
                <Card.Title>{hunt.name}</Card.Title>
                <Link href={`/${hunt.slug}`} className="btn btn-primary mt-2">
                  Commencer
                </Link>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Container>
    </ApiKeyProvider>
  );
}
