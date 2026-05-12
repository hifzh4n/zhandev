/**
 * Shared TypeScript types and interfaces for the application
 */

import { ReactNode } from 'react';

/**
 * Profile card component props
 */
export interface ProfileCardProps {
  /** User's full name or display name */
  name?: string;
  /** User's title or role */
  title?: string;
  /** User's handle without @ symbol */
  handle?: string;
  /** User's current status (e.g., "Online", "Away") */
  status?: string;
  /** Avatar image URL */
  avatarUrl?: string;
  /** Mini avatar image URL for user info bar */
  miniAvatarUrl?: string;
  /** Contact button text */
  contactText?: string;
  /** Contact button link URL */
  contactUrl?: string;
  /** Additional CSS class names */
  className?: string;
  /** Whether to show user info bar */
  showUserInfo?: boolean;
  /** Whether to show header text overlay */
  showHeader?: boolean;
  /** Enable mouse tilt interaction */
  enableTilt?: boolean;
  /** Enable device motion tilt (mobile) */
  enableMobileTilt?: boolean;
  /** Mobile tilt sensitivity */
  mobileTiltSensitivity?: number;
  /** Enable behind-card glow effect */
  behindGlowEnabled?: boolean;
  /** Behind glow color */
  behindGlowColor?: string;
  /** Behind glow size */
  behindGlowSize?: string;
  /** Inner gradient */
  innerGradient?: string;
  /** Callback when contact button is clicked */
  onContactClick?: () => void;
  /** Callback when menu (hamburger) button is clicked */
  onMenuClick?: () => void;
}

/**
 * BorderGlow component props
 */
export interface BorderGlowProps {
  /** Child elements to wrap */
  children: ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Background color */
  backgroundColor?: string;
  /** Border radius in pixels */
  borderRadius?: number;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * LogoItem represents a single logo in the loop
 */
export interface LogoItem {
  /** React node to render (icon or custom element) */
  node?: ReactNode;
  /** Image source URL */
  src?: string;
  /** Image srcSet for responsive images */
  srcSet?: string;
  /** Image sizes attribute */
  sizes?: string;
  /** Image width */
  width?: number;
  /** Image height */
  height?: number;
  /** Image alt text */
  alt?: string;
  /** Logo title */
  title?: string;
  /** Optional link URL */
  href?: string;
  /** ARIA label */
  ariaLabel?: string;
}

/**
 * LogoLoop component props
 */
export interface LogoLoopProps {
  /** Array of logos to display */
  logos: LogoItem[];
  /** Animation speed in pixels per second */
  speed?: number;
  /** Direction: 'left', 'right', 'up', 'down' */
  direction?: 'left' | 'right' | 'up' | 'down';
  /** Container width */
  width?: string | number;
  /** Logo height */
  logoHeight?: number;
  /** Gap between logos */
  gap?: number;
  /** Pause animation on hover */
  pauseOnHover?: boolean;
  /** Speed when hovering */
  hoverSpeed?: number;
  /** Scale logos on hover */
  scaleOnHover?: boolean;
  /** Enable fade-out effect at edges */
  fadeOut?: boolean;
  /** Fade-out color */
  fadeOutColor?: string;
  /** Custom render function for items */
  renderItem?: (item: LogoItem, key: string | number) => ReactNode;
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** Additional CSS class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * Dock item configuration
 */
export interface DockItemConfig {
  /** Unique identifier */
  id?: string;
  /** Display label */
  label: string;
  /** Icon or content */
  icon: ReactNode;
  /** Action to perform on click */
  onClick?: () => void;
  /** Optional URL for navigation */
  href?: string;
  /** CSS class names */
  className?: string;
  /** Whether this item is currently active */
  isActive?: boolean;
}

/**
 * LiquidEther component props
 */
export interface LiquidEtherProps {
  /** Mouse force strength */
  mouseForce?: number;
  /** Cursor size */
  cursorSize?: number;
  /** Enable viscous simulation */
  isViscous?: boolean;
  /** Viscosity amount */
  viscous?: number;
  /** Viscous iterations */
  iterationsViscous?: number;
  /** Poisson iterations */
  iterationsPoisson?: number;
  /** Simulation time step */
  dt?: number;
  /** Enable BFECC */
  BFECC?: boolean;
  /** Simulation resolution */
  resolution?: number;
  /** Enable bounce */
  isBounce?: boolean;
  /** Color palette */
  colors?: string[];
  /** Additional styles */
  style?: React.CSSProperties;
  /** Additional CSS class names */
  className?: string;
  /** Enable auto demo mode */
  autoDemo?: boolean;
  /** Auto demo speed */
  autoSpeed?: number;
  /** Auto demo intensity */
  autoIntensity?: number;
  /** Takeover duration */
  takeoverDuration?: number;
  /** Auto resume delay */
  autoResumeDelay?: number;
  /** Auto ramp duration */
  autoRampDuration?: number;
}

/**
 * Common component props
 */
export interface CommonComponentProps {
  /** Additional CSS class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Data test ID for testing */
  dataTestId?: string;
}

/**
 * Animation configuration
 */
export interface AnimationConfig {
  /** Animation duration in milliseconds */
  duration: number;
  /** Easing function */
  easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  /** Animation delay in milliseconds */
  delay?: number;
}
