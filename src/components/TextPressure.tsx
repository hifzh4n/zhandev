'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type TextPressureProps = {
  text?: string;
  fontFamily?: string;
  fontUrl?: string;
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  alpha?: boolean;
  flex?: boolean;
  stroke?: boolean;
  scale?: boolean;
  textColor?: string;
  strokeColor?: string;
  className?: string;
  minFontSize?: number;
};

type Point = {
  x: number;
  y: number;
};

const dist = (a: Point, b: Point): number => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const getAttr = (distance: number, maxDist: number, minVal: number, maxVal: number): number => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);
  return Math.max(minVal, val + minVal);
};

const debounce = <T extends (...args: unknown[]) => void>(func: T, delay: number) => {
  let timeoutId: ReturnType<typeof window.setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (timeoutId) window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      func(...args);
    }, delay);
  };
};

/**
 * TextPressure renders variable-font text that responds to cursor pressure.
 */
export default function TextPressure({
  text = 'Compressa',
  fontFamily = 'Compressa VF',
  fontUrl = 'https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2',
  width = true,
  weight = true,
  italic = true,
  alpha = false,
  flex = true,
  stroke = false,
  scale = false,
  textColor = '#FFFFFF',
  strokeColor = '#FF0000',
  className = '',
  minFontSize = 24,
}: TextPressureProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);
  const mouseRef = useRef<Point>({ x: 0, y: 0 });
  const cursorRef = useRef<Point>({ x: 0, y: 0 });
  const rafIdRef = useRef<number | null>(null);

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);

  const lines = useMemo(() => text.split('\n'), [text]);
  const longestLineLength = useMemo(() => Math.max(...lines.map((line) => line.length), 1), [lines]);
  const chars = useMemo(() => lines.flatMap((line) => line.split('')), [lines]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      cursorRef.current.x = event.clientX;
      cursorRef.current.y = event.clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      cursorRef.current.x = touch.clientX;
      cursorRef.current.y = touch.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const container = containerRef.current;
    if (container) {
      const { left, top, width: containerWidth, height: containerHeight } = container.getBoundingClientRect();
      mouseRef.current.x = left + containerWidth / 2;
      mouseRef.current.y = top + containerHeight / 2;
      cursorRef.current.x = mouseRef.current.x;
      cursorRef.current.y = mouseRef.current.y;
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const setSize = useCallback(() => {
    const container = containerRef.current;
    const title = titleRef.current;
    if (!container || !title) return;

    const { width: containerW, height: containerH } = container.getBoundingClientRect();

    let newFontSize = containerW / (longestLineLength / 2);
    newFontSize = Math.max(newFontSize, minFontSize);

    setFontSize(newFontSize);
    setScaleY(1);
    setLineHeight(1);

    requestAnimationFrame(() => {
      if (!titleRef.current) return;
      const textRect = titleRef.current.getBoundingClientRect();

      if (scale && textRect.height > 0) {
        const yRatio = containerH / textRect.height;
        setScaleY(yRatio);
        setLineHeight(yRatio);
      }
    });
  }, [longestLineLength, minFontSize, scale]);

  useEffect(() => {
    const debouncedSetSize = debounce(setSize, 100);
    debouncedSetSize();
    window.addEventListener('resize', debouncedSetSize);
    return () => window.removeEventListener('resize', debouncedSetSize);
  }, [setSize]);

  useEffect(() => {
    const animate = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;

      const title = titleRef.current;
      if (title) {
        const titleRect = title.getBoundingClientRect();
        const maxDist = titleRect.width / 2;

        spansRef.current.forEach((span) => {
          if (!span) return;

          const rect = span.getBoundingClientRect();
          const charCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
          };

          const d = dist(mouseRef.current, charCenter);
          const wdth = width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100;
          const wght = weight ? Math.floor(getAttr(d, maxDist, 100, 900)) : 400;
          const italVal = italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : '0';
          const alphaVal = alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : '1';
          const newFontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;

          if (span.style.fontVariationSettings !== newFontVariationSettings) {
            span.style.fontVariationSettings = newFontVariationSettings;
          }

          if (alpha && span.style.opacity !== alphaVal) {
            span.style.opacity = alphaVal;
          }
        });
      }

      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, [width, weight, italic, alpha]);

  const dynamicClassName = [className, flex ? 'text-pressure-flex' : '', stroke ? 'text-pressure-stroke' : '']
    .filter(Boolean)
    .join(' ');

  const styleElement = useMemo(
    () => (
      <style>{`
        @font-face {
          font-family: '${fontFamily}';
          src: url('${fontUrl}');
          font-style: normal;
        }

        .text-pressure-flex {
          display: flex;
          justify-content: space-between;
        }

        .text-pressure-lines {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.02em;
        }

        .text-pressure-line {
          display: flex;
          justify-content: center;
          gap: 0;
          width: 100%;
          white-space: nowrap;
        }

        .text-pressure-stroke span {
          position: relative;
          color: ${textColor};
        }

        .text-pressure-stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke-width: 3px;
          -webkit-text-stroke-color: ${strokeColor};
        }

        .text-pressure-title {
          color: ${textColor};
        }
      `}</style>
    ),
    [fontFamily, fontUrl, textColor, strokeColor]
  );

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'transparent',
      }}
    >
      {styleElement}
      <h1
        ref={titleRef}
        className={`text-pressure-title ${dynamicClassName}`.trim()}
        style={{
          fontFamily,
          textTransform: 'uppercase',
          fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          transformOrigin: 'center top',
          margin: 0,
          textAlign: 'center',
          userSelect: 'none',
          whiteSpace: 'pre-wrap',
          fontWeight: 100,
          width: '100%',
        }}
      >
        <span className="text-pressure-lines">
          {lines.map((line, lineIndex) => (
            <span className="text-pressure-line" key={`${line}-${lineIndex}`}>
              {line.split('').map((char, charIndex) => {
                const flatIndex = lines.slice(0, lineIndex).reduce((count, currentLine) => count + currentLine.length, 0) + charIndex;
                return (
                  <span
                    key={`${char}-${lineIndex}-${charIndex}`}
                    ref={(element) => {
                      spansRef.current[flatIndex] = element;
                    }}
                    data-char={char}
                    style={{
                      display: 'inline-block',
                      color: stroke ? undefined : textColor,
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </span>
          ))}
        </span>
      </h1>
    </div>
  );
}
