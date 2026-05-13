/**
 * BrandHeader Component
 *
 * Displays the site branding with logo/miniavatar and title
 */

'use client';

import React, { ReactElement, useState, useEffect } from 'react';
import Image from 'next/image';
import portfolioStore from '@/utils/portfolioStore';

interface BrandHeaderProps {
  className?: string;
  compact?: boolean;
}

const BrandHeader = ({ className = '', compact = false }: BrandHeaderProps): ReactElement => {
  const [miniAvatarUrl, setMiniAvatarUrl] = useState<string>('/avatar-placeholder.jpg');

  useEffect(() => {
    const unsub = portfolioStore.subscribe((state) => {
      const url = state.profile?.miniAvatar || state.profile?.avatar || '/avatar-placeholder.jpg';
      setMiniAvatarUrl(url);
    });
    return () => {
      unsub();
    };
  }, []);

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`.trim()}>
        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={miniAvatarUrl}
            alt="Zhandev Logo"
            width={24}
            height={24}
            style={{ objectFit: 'cover' }}
            priority={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-white/20">
        <Image
          src={miniAvatarUrl}
          alt="Zhandev Logo"
          width={32}
          height={32}
          style={{ objectFit: 'cover' }}
          priority={false}
        />
      </div>
    </div>
  );
};

BrandHeader.displayName = 'BrandHeader';
export default BrandHeader;
