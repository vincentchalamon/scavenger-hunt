import React from 'react';
import {Icon} from '../Icon/Icon';
import styles from './ParchmentCard.module.css';

interface ParchmentCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'sealed';
  elevation?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
}

/**
 * Composant carte avec effet parchemin ancien
 * Parfait pour afficher du contenu dans un style vintage
 */
export const ParchmentCard: React.FC<ParchmentCardProps> = ({
  children,
  className = '',
  variant = 'default',
  elevation = 'md',
  onClick,
}) => {
  const cardClass = [
    styles.parchmentCard,
    styles[variant],
    styles[`elevation-${elevation}`],
    onClick ? styles.clickable : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClass} onClick={onClick}>
      <div className={styles.content}>
        {children}
      </div>
      {variant === 'sealed' && (
        <div className={styles.seal}>
          <Icon.Lock size={20} color="#fff" strokeWidth={2} />
        </div>
      )}
    </div>
  );
};

