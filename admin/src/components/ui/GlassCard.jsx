import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const GlassCard = React.forwardRef(({
  children,
  className = '',
  dark = false,
  hoverable = true,
  onClick,
  ...props
}, ref) => {
  const baseClasses = 'relative rounded-card transition-all duration-200';
  const surfaceStyle = dark
    ? 'bg-slate-900/90 text-white border border-slate-800 shadow-elevated backdrop-blur-md'
    : 'bg-white/85 text-text-primary border border-border-subtle shadow-subtle backdrop-blur-md';
  const hoverEffect = hoverable
    ? 'hover:-translate-y-0.5 hover:shadow-elevated hover:border-slate-300'
    : '';

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={twMerge(clsx(baseClasses, surfaceStyle, hoverEffect, className))}
      {...props}
    >
      {children}
    </div>
  );
});

GlassCard.displayName = 'GlassCard';
export default GlassCard;

