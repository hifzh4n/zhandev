/**
 * Dock Component
 * 
 * A Mac-style dock menu with magnification effect on hover.
 * Uses Framer Motion for smooth spring animations.
 */

'use client';

import React, { ReactElement, ReactNode, Children, cloneElement, useEffect, useRef } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, MotionValue } from 'motion/react';
import type { DockItemConfig } from '@/types';
import { DOCK, ANIMATION_TIMINGS } from '@/constants';
import './Dock.css';

/**
 * Spring animation configuration type
 */
interface SpringConfig {
  mass: number;
  stiffness: number;
  damping: number;
}

/**
 * DockItem component props
 */
interface DockItemProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  mouseX: MotionValue<number>;
  spring: SpringConfig;
  distance: number;
  magnification: number;
  baseItemSize: number;
  ariaLabel?: string;
  ariaCurrent?: 'page';
}

/**
 * DockLabel component props
 */
interface DockLabelProps {
  children: ReactNode;
  className?: string;
  isHovered?: MotionValue<number>;
}

/**
 * DockIcon component props
 */
interface DockIconProps {
  children: ReactNode;
  className?: string;
}

/**
 * DockItem Component
 * 
 * Individual dock item with hover magnification effect
 */
const DockItem = React.forwardRef<
  HTMLButtonElement,
  DockItemProps
>(
  (
    {
      children,
      className = '',
      onClick,
      mouseX,
      spring,
      distance,
      magnification,
      baseItemSize,
      ariaLabel,
      ariaCurrent,
    },
    ref
  ) => {
    const itemRef = useRef<HTMLButtonElement>(null);
    const isHovered = useMotionValue(0);

    /**
     * Calculate distance between mouse and item
     */
    const mouseDistance = useTransform(mouseX, (val: number) => {
      const rect = itemRef.current?.getBoundingClientRect() ?? {
        x: 0,
        width: baseItemSize,
      };
      return val - rect.x - rect.width / 2;
    });

    /**
     * Transform distance to scale factor
     */
    const targetScale = useTransform(mouseDistance, [-distance, 0, distance], [1, magnification / baseItemSize, 1]);
    const scale = useSpring(targetScale, spring);

    return (
      <motion.button
        ref={itemRef}
        type="button"
        style={{
          width: baseItemSize,
          height: baseItemSize,
          scale,
          transformOrigin: 'center bottom',
        }}
        onHoverStart={() => isHovered.set(1)}
        onHoverEnd={() => isHovered.set(0)}
        onFocus={() => isHovered.set(1)}
        onBlur={() => isHovered.set(0)}
        onClick={onClick}
        className={`dock-item ${className} dock-item--motion`.trim()}
        tabIndex={0}
        aria-label={ariaLabel}
        aria-current={ariaCurrent}
      >
        {Children.map(children, (child) =>
          cloneElement(child as React.ReactElement<any>, { isHovered })
        )}
      </motion.button>
    );
  }
);

DockItem.displayName = 'DockItem';

/**
 * DockLabel Component
 * 
 * Tooltip label that appears on item hover
 */
const DockLabel = ({
  children,
  className = '',
  isHovered,
}: DockLabelProps): ReactElement => {
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on('change', (latest: number) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: ANIMATION_TIMINGS.FAST / 1000 }}
          className={`dock-label ${className}`.trim()}
          role="tooltip"
          style={{ x: '-50%' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * DockIcon Component
 * 
 * Container for dock item icon
 */
const DockIcon = ({ children, className = '' }: DockIconProps): ReactElement => {
  return <div className={`dock-icon ${className}`.trim()}>{children}</div>;
};

/**
 * Dock Component
 * 
 * Mac-style dock menu with magnification on hover
 * 
 * @component
 * @example
 * ```tsx
 * const items = [
 *   { icon: <HomeIcon />, label: 'Home', onClick: () => {} },
 *   { icon: <AboutIcon />, label: 'About', onClick: () => {} },
 * ];
 * 
 * <Dock items={items} magnification={70} />
 * ```
 */
interface DockProps {
  items: DockItemConfig[];
  className?: string;
  spring?: SpringConfig;
  magnification?: number;
  distance?: number;
  panelHeight?: number;
  dockHeight?: number;
  baseItemSize?: number;
  ariaLabel?: string;
}

const DockComponent = ({
  items,
  className = '',
  spring = DOCK.SPRING_CONFIG,
  magnification = DOCK.MAGNIFICATION,
  distance = DOCK.DISTANCE,
  panelHeight = DOCK.PANEL_HEIGHT,
  dockHeight = DOCK.DOCK_HEIGHT,
  baseItemSize = DOCK.BASE_ITEM_SIZE,
}: DockProps): ReactElement => {
  const mouseX = useMotionValue(Infinity);
  const rafId = useRef<number>(0);

  /**
   * Clean up animation frame on unmount
   */
  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  /**
   * Updates mouse X position with requestAnimationFrame throttling
   */
  const setMouseX = (pageX: number): void => {
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      mouseX.set(pageX);
    });
  };

  return (
    <div className="dock-outer">
      <motion.div
        onPointerMove={({ clientX }) => {
          setMouseX(clientX);
        }}
        onPointerLeave={() => {
          mouseX.set(Infinity);
        }}
        className={`dock-panel ${className}`.trim()}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock navigation"
      >
        {items.map((item, index) => (
          <DockItem
            key={`dock-item-${index}`}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
            ariaLabel={item.label}
            ariaCurrent={item.isActive ? 'page' : undefined}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </div>
  );
};

DockComponent.displayName = 'Dock';

const Dock = React.memo(DockComponent);
export default Dock;

export { DockLabel, DockIcon };
