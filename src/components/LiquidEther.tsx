'use client';

import type { LiquidEtherProps } from '@/types';

const LiquidEther = ({ className = '', style }: LiquidEtherProps) => {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative h-full w-full overflow-hidden ${className}`.trim()}
      style={style}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(96,165,250,0.28),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(168,85,247,0.22),transparent_26%),radial-gradient(circle_at_50%_80%,rgba(34,211,238,0.18),transparent_30%),linear-gradient(180deg,rgba(5,6,10,0.05),rgba(5,6,10,0.35))] opacity-90 blur-2xl" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-25 [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
      <div className="absolute -inset-1 animate-[etherFloat_14s_ease-in-out_infinite] bg-[radial-gradient(circle_at_35%_35%,rgba(59,130,246,0.14),transparent_26%),radial-gradient(circle_at_65%_60%,rgba(236,72,153,0.11),transparent_24%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_30%)] opacity-80" />
      <style jsx>{`
        @keyframes etherFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(0, -12px, 0) scale(1.03);
          }
        }
      `}</style>
    </div>
  );
};

export default LiquidEther;