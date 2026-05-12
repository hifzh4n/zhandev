/**
 * ProfileCard Component
 * 
 * An interactive profile card with tilt effects, hover animations, and customizable content.
 * Features include 3D tilt on mouse movement, smooth transitions, and responsive design.
 */

'use client';

import React, { ReactElement, useEffect, useRef, useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import type { ProfileCardProps } from '@/types';
import { clamp, round, mapRange } from '@/utils/math';
import { PROFILE_CARD, ANIMATION_TIMINGS } from '@/constants';
import './ProfileCard.css';
import portfolioStore from '@/utils/portfolioStore';

// Animation configuration constants
const ANIMATION_CONFIG = {
  INITIAL_DURATION: ANIMATION_TIMINGS.SLOW,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
  ENTER_TRANSITION_MS: ANIMATION_TIMINGS.FAST,
  DEFAULT_TAU: 0.14,
  INITIAL_TAU: 0.6,
  SETTLE_THRESHOLD: 0.6,
} as const;

const DEFAULT_INNER_GRADIENT = 'linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)';

/**
 * Tilt engine interface for managing 3D rotation
 */
interface TiltEngine {
  setImmediate: (x: number, y: number) => void;
  setTarget: (x: number, y: number) => void;
  toCenter: () => void;
  beginInitial: (durationMs: number) => void;
  getCurrent: () => { x: number; y: number; tx: number; ty: number };
  cancel: () => void;
}

/**
 * Offset coordinates type
 */
interface Offset {
  x: number;
  y: number;
}

/**
 * ProfileCard Component
 * 
 * @component
 * @example
 * ```tsx
 * <ProfileCard
 *   name="John Doe"
 *   title="Full-Stack Developer"
 *   handle="johndoe"
 *   status="Online"
 *   avatarUrl="/avatar.jpg"
 *   contactText="GitHub"
 *   contactUrl="https://github.com/johndoe"
 * />
 * ```
 */
const ProfileCardComponent = ({
  avatarUrl = '',
  iconUrl = '',
  grainUrl = '',
  innerGradient,
  behindGlowEnabled = true,
  behindGlowColor,
  behindGlowSize,
  className = '',
  enableTilt = true,
  enableMobileTilt = false,
  mobileTiltSensitivity = 5,
  miniAvatarUrl,
  name = PROFILE_CARD.DEFAULT_NAME,
  title = PROFILE_CARD.DEFAULT_TITLE,
  handle = PROFILE_CARD.DEFAULT_HANDLE,
  status = PROFILE_CARD.DEFAULT_STATUS,
  contactText = 'Contact',
  showUserInfo = true,
  showHeader = true,
  contactUrl,
  onContactClick,
}: ProfileCardProps): ReactElement => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  const enterTimerRef = useRef<number | null>(null);
  const leaveRafRef = useRef<number | null>(null);

  /**
   * Creates and manages the tilt engine for 3D rotation effects
   */
  const tiltEngine = useMemo<TiltEngine | null>(() => {
    if (!enableTilt) return null;

    let rafId: number | null = null;
    let running = false;
    let lastTs = 0;

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let initialUntil = 0;

    /**
     * Updates CSS variables based on pointer position
     */
    const setVarsFromXY = (x: number, y: number): void => {
      const shell = shellRef.current;
      const wrap = wrapRef.current;
      if (!shell || !wrap) return;

      const width = shell.clientWidth || 1;
      const height = shell.clientHeight || 1;

      const percentX = clamp((100 / width) * x);
      const percentY = clamp((100 / height) * y);

      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const properties: Record<string, string> = {
        '--pointer-x': `${percentX}%`,
        '--pointer-y': `${percentY}%`,
        '--background-x': `${mapRange(percentX, 0, 100, 35, 65)}%`,
        '--background-y': `${mapRange(percentY, 0, 100, 35, 65)}%`,
        '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        '--pointer-from-top': `${percentY / 100}`,
        '--pointer-from-left': `${percentX / 100}`,
        '--rotate-x': `${round(-(centerX / 5))}deg`,
        '--rotate-y': `${round(centerY / 4)}deg`,
      };

      for (const [key, value] of Object.entries(properties)) {
        wrap.style.setProperty(key, value);
      }
    };

    /**
     * Animation frame step handler
     */
    const step = (ts: number): void => {
      if (!running) return;
      if (lastTs === 0) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      const tau = ts < initialUntil ? ANIMATION_CONFIG.INITIAL_TAU : ANIMATION_CONFIG.DEFAULT_TAU;
      const k = 1 - Math.exp(-dt / tau);

      currentX += (targetX - currentX) * k;
      currentY += (targetY - currentY) * k;

      setVarsFromXY(currentX, currentY);

      const stillFar =
        Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05;

      if (stillFar || document.hasFocus()) {
        rafId = requestAnimationFrame(step);
      } else {
        running = false;
        lastTs = 0;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };

    /**
     * Starts the animation loop
     */
    const start = (): void => {
      if (running) return;
      running = true;
      lastTs = 0;
      rafId = requestAnimationFrame(step);
    };

    return {
      setImmediate(x: number, y: number): void {
        currentX = x;
        currentY = y;
        setVarsFromXY(currentX, currentY);
      },
      setTarget(x: number, y: number): void {
        targetX = x;
        targetY = y;
        start();
      },
      toCenter(): void {
        const shell = shellRef.current;
        if (!shell) return;
        this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2);
      },
      beginInitial(durationMs: number): void {
        initialUntil = performance.now() + durationMs;
        start();
      },
      getCurrent(): { x: number; y: number; tx: number; ty: number } {
        return { x: currentX, y: currentY, tx: targetX, ty: targetY };
      },
      cancel(): void {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        running = false;
        lastTs = 0;
      },
    };
  }, [enableTilt]);

  /**
   * Gets pointer offset relative to element
   */
  const getOffsets = useCallback((event: PointerEvent, el: HTMLElement): Offset => {
    const rect = el.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }, []);

  /**
   * Handles pointer move event
   */
  const handlePointerMove = useCallback(
    (event: PointerEvent): void => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;
      const { x, y } = getOffsets(event as PointerEvent, shell);
      tiltEngine.setTarget(x, y);
    },
    [tiltEngine, getOffsets]
  );

  /**
   * Handles pointer enter event
   */
  const handlePointerEnter = useCallback(
    (event: PointerEvent): void => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;

      shell.classList.add('active');
      shell.classList.add('entering');
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      enterTimerRef.current = window.setTimeout(() => {
        shell?.classList.remove('entering');
      }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);

      const { x, y } = getOffsets(event as PointerEvent, shell);
      tiltEngine.setTarget(x, y);
    },
    [tiltEngine, getOffsets]
  );

  /**
   * Handles pointer leave event
   */
  const handlePointerLeave = useCallback((): void => {
    const shell = shellRef.current;
    if (!shell || !tiltEngine) return;

    tiltEngine.toCenter();

    const checkSettle = (): void => {
      const { x, y, tx, ty } = tiltEngine.getCurrent();
      const settled = Math.hypot(tx - x, ty - y) < ANIMATION_CONFIG.SETTLE_THRESHOLD;
      if (settled) {
        shell.classList.remove('active');
        leaveRafRef.current = null;
      } else {
        leaveRafRef.current = requestAnimationFrame(checkSettle);
      }
    };
    if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
    leaveRafRef.current = requestAnimationFrame(checkSettle);
  }, [tiltEngine]);

  /**
   * Handles device orientation event for mobile tilt
   */
  const handleDeviceOrientation = useCallback(
    (event: any): void => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;

      const { beta, gamma } = event;
      if (beta == null || gamma == null) return;

      const centerX = shell.clientWidth / 2;
      const centerY = shell.clientHeight / 2;
      const x = clamp(centerX + gamma * mobileTiltSensitivity, 0, shell.clientWidth);
      const y = clamp(
        centerY + (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity,
        0,
        shell.clientHeight
      );

      tiltEngine.setTarget(x, y);
    },
    [tiltEngine, mobileTiltSensitivity]
  );

  /**
   * Set up event listeners for tilt interactions
   */
  useEffect(() => {
    if (!enableTilt || !tiltEngine) return;

    const shell = shellRef.current;
    if (!shell) return;

    const pointerMoveHandler = (e: Event) => handlePointerMove(e as PointerEvent);
    const pointerEnterHandler = (e: Event) => handlePointerEnter(e as PointerEvent);
    const pointerLeaveHandler = () => handlePointerLeave();
    const deviceOrientationHandler = handleDeviceOrientation;

    shell.addEventListener('pointermove', pointerMoveHandler);
    shell.addEventListener('pointerenter', pointerEnterHandler);
    shell.addEventListener('pointerleave', pointerLeaveHandler);

    const handleClick = (): void => {
      if (!enableMobileTilt || location.protocol !== 'https:') return;
      const anyMotion = (window as any).DeviceMotionEvent;
      if (anyMotion && typeof anyMotion.requestPermission === 'function') {
        anyMotion
          .requestPermission()
          .then((state: string) => {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', deviceOrientationHandler);
            }
          })
          .catch((error: Error) => {
            console.error('Device motion permission denied:', error);
          });
      } else {
        window.addEventListener('deviceorientation', deviceOrientationHandler);
      }
    };
    shell.addEventListener('click', handleClick);

    const initialX = (shell.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
    tiltEngine.setImmediate(initialX, initialY);
    tiltEngine.toCenter();
    tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);

    return () => {
      shell.removeEventListener('pointermove', pointerMoveHandler);
      shell.removeEventListener('pointerenter', pointerEnterHandler);
      shell.removeEventListener('pointerleave', pointerLeaveHandler);
      shell.removeEventListener('click', handleClick);
      window.removeEventListener('deviceorientation', deviceOrientationHandler);
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
      tiltEngine.cancel();
      shell.classList.remove('entering');
    };
  }, [enableTilt, enableMobileTilt, tiltEngine, handlePointerMove, handlePointerEnter, handlePointerLeave, handleDeviceOrientation]);

  /**
   * Memoize card styles to prevent unnecessary recalculations
   */
  const cardStyle = useMemo(
    () => ({
      '--icon': iconUrl ? `url(${iconUrl})` : 'none',
      '--grain': grainUrl ? `url(${grainUrl})` : 'none',
      '--inner-gradient': innerGradient ?? DEFAULT_INNER_GRADIENT,
      '--behind-glow-color': behindGlowColor ?? 'rgba(125, 190, 255, 0.67)',
      '--behind-glow-size': behindGlowSize ?? PROFILE_CARD.GLOW_SIZE,
    } as React.CSSProperties),
    [iconUrl, grainUrl, innerGradient, behindGlowColor, behindGlowSize]
  );

  // profile from store (fallbacks when props not provided)
  const [storedProfile, setStoredProfile] = useState<Record<string, any>>(() => ({}));
  useEffect(() => {
    const unsub = portfolioStore.subscribe((s) => setStoredProfile(s.profile || {}));
    return () => {
      unsub();
    };
  }, []);

  /**
   * Handle contact button click
   */
  const handleContactClick = useCallback((): void => {
    onContactClick?.();
  }, [onContactClick]);

  // `onMenuClick` removed — menu button was removed from the UI

  return (
    <div ref={wrapRef} className={`pc-card-wrapper ${className}`.trim()} style={cardStyle}>
      {behindGlowEnabled && <div className="pc-behind" />}
      <div ref={shellRef} className="pc-card-shell">
        <section className="pc-card">
          <div className="pc-inside">
            <div className="pc-shine" />
            <div className="pc-glare" />
            <div className="pc-content pc-avatar-content">
              <div className="avatar-fill">
                <Image
                  src={avatarUrl || storedProfile.avatar || '/avatar-placeholder.jpg'}
                  alt={`${name} avatar`}
                  fill
                  sizes="(max-width: 768px) 70vw, 420px"
                  style={{ objectFit: 'cover' }}
                  priority={false}
                  onError={() => {
                    console.error(`Failed to load avatar image: ${avatarUrl}`);
                  }}
                />
              </div>
              {showUserInfo && (
                <div className="pc-user-info">
                  <div className="pc-user-details">
                    <div className="pc-mini-avatar">
                      <Image
                        src={miniAvatarUrl || storedProfile.miniAvatar || storedProfile.avatar || '/avatar-placeholder.jpg'}
                        alt={`${name} mini avatar`}
                        width={48}
                        height={48}
                        style={{ objectFit: 'cover', borderRadius: '50%' }}
                        priority={false}
                      />
                    </div>
                    <div className="pc-user-text">
                      <div className="pc-handle">@{handle}</div>
                      <div className="pc-status">{status}</div>
                    </div>
                  </div>
                  {contactUrl ? (
                    <a
                      className="pc-contact-btn"
                      href={contactUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${name} profile`}
                    >
                      {contactText}
                    </a>
                  ) : (
                    <button
                      className="pc-contact-btn"
                      onClick={handleContactClick}
                      type="button"
                      aria-label={`Contact ${name}`}
                    >
                      {contactText}
                    </button>
                  )}
                  {/* Menu button removed per request */}
                </div>
              )}
            </div>
            {showHeader && (
              <div className="pc-content">
                <div className="pc-details">
                  <h3>{name}</h3>
                  <p>{title}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

ProfileCardComponent.displayName = 'ProfileCard';

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;
