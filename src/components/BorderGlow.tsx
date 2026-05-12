/**
 * BorderGlow Component
 * 
 * A component that renders a glowing border effect with gradient animations.
 * Features include cursor-driven edge lighting, animated sweep effects, and customizable colors.
 */

'use client';

import React, { ReactNode, CSSProperties, useRef, useCallback, useEffect } from 'react';
import type { BorderGlowProps } from '@/types';
import { toDegrees } from '@/utils/math';
import { BORDER_GLOW, ANIMATION_TIMINGS } from '@/constants';
import './BorderGlow.css';

/**
 * HSL color values type
 */
interface HSLColor {
  h: number;
  s: number;
  l: number;
}

/**
 * Animation options type
 */
interface AnimationOptions {
  start?: number;
  end?: number;
  duration?: number;
  delay?: number;
  ease?: (t: number) => number;
  onUpdate: (value: number) => void;
  onEnd?: () => void;
}

/**
 * Parses HSL color string into numeric values
 * @param hslStr - HSL color string in format "h s% l%"
 * @returns HSL color object with default values for invalid input
 */
function parseHSL(hslStr: string | undefined | null): HSLColor {
  if (!hslStr || typeof hslStr !== 'string') {
    return { h: 40, s: 80, l: 80 };
  }
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) {
    return { h: 40, s: 80, l: 80 };
  }
  return {
    h: parseFloat(match[1]),
    s: parseFloat(match[2]),
    l: parseFloat(match[3]),
  };
}

/**
 * Builds CSS custom properties for glow colors with opacity variations
 * @param glowColor - HSL color string for glow
 * @param intensity - Intensity multiplier (0-1)
 * @returns Object of CSS custom properties
 */
function buildGlowVars(glowColor: string, intensity: number): Record<string, string> {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ['', '-60', '-50', '-40', '-30', '-20', '-10'];
  const vars: Record<string, string> = {};

  for (let i = 0; i < opacities.length; i++) {
    vars[`--glow-color${keys[i]}`] = `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`;
  }

  return vars;
}

/**
 * Builds CSS custom properties for gradient effects
 * @param colors - Array of color strings
 * @returns Object of CSS custom properties with gradient definitions
 */
function buildGradientVars(colors: string[]): Record<string, string> {
  const GRADIENT_POSITIONS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
  const GRADIENT_KEYS = [
    '--gradient-one',
    '--gradient-two',
    '--gradient-three',
    '--gradient-four',
    '--gradient-five',
    '--gradient-six',
    '--gradient-seven',
  ];
  const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

  const vars: Record<string, string> = {};
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    vars[GRADIENT_KEYS[i]] = `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`;
  }
  vars['--gradient-base'] = `linear-gradient(${colors[0]} 0 100%)`;

  return vars;
}

/**
 * Easing function: ease out cubic
 * @param x - Progress value (0-1)
 * @returns Eased value
 */
function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

/**
 * Easing function: ease in cubic
 * @param x - Progress value (0-1)
 * @returns Eased value
 */
function easeInCubic(x: number): number {
  return x * x * x;
}

/**
 * Animates a numeric value over time with easing
 * @param options - Animation options
 */
function animateValue(options: AnimationOptions): void {
  const { start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, onUpdate, onEnd } = options;
  const t0 = performance.now() + delay;

  function tick(): void {
    const elapsed = performance.now() - t0;
    const t = Math.min(elapsed / duration, 1);
    onUpdate(start + (end - start) * ease(t));
    if (t < 1) {
      requestAnimationFrame(tick);
    } else if (onEnd) {
      onEnd();
    }
  }

  setTimeout(() => requestAnimationFrame(tick), delay);
}

/**
 * BorderGlow Component
 * 
 * @component
 * @example
 * ```tsx
 * <BorderGlow
 *   glowColor="40 80 80"
 *   colors={['#c084fc', '#f472b6', '#38bdf8']}
 *   borderRadius={28}
 *   animated={true}
 * >
 *   <p>Content here</p>
 * </BorderGlow>
 * ```
 */
const BorderGlowComponent = ({
  children,
  className = '',
  edgeSensitivity = BORDER_GLOW.EDGE_SENSITIVITY,
  glowColor = BORDER_GLOW.GLOW_COLOR,
  backgroundColor = BORDER_GLOW.BACKGROUND_COLOR,
  borderRadius = BORDER_GLOW.BORDER_RADIUS,
  glowRadius = BORDER_GLOW.GLOW_RADIUS,
  glowIntensity = BORDER_GLOW.GLOW_INTENSITY,
  coneSpread = BORDER_GLOW.CONE_SPREAD,
  animated = false,
  colors = Array.from(BORDER_GLOW.GRADIENT_COLORS),
  fillOpacity = BORDER_GLOW.FILL_OPACITY,
}: BorderGlowProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  /**
   * Gets center coordinates of an element
   */
  const getCenterOfElement = useCallback((el: HTMLElement): [number, number] => {
    const { width, height } = el.getBoundingClientRect();
    return [width / 2, height / 2];
  }, []);

  /**
   * Calculates proximity to edges (0-1, where 1 is at edge)
   */
  const getEdgeProximity = useCallback(
    (el: HTMLElement, x: number, y: number): number => {
      const [cx, cy] = getCenterOfElement(el);
      const dx = x - cx;
      const dy = y - cy;
      let kx = Infinity;
      let ky = Infinity;

      if (dx !== 0) kx = cx / Math.abs(dx);
      if (dy !== 0) ky = cy / Math.abs(dy);

      return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
    },
    [getCenterOfElement]
  );

  /**
   * Calculates angle from element center to cursor
   */
  const getCursorAngle = useCallback(
    (el: HTMLElement, x: number, y: number): number => {
      const [cx, cy] = getCenterOfElement(el);
      const dx = x - cx;
      const dy = y - cy;

      if (dx === 0 && dy === 0) return 0;

      const radians = Math.atan2(dy, dx);
      let degrees = toDegrees(radians) + 90;

      if (degrees < 0) degrees += 360;

      return degrees;
    },
    [getCenterOfElement]
  );

  /**
   * Handles pointer move events for edge lighting effect
   */
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>): void => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const angle = getCursorAngle(card, x, y);

      card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
    },
    [getCursorAngle]
  );

  /**
   * Set up animated sweep effect
   */
  useEffect(() => {
    if (!animated || !cardRef.current) return;

    const card = cardRef.current;
    const angleStart = 110;
    const angleEnd = 465;

    card.classList.add('sweep-active');
    card.style.setProperty('--cursor-angle', `${angleStart}deg`);

    // Fade in proximity
    animateValue({
      duration: 500,
      onUpdate: (v) => card.style.setProperty('--edge-proximity', `${v}`),
    });

    // Sweep animation - first half
    animateValue({
      ease: easeInCubic,
      duration: 1500,
      end: 50,
      onUpdate: (v) => {
        card.style.setProperty(
          '--cursor-angle',
          `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`
        );
      },
    });

    // Sweep animation - second half
    animateValue({
      ease: easeOutCubic,
      delay: 1500,
      duration: 2250,
      start: 50,
      end: 100,
      onUpdate: (v) => {
        card.style.setProperty(
          '--cursor-angle',
          `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`
        );
      },
    });

    // Fade out proximity
    animateValue({
      ease: easeInCubic,
      delay: 2500,
      duration: 1500,
      start: 100,
      end: 0,
      onUpdate: (v) => card.style.setProperty('--edge-proximity', `${v}`),
      onEnd: () => card.classList.remove('sweep-active'),
    });
  }, [animated]);

  const glowVars = buildGlowVars(glowColor ?? BORDER_GLOW.GLOW_COLOR, glowIntensity);

  const glowStyle: CSSProperties = {
    '--card-bg': backgroundColor,
    '--edge-sensitivity': edgeSensitivity,
    '--border-radius': `${borderRadius}px`,
    '--glow-padding': `${glowRadius}px`,
    '--cone-spread': coneSpread,
    '--fill-opacity': fillOpacity,
    ...glowVars,
      ...buildGradientVars(Array.from(colors as any)),
  } as CSSProperties;

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={`border-glow-card ${className}`.trim()}
      style={glowStyle}
    >
      <span className="edge-light" />
      <div className="border-glow-inner">{children}</div>
    </div>
  );
};

BorderGlowComponent.displayName = 'BorderGlow';

const BorderGlow = React.memo(BorderGlowComponent);
export default BorderGlow;
