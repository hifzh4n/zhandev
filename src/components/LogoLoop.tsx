/**
 * LogoLoop Component
 * 
 * An infinite carousel/loop component for displaying logos with smooth animations,
 * hover effects, and responsive sizing. Supports horizontal and vertical directions.
 */

'use client';

import React, {
  CSSProperties,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
} from 'react';
import type { LogoItem, LogoLoopProps } from '@/types';
import { LOGO_LOOP, ANIMATION_TIMINGS } from '@/constants';
import './LogoLoop.css';

/**
 * Animation configuration constants
 */
const ANIMATION_CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 2,
  COPY_HEADROOM: 2,
} as const;

/**
 * Converts numeric value to CSS pixel length or passes through string
 * @param value - Numeric or string value
 * @returns CSS length string or undefined
 */
function toCssLength(value: number | string | undefined): string | undefined {
  if (typeof value === 'number') return `${value}px`;
  return value ?? undefined;
}

/**
 * Hook to observe element resize changes
 * @param callback - Function to call on resize
 * @param elements - Array of refs to observe
 * @param dependencies - Dependencies array
 */
function useResizeObserver(
  callback: () => void,
  elements: React.RefObject<any>[],
  dependencies: React.DependencyList
): void {
  useEffect(() => {
    if (!window.ResizeObserver) {
      const handleResize = () => callback();
      window.addEventListener('resize', handleResize);
      callback();
      return () => window.removeEventListener('resize', handleResize);
    }

    const observers = elements.map((ref) => {
      if (!ref.current) return null;
      const observer = new ResizeObserver(callback);
      observer.observe(ref.current);
      return observer;
    });

    callback();

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [callback, elements, ...dependencies]);
}

/**
 * Hook to wait for all images to load
 * @param seqRef - Ref to element containing images
 * @param onLoad - Callback when all images load
 * @param dependencies - Dependencies array
 */
function useImageLoader(
  seqRef: React.RefObject<any>,
  onLoad: () => void,
  dependencies: React.DependencyList
): void {
  useEffect(() => {
    const images = seqRef.current?.querySelectorAll('img') ?? [];

    if (images.length === 0) {
      onLoad();
      return;
    }

    let remainingImages = images.length;

    const handleImageLoad = (): void => {
      remainingImages -= 1;
      if (remainingImages === 0) onLoad();
    };

    images.forEach((img: HTMLImageElement) => {
      if (img.complete) {
        handleImageLoad();
      } else {
        img.addEventListener('load', handleImageLoad, { once: true });
        img.addEventListener('error', handleImageLoad, { once: true });
      }
    });

    return () => {
      images.forEach((img: HTMLImageElement) => {
        img.removeEventListener('load', handleImageLoad);
        img.removeEventListener('error', handleImageLoad);
      });
    };
  }, [onLoad, seqRef, ...dependencies]);
}

/**
 * Hook to manage animation loop with smooth velocity easing
 * @param trackRef - Ref to animated track element
 * @param targetVelocity - Target scroll velocity in pixels/second
 * @param seqWidth - Width of sequence in pixels
 * @param seqHeight - Height of sequence in pixels
 * @param isHovered - Whether element is hovered
 * @param hoverSpeed - Speed while hovered (if different)
 * @param isVertical - Whether animating vertically
 */
function useAnimationLoop(
  trackRef: React.RefObject<HTMLDivElement | null>,
  targetVelocity: number,
  seqWidth: number,
  seqHeight: number,
  isHovered: boolean,
  hoverSpeed: number | undefined,
  isVertical: boolean
): void {
  const rafRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const seqSize = isVertical ? seqHeight : seqWidth;

    if (seqSize > 0) {
      offsetRef.current = ((offsetRef.current % seqSize) + seqSize) % seqSize;
      const transformValue = isVertical
        ? `translate3d(0, ${-offsetRef.current}px, 0)`
        : `translate3d(${-offsetRef.current}px, 0, 0)`;
      track.style.transform = transformValue;
    }

    const animate = (timestamp: number): void => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      const target = isHovered && hoverSpeed !== undefined ? hoverSpeed : targetVelocity;

      const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
      velocityRef.current += (target - velocityRef.current) * easingFactor;

      if (seqSize > 0) {
        let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
        nextOffset = ((nextOffset % seqSize) + seqSize) % seqSize;
        offsetRef.current = nextOffset;

        const transformValue = isVertical
          ? `translate3d(0, ${-offsetRef.current}px, 0)`
          : `translate3d(${-offsetRef.current}px, 0, 0)`;
        track.style.transform = transformValue;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimestampRef.current = null;
    };
  }, [targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical]);
}

/**
 * LogoLoop Component
 * 
 * Renders an infinite loop of logos with smooth animation and optional hover effects.
 * 
 * @component
 * @example
 * ```tsx
 * const logos = [
 *   { src: '/logo1.svg', alt: 'Company 1' },
 *   { src: '/logo2.svg', alt: 'Company 2' },
 * ];
 * 
 * <LogoLoop
 *   logos={logos}
 *   speed={120}
 *   direction="left"
 *   logoHeight={32}
 *   gap={24}
 *   pauseOnHover
 * />
 * ```
 */
const LogoLoopComponent = ({
  logos,
  speed = LOGO_LOOP.SPEED,
  direction = LOGO_LOOP.DIRECTION,
  width = '100%',
  logoHeight = LOGO_LOOP.LOGO_HEIGHT,
  gap = LOGO_LOOP.GAP,
  pauseOnHover,
  hoverSpeed,
  fadeOut = false,
  fadeOutColor,
  scaleOnHover = false,
  renderItem,
  ariaLabel = 'Partner logos',
  className,
  style,
}: LogoLoopProps): ReactElement => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLUListElement>(null);

  const [seqWidth, setSeqWidth] = useState(0);
  const [seqHeight, setSeqHeight] = useState(0);
  const [copyCount, setCopyCount] = useState<number>(ANIMATION_CONFIG.MIN_COPIES);
  const [isHovered, setIsHovered] = useState(false);

  /**
   * Calculate effective hover speed
   */
  const effectiveHoverSpeed = useMemo(() => {
    if (hoverSpeed !== undefined) return hoverSpeed;
    if (pauseOnHover === true) return 0;
    if (pauseOnHover === false) return undefined;
    return 0;
  }, [hoverSpeed, pauseOnHover]);

  const isVertical = direction === 'up' || direction === 'down';

  /**
   * Calculate target animation velocity
   */
  const targetVelocity = useMemo(() => {
    const magnitude = Math.abs(speed);
    const directionMultiplier = isVertical ? (direction === 'up' ? 1 : -1) : direction === 'left' ? 1 : -1;
    const speedMultiplier = speed < 0 ? -1 : 1;
    return magnitude * directionMultiplier * speedMultiplier;
  }, [speed, direction, isVertical]);

  /**
   * Update dimensions and recalculate copy count
   */
  const updateDimensions = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth ?? 0;
    const sequenceRect = seqRef.current?.getBoundingClientRect?.();
    const sequenceWidth = sequenceRect?.width ?? 0;
    const sequenceHeight = sequenceRect?.height ?? 0;

    if (isVertical) {
      const parentHeight = containerRef.current?.parentElement?.clientHeight ?? 0;
      if (containerRef.current && parentHeight > 0) {
        const targetHeight = Math.ceil(parentHeight);
        if (containerRef.current.style.height !== `${targetHeight}px`)
          containerRef.current.style.height = `${targetHeight}px`;
      }
      if (sequenceHeight > 0) {
        setSeqHeight(Math.ceil(sequenceHeight));
        const viewport = containerRef.current?.clientHeight ?? parentHeight ?? sequenceHeight;
        const copiesNeeded = Math.ceil(viewport / sequenceHeight) + ANIMATION_CONFIG.COPY_HEADROOM;
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
      }
    } else if (sequenceWidth > 0) {
      setSeqWidth(Math.ceil(sequenceWidth));
      const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
      setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
    }
  }, [isVertical]);

  useResizeObserver(updateDimensions, [containerRef, seqRef], [logos, gap, logoHeight, isVertical]);
  useImageLoader(seqRef, updateDimensions, [logos, gap, logoHeight, isVertical]);
  useAnimationLoop(trackRef, targetVelocity, seqWidth, seqHeight, isHovered, effectiveHoverSpeed, isVertical);

  /**
   * CSS variables for animations and sizing
   */
  const cssVariables = useMemo(
    () => ({
      '--logoloop-gap': `${gap}px`,
      '--logoloop-logoHeight': `${logoHeight}px`,
      ...(fadeOutColor && { '--logoloop-fadeColor': fadeOutColor }),
    }),
    [gap, logoHeight, fadeOutColor]
  );

  /**
   * Build root className
   */
  const rootClassName = useMemo(
    () =>
      [
        'logoloop',
        isVertical ? 'logoloop--vertical' : 'logoloop--horizontal',
        fadeOut && 'logoloop--fade',
        scaleOnHover && 'logoloop--scale-hover',
        className,
      ]
        .filter(Boolean)
        .join(' '),
    [isVertical, fadeOut, scaleOnHover, className]
  );

  const handleMouseEnter = useCallback(() => {
    if (effectiveHoverSpeed !== undefined) setIsHovered(true);
  }, [effectiveHoverSpeed]);

  const handleMouseLeave = useCallback(() => {
    if (effectiveHoverSpeed !== undefined) setIsHovered(false);
  }, [effectiveHoverSpeed]);

  /**
   * Render individual logo item
   */
  const renderLogoItem = useCallback(
    (item: LogoItem, key: string): ReactElement => {
      if (renderItem) {
        return (
          <li className="logoloop__item" key={key} role="listitem">
            {renderItem(item, key)}
          </li>
        );
      }

      const isNodeItem = 'node' in item;
      const content = isNodeItem ? (
        <span className="logoloop__node" aria-hidden={!!item.href && !item.ariaLabel}>
          {item.node}
        </span>
      ) : (
        <img
          src={(item as any).src}
          srcSet={(item as any).srcSet}
          sizes={(item as any).sizes}
          width={(item as any).width}
          height={(item as any).height}
          alt={(item as any).alt ?? ''}
          title={(item as any).title}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      );

      const itemAriaLabel = isNodeItem
        ? (item.ariaLabel ?? (item as any).title)
        : ((item as any).alt ?? (item as any).title);

      const itemContent =
        item.href ? (
          <a
            className="logoloop__link"
            href={item.href}
            aria-label={itemAriaLabel || 'logo link'}
            target="_blank"
            rel="noreferrer noopener"
          >
            {content}
          </a>
        ) : (
          content
        );

      return (
        <li className="logoloop__item" key={key} role="listitem">
          {itemContent}
        </li>
      );
    },
    [renderItem]
  );

  /**
   * Generate logo lists (copies for seamless loop)
   */
  const logoLists = useMemo(
    () =>
      Array.from({ length: copyCount }, (_, copyIndex) => (
        <ul
          className="logoloop__list"
          key={`copy-${copyIndex}`}
          role="list"
          aria-hidden={copyIndex > 0}
          ref={copyIndex === 0 ? seqRef : undefined}
        >
          {logos.map((item, itemIndex) => renderLogoItem(item, `${copyIndex}-${itemIndex}`))}
        </ul>
      )),
    [copyCount, logos, renderLogoItem]
  );

  /**
   * Container inline styles
   */
  const containerStyle = useMemo(
    () => ({
      width: isVertical ? (toCssLength(width) === '100%' ? undefined : toCssLength(width)) : toCssLength(width) ?? '100%',
      ...cssVariables,
      ...style,
    } as CSSProperties),
    [width, cssVariables, style, isVertical]
  );

  return (
    <div
      ref={containerRef}
      className={rootClassName}
      style={containerStyle}
      role="region"
      aria-label={ariaLabel}
    >
      <div
        className="logoloop__track"
        ref={trackRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {logoLists}
      </div>
    </div>
  );
};

LogoLoopComponent.displayName = 'LogoLoop';

const LogoLoop = memo(LogoLoopComponent);
export default LogoLoop;
