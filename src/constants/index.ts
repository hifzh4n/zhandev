/**
 * Application-wide constants and configuration
 */

// Animation timing constants (milliseconds)
export const ANIMATION_TIMINGS = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 800,
} as const;

// Breakpoints for responsive design
export const BREAKPOINTS = {
  MOBILE: 320,
  MOBILE_LG: 480,
  TABLET: 768,
  DESKTOP: 1024,
  DESKTOP_XL: 1280,
} as const;

// Z-index layers for proper stacking
export const Z_INDEX = {
  BACKGROUND: 0,
  CONTENT: 10,
  MODAL: 50,
  TOOLTIP: 100,
  DOCK: 60,
} as const;

// Profile card configuration
export const PROFILE_CARD = {
  BORDER_RADIUS: 30,
  MAX_HEIGHT: 540,
  ASPECT_RATIO: 0.718,
  GLOW_SIZE: '50%',
  DEFAULT_NAME: 'Zhandev',
  DEFAULT_TITLE: 'Full-Stack Developer',
  DEFAULT_HANDLE: 'zhandev',
  DEFAULT_STATUS: 'Online',
} as const;

// BorderGlow configuration
export const BORDER_GLOW = {
  BORDER_RADIUS: 28,
  GLOW_RADIUS: 40,
  GLOW_PADDING: 40,
  EDGE_SENSITIVITY: 30,
  GLOW_COLOR: '40 80 80',
  GLOW_INTENSITY: 1.0,
  CONE_SPREAD: 25,
  BACKGROUND_COLOR: '#120F17',
  GRADIENT_COLORS: ['#c084fc', '#f472b6', '#38bdf8'],
  FILL_OPACITY: 0.5,
} as const;

// LogoLoop configuration
export const LOGO_LOOP = {
  SPEED: 120,
  DIRECTION: 'left' as const,
  GAP: 32,
  LOGO_HEIGHT: 28,
} as const;

// Dock configuration
export const DOCK = {
  PANEL_HEIGHT: 68,
  BASE_ITEM_SIZE: 50,
  MAGNIFICATION: 70,
  DISTANCE: 200,
  DOCK_HEIGHT: 256,
  SPRING_CONFIG: { mass: 0.1, stiffness: 150, damping: 12 },
} as const;

// LiquidEther configuration
export const LIQUID_ETHER = {
  DEFAULT_MOUSE_FORCE: 18,
  DEFAULT_CURSOR_SIZE: 96,
  DEFAULT_RESOLUTION: 0.25,
  MOBILE_BREAKPOINT: 860,
} as const;

// Color palette
export const COLORS = {
  BACKGROUND: '#05060a',
  DARK_BG: '#0a0a0a',
  CARD_BG: '#120F17',
  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: '#ededed',
  BORDER_LIGHT: 'rgba(255, 255, 255, 0.15)',
  BORDER_LIGHTER: 'rgba(255, 255, 255, 0.1)',
} as const;

// External links
export const EXTERNAL_LINKS = {
  GITHUB: 'https://github.com/hifzh4n',
  REACT: 'https://react.dev',
  NEXTJS: 'https://nextjs.org',
  TYPESCRIPT: 'https://www.typescriptlang.org',
  TAILWIND: 'https://tailwindcss.com',
  NODEJS: 'https://nodejs.org',
  POSTGRESQL: 'https://www.postgresql.org',
  FIGMA: 'https://figma.com',
} as const;

// Accessibility
export const A11Y = {
  FOCUS_OUTLINE_WIDTH: 2,
  FOCUS_OUTLINE_OFFSET: 3,
} as const;
