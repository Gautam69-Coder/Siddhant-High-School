import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  icon: Icon,
  iconPosition = 'left',
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-[10px] whitespace-nowrap transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand-interactive focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer select-none';

  const variants = {
    primary: 'bg-brand-primary text-white hover:bg-blue-950 shadow-subtle hover:shadow-md border border-brand-primary',
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-transparent',
    glass: 'bg-white/80 backdrop-blur-md text-slate-900 border border-slate-200/80 hover:bg-white shadow-subtle hover:shadow-elevated',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 border border-rose-600 shadow-subtle',
    outline: 'bg-transparent text-brand-primary border border-brand-primary hover:bg-blue-50',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-4 py-2.5 gap-2 h-10',
    lg: 'text-base px-6 py-3.5 gap-2.5 h-12',
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;

