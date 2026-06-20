'use client';

import type { CSSProperties, ReactNode } from 'react';
import './GlitchText.css';

type GlitchTextProps = {
  children: ReactNode;
  speed?: number;
  enableShadows?: boolean;
  enableOnHover?: boolean;
  className?: string;
};

type GlitchStyle = CSSProperties & {
  '--after-duration': string;
  '--before-duration': string;
  '--after-shadow': string;
  '--before-shadow': string;
};

export default function GlitchText({
  children,
  speed = 1,
  enableShadows = true,
  enableOnHover = true,
  className = '',
}: GlitchTextProps) {
  const text = typeof children === 'string' ? children : '';
  const inlineStyles: GlitchStyle = {
    '--after-duration': `${speed * 3}s`,
    '--before-duration': `${speed * 2}s`,
    '--after-shadow': enableShadows ? '-5px 0 red' : 'none',
    '--before-shadow': enableShadows ? '5px 0 cyan' : 'none',
  };

  const hoverClass = enableOnHover ? 'enable-on-hover' : '';

  return (
    <h1 className={`glitch ${hoverClass} ${className}`.trim()} style={inlineStyles} data-text={text}>
      {children}
    </h1>
  );
}
