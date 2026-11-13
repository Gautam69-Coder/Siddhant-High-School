import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full border tracking-wide uppercase font-sans select-none';

  const variants = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    brand: 'bg-blue-50 text-blue-900 border-blue-200',
    approved: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    pending: 'bg-amber-50 text-amber-800 border-amber-200',
    rejected: 'bg-rose-50 text-rose-800 border-rose-200',
    distinction: 'bg-amber-100 text-amber-900 border-amber-300 font-semibold',
    innovation: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  };

  const dotColors = {
    neutral: 'bg-slate-400',
    brand: 'bg-blue-600',
    approved: 'bg-emerald-500',
    pending: 'bg-amber-500',
    rejected: 'bg-rose-500',
    distinction: 'bg-amber-500',
    innovation: 'bg-emerald-500',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  };

  return (
    <span className={twMerge(clsx(baseClasses, variants[variant], sizes[size], className))}>
      {dot && (
        <span
          className={clsx('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant] || 'bg-current')}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
};

export default Badge;

