import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Skeleton = ({
  className = '',
  variant = 'rectangular', // 'text' | 'circular' | 'rectangular'
  width,
  height,
}) => {
  const baseClasses = 'animate-pulse bg-slate-200/80 rounded-[8px]';

  const variants = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-card',
  };

  const inlineStyles = {};
  if (width) inlineStyles.width = width;
  if (height) inlineStyles.height = height;

  return (
    <div
      style={inlineStyles}
      className={twMerge(clsx(baseClasses, variants[variant], className))}
      aria-hidden="true"
    />
  );
};

export default Skeleton;

