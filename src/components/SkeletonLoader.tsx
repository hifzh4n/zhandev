'use client';

interface SkeletonLoaderProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
}

export default function SkeletonLoader({
  width = '100%',
  height = '200px',
  borderRadius = '8px',
  className = '',
}: SkeletonLoaderProps) {
  return (
    <div
      className={`bg-gradient-to-r from-white/10 via-white/5 to-white/10 animate-pulse ${className}`}
      style={{
        width,
        height,
        borderRadius,
      }}
      aria-hidden="true"
    />
  );
}
