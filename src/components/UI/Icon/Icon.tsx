import React from 'react';

export type IconProps = {
  size?: number;
  color?: string;
  fill?: string;
  strokeWidth?: number;
  className?: string;
};

const Base: React.FC<IconProps & { children: React.ReactNode }> = ({
  size = 20,
  color = 'currentColor',
  fill = 'none',
  strokeWidth = 1.5,
  className,
  children,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

/**
 * Jeu d'icônes au trait (Direction C). Stroke 1.5, viewBox 24x24, sans emoji.
 */
export const Icon = {
  Scroll: (p: IconProps) => (
    <Base {...p}>
      <path d="M6 4h11a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V6" />
      <path d="M4 6a2 2 0 014 0v11a3 3 0 003 3" />
      <path d="M9 9h7M9 13h7M9 17h4" />
    </Base>
  ),
  Compass: (p: IconProps) => (
    <Base {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5L13 13l-4.5 2.5L11 11l4.5-2.5z" fill={p?.color || 'currentColor'} stroke="none" />
    </Base>
  ),
  Pin: (p: IconProps) => (
    <Base {...p}>
      <path d="M12 22s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z" />
      <circle cx="12" cy="9" r="2.5" />
    </Base>
  ),
  Clock: (p: IconProps) => (
    <Base {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Base>
  ),
  Target: (p: IconProps) => (
    <Base {...p}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill={p?.color || 'currentColor'} />
    </Base>
  ),
  ArrowRight: (p: IconProps) => (
    <Base {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Base>
  ),
  ArrowLeft: (p: IconProps) => (
    <Base {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></Base>
  ),
  Check: (p: IconProps) => (
    <Base {...p}><path d="M5 12l5 5 9-11" /></Base>
  ),
  X: (p: IconProps) => (
    <Base {...p}><path d="M6 6l12 12M18 6L6 18" /></Base>
  ),
  Share: (p: IconProps) => (
    <Base {...p}><path d="M12 3v13M7 8l5-5 5 5M5 14v5a2 2 0 002 2h10a2 2 0 002-2v-5" /></Base>
  ),
  Help: (p: IconProps) => (
    <Base {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 3.5M12 17h.01" />
    </Base>
  ),
  Map: (p: IconProps) => (
    <Base {...p}>
      <path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2z" />
      <path d="M9 4v14M15 6v14" />
    </Base>
  ),
  Sparkle: (p: IconProps) => (
    <Base {...p}>
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z" />
    </Base>
  ),
  Flag: (p: IconProps) => (
    <Base {...p}><path d="M5 21V4M5 4h12l-2 4 2 4H5" /></Base>
  ),
  Key: (p: IconProps) => (
    <Base {...p}>
      <circle cx="7" cy="15" r="3" />
      <path d="M9.5 13L20 4M16 8l3 3" />
    </Base>
  ),
  Lock: (p: IconProps) => (
    <Base {...p}>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </Base>
  ),
  Layers: (p: IconProps) => (
    <Base {...p}>
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 13l9 5 9-5M3 18l9 5 9-5" />
    </Base>
  ),
  Search: (p: IconProps) => (
    <Base {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-5-5" />
    </Base>
  ),
  ExternalLink: (p: IconProps) => (
    <Base {...p}>
      <path d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
      <path d="M14 4h6v6" />
      <path d="M20 4l-9 9" />
    </Base>
  ),
  Rotate: (p: IconProps) => (
    <Base {...p}>
      <path d="M21 12a9 9 0 1 1-9-9" />
      <path d="M21 4v5h-5" />
    </Base>
  ),
  Phone: (p: IconProps) => (
    <Base {...p}>
      <rect x="6" y="2" width="12" height="20" rx="3" />
      <path d="M11 18h2" />
    </Base>
  ),
};
