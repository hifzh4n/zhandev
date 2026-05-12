/**
 * DockNav Component
 * 
 * Navigation dock that provides quick access to major page sections.
 * Uses scroll-smooth behavior to navigate to different parts of the page.
 */

'use client';

import React, { ReactElement } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  VscHome,
  VscSymbolMethod,
  VscBriefcase,
  VscVerified,
  VscProject,
} from 'react-icons/vsc';
import Dock from '@/components/Dock';
import type { DockItemConfig } from '@/types';

/**
 * DockNav Component
 * 
 * Renders a dock-based navigation menu for page sections.
 * Highlights the current active route.
 * 
 * @component
 * @example
 * ```tsx
 * <DockNav />
 * ```
 */
const DockNav = (): ReactElement => {
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems: DockItemConfig[] = [
    {
      icon: <VscHome size={18} />,
      label: 'Home',
      onClick: () => {
        router.push('/');
      },
      isActive: pathname === '/',
      className: pathname === '/' ? 'dock-item--active' : '',
    },
    {
      icon: <VscSymbolMethod size={18} />,
      label: 'Education',
      onClick: () => {
        router.push('/education');
      },
      isActive: pathname === '/education',
      className: pathname === '/education' ? 'dock-item--active' : '',
    },
    {
      icon: <VscBriefcase size={18} />,
      label: 'Experience',
      onClick: () => {
        router.push('/experience');
      },
      isActive: pathname === '/experience',
      className: pathname === '/experience' ? 'dock-item--active' : '',
    },
    {
      icon: <VscVerified size={18} />,
      label: 'Achievements',
      onClick: () => {
        router.push('/achievements');
      },
      isActive: pathname === '/achievements',
      className: pathname === '/achievements' ? 'dock-item--active' : '',
    },
    {
      icon: <VscProject size={18} />,
      label: 'Projects',
      onClick: () => {
        router.push('/projects');
      },
      isActive: pathname === '/projects',
      className: pathname === '/projects' ? 'dock-item--active' : '',
    },
  ];

  return (
    <Dock
      items={navigationItems}
      panelHeight={68}
      baseItemSize={50}
      magnification={70}
      ariaLabel="Main navigation"
    />
  );
};

DockNav.displayName = 'DockNav';

export default DockNav;
