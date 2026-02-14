import React from 'react';
import styles from './CompassLoader.module.css';

interface CompassLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

/**
 * Loader avec animation de boussole
 * Remplace le PulseLoader générique par quelque chose de thématique
 */
export const CompassLoader: React.FC<CompassLoaderProps> = ({
  size = 'md',
  text,
  fullScreen = false,
}) => {
  const containerClass = fullScreen
    ? styles.fullScreenContainer
    : styles.inlineContainer;

  return (
    <div className={containerClass}>
      <div className={`${styles.compass} ${styles[size]}`}>
        {/* Outer dial */}
        <div className={styles.compassRing}>
          <div className={styles.compassMarkings}>
            <span className={styles.north}>N</span>
            <span className={styles.east}>E</span>
            <span className={styles.south}>S</span>
            <span className={styles.west}>O</span>
          </div>
        </div>

        {/* Rotating needle */}
        <div className={styles.needle}>
          <div className={styles.needleNorth}></div>
          <div className={styles.needleSouth}></div>
        </div>

        {/* Center */}
        <div className={styles.compassCenter}></div>
      </div>

      {text && (
        <p className={styles.loadingText}>{text}</p>
      )}
    </div>
  );
};

