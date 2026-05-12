'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { LIQUID_ETHER_CONFIG } from '@/constants/config';

const LiquidEther = dynamic(() => import('@/components/LiquidEther'), { ssr: false });

type LiquidEtherBackgroundProps = {
  className?: string;
};

export default function LiquidEtherBackground({ className = '' }: LiquidEtherBackgroundProps) {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 860px)');

    const update = () => {
      setIsCompact(mediaQuery.matches);
    };

    update();

    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  const liquidEtherConfig = {
    ...LIQUID_ETHER_CONFIG,
    resolution: isCompact ? 0.22 : LIQUID_ETHER_CONFIG.resolution,
    iterationsViscous: isCompact ? 12 : LIQUID_ETHER_CONFIG.iterationsViscous,
    iterationsPoisson: isCompact ? 12 : LIQUID_ETHER_CONFIG.iterationsPoisson,
    autoIntensity: isCompact ? 1.7 : LIQUID_ETHER_CONFIG.autoIntensity,
    cursorSize: isCompact ? 82 : LIQUID_ETHER_CONFIG.cursorSize,
  };

  return (
    <div className={`absolute inset-0 ${className}`.trim()} aria-hidden="true">
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <LiquidEther {...liquidEtherConfig} />
      </div>
    </div>
  );
}