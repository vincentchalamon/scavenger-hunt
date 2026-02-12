"use client";

import {Container} from "react-bootstrap";
import Link from "next/link";
import {useEffect, useState} from "react";
import {PulseLoader} from "react-spinners";
import {useTranslation} from "@/i18n";

export default function NotFound() {
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

  if (!loaded) {
    return (
      <Container style={{height: "100dvh"}} className="z-3 vw-100 mw-100 position-fixed top-0 left-0 bg-dark align-content-center text-center">
        <PulseLoader color="white"/>
      </Container>
    );
  }

  if (!isMobile) {
    return (
      <Container className="pt-2">
        <p>{t('mobileOnly')}</p>
        <p>{t('mobileOnlyHelper')}</p>
      </Container>
    );
  }

  if (locked) {
    return (
      <Container>
        <p>{t('landscapeNotSupported')}</p>
      </Container>
    );
  }

  return (
    <Container className="py-4 text-center">
      <h1 className="mb-4">{t('notFoundTitle')}</h1>
      <p className="mb-4">{t('notFoundMessage')}</p>
      <Link href="/" className="btn btn-primary">
        {t('notFoundBackButton')}
      </Link>
    </Container>
  );
}
