export const LIQUID_ETHER_CONFIG = {
  colors: ['#5227FF', '#FF9FFC', '#B497CF'],
  mouseForce: 20,
  cursorSize: 100,
  isViscous: true,
  viscous: 30,
  iterationsViscous: 16,
  iterationsPoisson: 16,
  resolution: 0.25,
  isBounce: false,
  autoDemo: true,
  autoSpeed: 0.5,
  autoIntensity: 2.2,
  takeoverDuration: 0.25,
  autoResumeDelay: 3000,
  autoRampDuration: 0.6,
  color0: '#5227FF',
  color1: '#FF9FFC',
  color2: '#B497CF',
} as const;

export const NAVIGATION_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Education', href: '/education' },
  { label: 'Experience', href: '/experience' },
  { label: 'Achievements', href: '/achievements' },
  { label: 'Projects', href: '/projects' },
] as const;

export const SITE_CONFIG = {
  title: 'Portfolio',
  description: 'Full-stack developer showcasing education, experience, achievements, and projects.',
  author: 'Your Name',
  url: 'https://yourportfolio.com',
} as const;
