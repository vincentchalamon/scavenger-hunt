"use client";

import React, {useEffect, useState} from "react";
import {Hunt} from "@/types/Hunt";
import {Container, Modal} from "react-bootstrap";
import {CompassLoader, TreasureButton, Icon} from "@/components/UI";
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
    <div className={styles.huntsListContainer}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroTop}>
          <div className={styles.brandChip}>
            <Icon.Compass size={12} color="#fff" strokeWidth={2} />
            SCAVENGER HUNT
          </div>
          <button className={styles.iconButton} onClick={() => setShowQrModal(true)} aria-label={t('shareButton')}>
            <Icon.Share size={15} color="var(--color-ink)" strokeWidth={2} />
          </button>
        </div>
        <h1 className={styles.heroTitle}>{t('huntsListTitle')}</h1>
        <p className={styles.heroSubtitle}>{t('huntSubtitle')}</p>
      </div>

      {/* Hunts List */}
      <Container className={styles.huntsContainer}>
        <div className={styles.huntsList}>
          {hunts.map((hunt, index) => {
            // Number of unique words to find (unique phrase words minus the default ones),
            // matching the count used inside the hunt itself.
            const totalKeywords = [...new Set(hunt.phrase.split(' '))].length - (hunt.defaultKeywords?.length || 0);

            return (
              <HuntCard
                key={hunt.slug}
                hunt={hunt}
                index={index}
                totalKeywords={totalKeywords}
              />
            );
          })}
        </div>

        {/* Footer Info */}
        <div className={styles.footer}>
          <p className={styles.footerText}>{t('huntFooterTip')}</p>
        </div>
      </Container>

      {/* QR Code Modal */}
      <Modal show={showQrModal} onHide={() => setShowQrModal(false)} centered>
        <Modal.Body className={styles.qrModalBody} onClick={() => setShowQrModal(false)}>
          <img src={assetPath('/assets/qrcode.png')} alt="QR Code" className={styles.qrCode} />
        </Modal.Body>
      </Modal>
    </div>
  );
}

// Separate component for each hunt card
const HuntCard: React.FC<{ hunt: Hunt; index: number; totalKeywords: number }> = ({ hunt, index, totalKeywords }) => {
  const { t } = useTranslation();
  const { foundKeywords } = useHuntProgress(hunt.slug, hunt.places.length, totalKeywords);

  const defaults = hunt.defaultKeywords || [];
  const total = Math.max(1, totalKeywords);
  // Found words = stored keywords that aren't part of the initially-revealed defaults
  const step = Math.min(foundKeywords.filter((w) => !defaults.includes(w)).length, total);
  const completed = step >= total;
  const started = step > 0;
  const pct = Math.round((step / total) * 100);
  const status = completed ? 'completed' : started ? 'inProgress' : 'new';
  const number = String(index + 1).padStart(2, '0');

  return (
    <div className={`${styles.huntCard} ${started ? styles.huntCardActive : ''}`}>
      {/* Top row: number + lang chip + status */}
      <div className={styles.cardTop}>
        <div className={styles.cardTopLeft}>
          <div className={styles.numberBadge}>{number}</div>
          {hunt.lang && (
            <div className={styles.langChip}>{hunt.lang.toUpperCase()}</div>
          )}
        </div>
        <div className={`${styles.statusChip} ${completed ? styles.statusChipCompleted : started ? styles.statusChipActive : styles.statusChipNew}`}>
          {completed ? t('huntCompleted') : started ? t('huntInProgress') : t('huntNew')}
        </div>
      </div>

      <h2 className={styles.huntTitle}>{hunt.name}</h2>
      <p className={styles.huntDescription}>
        {hunt.description || t('huntDescription')}
      </p>

      {/* Progress bar (only if started) */}
      {started && (
        <div className={styles.progressWrap}>
          <div className={styles.progressSegments}>
            {Array.from({length: total}).map((_, i) => (
              <div
                key={i}
                className={`${styles.progressSegment} ${i < step ? styles.progressSegmentFilled : ''}`}
              />
            ))}
          </div>
          <div className={styles.progressMeta}>
            <span>{step}/{total} {t('wordsFoundLabel')}</span>
            <span>{pct} %</span>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className={styles.huntStats}>
        <div className={styles.statItem}>
          <Icon.Pin size={14} color="var(--color-ink-soft)" strokeWidth={1.8} />
          <span className={styles.statText}>{hunt.places?.length || 0} {t('huntPlaces')}</span>
        </div>
        {hunt.duration && (
          <div className={styles.statItem}>
            <Icon.Clock size={14} color="var(--color-ink-soft)" strokeWidth={1.8} />
            <span className={styles.statText}>{hunt.duration}</span>
          </div>
        )}
      </div>

      {/* CTA Button */}
      <Link href={`/${hunt.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
        <TreasureButton
          variant={started ? "secondary" : "primary"}
          size="lg"
          icon={<Icon.ArrowRight size={16} color="#fff" />}
          iconPosition="right"
          className={styles.startButton}
        >
          {started ? t('huntResume') : t('huntStart')}
        </TreasureButton>
      </Link>
    </div>
  );
};
