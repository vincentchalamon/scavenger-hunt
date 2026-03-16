"use client";

import React, {useEffect, useState} from "react";
import {Hunt} from "@/types/Hunt";
import {Container, Modal} from "react-bootstrap";
import {CompassLoader, ParchmentCard, TreasureButton} from "@/components/UI";
import Link from "next/link";
import {useTranslation} from "@/i18n";
import {useHuntProgress} from "@/hooks/use-hunt-progress";
import {assetPath} from "@/lib/assets";
import styles from './HuntsList.module.css';

type HuntsListProps = {
  hunts: Hunt[];
}

export const HuntsList: React.FC<HuntsListProps> = ({hunts}) => {
  const { t } = useTranslation();
  const [showQrModal, setShowQrModal] = useState(false);

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
    <div className={styles.huntsListContainer}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroIcon}>🏛️</span>
          <h1 className={styles.heroTitle}>{t('huntsListTitle')}</h1>
          <p className={styles.heroSubtitle}>{t('huntSubtitle')}</p>
        </div>
      </div>

      {/* Hunts List */}
      <Container className={styles.huntsContainer}>
        <div className={styles.huntsList}>
          {hunts.map((hunt) => {
            // Calculate the total number of keywords (phrase - defaultKeywords)
            const totalKeywords = hunt.phrase.split(' ').length - (hunt.defaultKeywords?.length || 0);

            return (
              <HuntCard
                key={hunt.slug}
                hunt={hunt}
                totalKeywords={totalKeywords}
              />
            );
          })}
        </div>

        {/* Footer Info */}
        <div className={styles.footer}>
          <p className={styles.footerText}>
            💡 {t('huntFooterTip')}
          </p>
          <button className={styles.shareButton} onClick={() => setShowQrModal(true)}>
            <span>📲</span> {t('shareButton')}
          </button>
        </div>
      </Container>

      {/* QR Code Modal */}
      <Modal show={showQrModal} onHide={() => setShowQrModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('shareTitle')}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.qrModalBody}>
          <img src={assetPath('/assets/qrcode.png')} alt="QR Code" className={styles.qrCode} />
        </Modal.Body>
      </Modal>
    </div>
  );
}

// Separate component for each hunt card
const HuntCard: React.FC<{ hunt: Hunt; totalKeywords: number }> = ({ hunt, totalKeywords }) => {
  const { t } = useTranslation();
  const { progress } = useHuntProgress(hunt.slug, hunt.places.length, totalKeywords);

  // Determine language badge
  const getLanguageBadge = (lang?: string) => {
    if (!lang) return null;

    const languageMap: Record<string, { flag: string; nameKey: string }> = {
      'fr': { flag: '🇫🇷', nameKey: 'langFrench' },
      'en': { flag: '🇬🇧', nameKey: 'langEnglish' },
      'es': { flag: '🇪🇸', nameKey: 'langSpanish' },
      'de': { flag: '🇩🇪', nameKey: 'langGerman' },
      'it': { flag: '🇮🇹', nameKey: 'langItalian' },
    };

    const langInfo = languageMap[lang.toLowerCase()];
    if (langInfo) {
      return { display: langInfo.flag, title: t(langInfo.nameKey as any) };
    }

    // Si pas dans la map, afficher le code de langue en majuscules
    return { display: lang.toUpperCase(), title: lang };
  };

  const languageBadge = getLanguageBadge(hunt.lang);

  return (
    <ParchmentCard
      variant="bordered"
      elevation="lg"
      className={styles.huntCard}
    >
      <div className={styles.huntHeader}>
        {languageBadge && (
          <div className={styles.languageBadge} title={languageBadge.title}>
            <span>{languageBadge.display}</span>
          </div>
        )}
        <h2 className={styles.huntTitle}>{hunt.name}</h2>
      </div>

      {/* Hunt Stats */}
      <div className={styles.huntStats}>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>📍</span>
          <span className={styles.statText}>
            {hunt.places?.length || 0} {t('huntPlaces')}
          </span>
        </div>
        {hunt.duration && (
          <div className={styles.statItem}>
            <span className={styles.statIcon}>⏱️</span>
            <span className={styles.statText}>{hunt.duration}</span>
          </div>
        )}
        <div className={styles.statItem}>
          <span className={styles.statIcon}>
            {progress === 100 ? '✅' : progress > 0 ? '▶️' : '⭕'}
          </span>
          <span className={styles.statText}>{progress}%</span>
        </div>
      </div>

      {/* Hunt Description */}
      <p className={styles.huntDescription}>
        {hunt.description || `Partez à la découverte et résolvez les énigmes pour trouver les mots cachés dans les lieux emblématiques.`}
      </p>

      {/* CTA Button */}
      <Link href={`/${hunt.slug}`} style={{ textDecoration: 'none' }}>
        <TreasureButton
          variant="primary"
          size="lg"
          icon={<span>🎯</span>}
          iconPosition="right"
          className={styles.startButton}
        >
          {t('huntStart')}
        </TreasureButton>
      </Link>
    </ParchmentCard>
  );
};
